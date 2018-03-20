const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const express = require('express');
const app = express();
const moment = require('moment');

const Piggy = require('./piggy.class');
const Waypoint = require('./waypoint.class');

const PiggyModel = mongoose.model('Piggy');

const WaypointModel = mongoose.model(
  'Waypoint',
  new mongoose.Schema(Waypoint.schema)
);

module.exports = async function (req, res, next) {
  let allWps = await WaypointModel.find({}).populate('piggy');
  let allPiggies = await PiggyModel.find({});
  let wpsByPiggy = allWps.reduce((acc, wp) => {
    acc[wp.piggy.number].push(wp);
    console.log(acc);
    return acc;
  }, new Array(allPiggies.length).fill(null).map(arr => []));
  let destination = req.body.to || 'Sallerupsvägen 5';
  let hqWaypoint = await Waypoint.create(app, {
    from: Waypoint.hqPos.endAddress,
    to: destination,
    startTime: new Date()
  });
  // console.log(hqWaypoint);
  let testDate = new Date('March 22, 2018 12:24:00');
  let activePiggyWps = wpsByPiggy.map(wps => {
    return wps
      .map(wp => {
        let time = moment(wp.endTime); // .add(wp.duration, 's')
        // @ts-ignore
        return time.toDate() - new Date();
      })
      .filter(time => time > 0);
  });
  console.log(activePiggyWps);

  next();
};
