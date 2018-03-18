/**
 *      ¯\_(⊙︿⊙)_/¯
 */

const scriptStartTime = new Date();
const dataJSON = require('./populate-database.json');
const express = require('express');
const app = express();

// import classes
const Order = require('./backend/order.class');
const Piggy = require('./backend/piggy.class');
const Session = require('./backend/session.class');
const User = require('./backend/user.class');
const Waypoint = require('./backend/waypoint.class');
const Extra = require('./backend/extra.class');

// define models
let order = new Order(app);
// leave order so we can close the connection later, since we create it last
let OrderModel = order.myModel;
let PiggyModel = new Piggy(app).myModel;
let SessionModel = new Session(app).myModel;
let UserModel = new User(app).myModel;
let ExtraModel = new Extra(app).myModel;
let WaypointModel;

// to remember all the db objects we've created, so we can add relations easy
let memory = {
  orders: [],
  piggies: [],
  sessions: [],
  users: [],
  extras: [],
  waypoints: []
};

// get the model for waypoint and then run
(async () => {
  let waypoint = await Waypoint.create(app, {
    from: 'Nordenskiöldsgatan 13',
    to: 'Ön',
    startTime: new Date()
  });
  WaypointModel = waypoint.myModel;
  renewCollections();
})();

function renewCollections () {
  SessionModel.remove({}, () => {
    importSessions();
    ExtraModel.remove({}, () => {
      importExtras();
      WaypointModel.remove({}, () => {
        importWaypoints();
        PiggyModel.remove({}, () => {
          importPiggies();
          UserModel.remove({}, () => {
            importUsers();
          });
        });
      });
    });
  });
}

// if needed call this on instead of renewCollections() at row 42~
function addToCollections () {
  importSessions();
  importExtras();
  importWaypoints();
  importPiggies();
  importUsers();
}

function importSessions () {
  for (let session of dataJSON.session) {
    let s = new SessionModel({
      data: session.data
    });
    s.save(e => {
      memory.sessions.push(s);
    });
  }
}

function importExtras () {
  for (let extra of dataJSON.extra) {
    let e = new ExtraModel({
      name: extra.name,
      stock: extra.stock,
      description: extra.description,
      price: extra.price,
      types: extra.types,
      contents: extra.contents
    });
    e.save(() => {});
    memory.extras.push(e);
  }
}

function importWaypoints () {
  for (let waypoint of dataJSON.waypoint) {
    let w = new WaypointModel({
      from: waypoint.from,
      to: waypoint.to,
      startTime: waypoint.startTime,
      startAddress: waypoint.startAddress,
      endAdress: waypoint.endAdress,
      duration: waypoint.duration,
      durationMinutes: waypoint.durationMinutes,
      endTime: waypoint.endTime,
      distance: waypoint.distance,
      speed: waypoint.speed,
      positions: waypoint.positions
    });
    w.save(() => {
      memory.waypoints.push(w);
    });
  }
}

function importPiggies () {
  let i = 0;
  for (let x = 0; x < 10; x++) {
    for (let piggy of dataJSON.piggy) {
      let p = new PiggyModel({
        type: piggy.type,
        number: i,
        description: piggy.description,
        price: piggy.price
      });
      p.save(() => {
        memory.piggies.push(p);
      });
      i++;
    }
  }
}

function importUsers () {
  for (let user of dataJSON.user) {
    let u = new UserModel({
      email: user.email,
      passwordHash: user.passwordHash,
      session: memory.sessions[rndI(memory.sessions)]
    });
    u.save(e => {
      memory.users.push(u);
      if (dataJSON.user.length === memory.users.length) {
        OrderModel.remove({}, () => {
          importOrders();
        });
      }
    });
  }
}

function rndI (item) {
  return Math.floor(Math.random() * item.length);
}

function importOrders () {
  let i = 0;
  let user = memory.users[rndI(memory.users)];
  let piggies = [
    memory.piggies[rndI(memory.piggies)],
    memory.piggies[rndI(memory.piggies)]
  ];
  let extras = [
    memory.extras[rndI(memory.extras)],
    memory.extras[rndI(memory.extras)]
  ];
  let wps = memory.waypoints;

  let totalPrice =
    piggies.map(pig => pig.price).reduce((prev, next) => prev + next) +
    extras.map(extra => extra.price).reduce((prev, next) => prev + next);

  let o = new OrderModel({
    refNr: i,
    orderTime: new Date(),
    totalPrice: totalPrice,
    user: user,
    extras: extras,
    piggies: piggies,
    waypoints: wps
  });

  o.save(e => {
    UserModel.update({ _id: user._id }, { $push: { orders: o } }).then(
      async () => {
        for (let [i, pig] of piggies.entries()) {
          await WaypointModel.update(
            { _id: wps[i]._id },
            { $push: { orders: o }, $set: { piggy: piggies[i] } }
          );
          await PiggyModel.update(
            { number: pig.number },
            { $push: { orders: o } }
          );
        }
        console.info(
          '\x1b[32m%s\x1b[0m 👌',
          'Done! ᕙ(⇀‸↼‶)ᕗ\nScript will now exit and close db connection, have fun with your DATA'
        );
        setTimeout(() => {
          order.closeConnection();
        }, 2500);
      }
    );
  });
}
