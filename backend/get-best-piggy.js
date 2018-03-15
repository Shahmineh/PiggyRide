const express = require('express');
const app = express();

// import classes
const Order = require('./order.class');
const Piggy = require('./piggy.class');
const Session = require('./session.class');
const User = require('./user.class');
const Waypoint = require('./waypoint.class');
const Extra = require('./extra.class');

let OrderModel = new Order(app).myModel;
let PiggyModel = new Piggy(app).myModel;
let SessionModel = new Session(app).myModel;
let UserModel = new User(app).myModel;
let ExtraModel = new Extra(app).myModel;
let WaypointModel;

(async () => {
  let waypoint = await Waypoint.create(app, {
    from: 'Nordenskiöldsgatan 13',
    to: 'Ön',
    startTime: new Date()
  });
  WaypointModel = waypoint.myModel;
  getBestPiggy();
})();

async function getBestPiggy (pickupAddress, time) {
  PiggyModel.find()
    .populate('orders')
    .exec((err, piggies) => {
      if (err) return console.log(err);

      for (let piggy of piggies) {
        if (piggy.orders.length > 0) {
          OrderModel.findOne(piggy.orders[0])
            .populate('waypoints')
            .exec((err, piggy) => {
              if (err) return console.log(err);
              console.log(piggy.waypoints);
            });
        }
      }
    });

  // orders = orders.filter(
  //   (order, index, self) =>
  //     index === self.findIndex(_order => _order._id === order._id)
  // );

  //   for (let order of orders) {
  //     let dude = await Waypoint.findOne(`_id=${order.waypoints}`);
  //     console.log(dude);
  //   }

  //   console.log('orders filtered', orders);
}

// function getUnique (objArr = [{}]) {
//   objArr;
// }

getBestPiggy();
