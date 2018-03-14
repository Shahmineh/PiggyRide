const express = require('express');
const app = express();

// import classes
const Order = require('./order.class');
const Piggy = require('./piggy.class');
const Session = require('./session.class');
const User = require('./user.class');
const Waypoint = require('./waypoint.class');
const Extra = require('./extra.class');

// define models
let order = new Order(app);
// leave order so we can close the connection later, since we create it last
let OrderModel = order.myModel;
let PiggyModel = new Piggy(app).myModel;
let SessionModel = new Session(app).myModel;
let UserModel = new User(app).myModel;
let ExtraModel = new Extra(app).myModel;
let WaypointModel;

async function getBestPiggy (pickupAddress, time) {
  let response = {};

  await UserModel.find()
    .populate('orders')
    .exec((err, story) => {
      if (err) {
        console.log(err);
      }
      let response = JSON.stringify(story, '', '  ');
    });

  let piggys = [];
  let orders = [];

  //   for (let piggy of response.result) {
  //     if (piggy.orders) {
  //       piggys.push(piggy);
  //       orders.push(await Order.findOne(`_id=${piggy.orders}`));
  //     }
  //   }

  //   orders = orders.filter(
  //     (order, index, self) =>
  //       index === self.findIndex(_order => _order._id === order._id)
  //   );

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
