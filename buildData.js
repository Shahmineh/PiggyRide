const dataJSON = require('./buildData.json');
const ModelAndRoutes = require('./backend/model-and-routes.class');
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
let OrderModel = new Order(app).myModel;
let PiggyModel = new Piggy(app).myModel;
let SessionModel = new Session(app).myModel;
let UserModel = new User(app).myModel;
let ExtraModel = new Extra(app).myModel;
let WaypointModel;

// to remember all the db objects we've created, so we can add relations easy
let memory = {
  orders: [],
  piggys: [],
  sessions: [],
  users: [],
  extras: [],
  waypoints: []
};

// get the model for waypoint and then run
(async () => {
  let waypoint = await Waypoint.create(app, {
    from: 'Nordenskiöldsgatan 13',
    to: 'Linnégatan 1',
    startTime: new Date('2018-03-02 13:00:00')
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
          importPiggys();
          UserModel.remove({}, () => {
            importUsers();
            OrderModel.remove({}, () => {
              importOrders();
            });
          });
        });
      });
    });
  });
}

function importOrders () {
  let i = 0;
  let selectedUser = memory.users[0];

  let o = new OrderModel({
    refNr: i,
    orderTime: new Date(),
    totalPrice: memory.piggys[0].price,
    user: selectedUser,
    extras: memory.extras[0],
    piggys: memory.piggys[0],
    waypoints: memory.waypoints[0]
  });

  o.save(e => {});

  console.log('selectedUser._id', selectedUser._id);
  UserModel.update(
    { _id: selectedUser._id },
    { $push: { orders: o } },
    () => {}
  );
}

function importExtras () {
  for (let extra of dataJSON.extra) {
    let e = new ExtraModel({
      name: extra.name,
      stock: extra.stock,
      description: extra.description,
      price: extra.price
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

function importPiggys () {
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
        memory.piggys.push(p);
      });
      i++;
    }
  }
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

function importUsers () {
  for (let user of dataJSON.user) {
    console.log(memory.sessions);
    let u = new UserModel({
      email: user.email,
      passwordHash: user.passwordHash,
      session: memory.sessions[0]
    });
    u.save(e => {
      memory.users.push(u);
    });
  }
}
