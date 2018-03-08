const dataJSON = require('./buildData.json');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
mongoose.connect('mongodb://localhost/mpr');
const db = mongoose.connection;
db.on('error', e => {
  console.error(e);
});
db.once('open', () => {
  console.info('db connected');
});

const Order = require('./backend/order.class');
const Piggy = require('./backend/piggy.class');
const Session = require('./backend/session.class');
const User = require('./backend/user.class');
const Waypoint = require('./backend/waypoint.class');

let orderModel = new Order(app).myModel;
let piggyModel = new Piggy(app).myModel;
let sessionModel = new Session(app).myModel;
let userModel = new User(app).myModel;

let orderMem = {};
let piggyMem = {};
let sessionMem = {};
let userMem = {};

(async () => {
  let waypoint = await Waypoint.create(app, {
    from: 'Sallerupsvägen 26B',
    to: 'Björkholmsgatan 2',
    startTime: new Date('2018-03-02 13:00:00')
  });
  importUsers();
})();

function importUsers () {
  for (let user of dataJSON.user) {
    if (userMem[user.email]) {
      continue;
    }

    let u = new userModel({
      email: user.email,
      passwordHash: user.passwordHash
    });
    console.log(u);
    u.save();
  }
}
