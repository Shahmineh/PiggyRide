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
    // console.log(acc);
    return acc;
  }, new Array(allPiggies.length).fill(null).map((arr) => []));
  let destination = req.body.to || 'Sallerupsvägen 5';
  let from = req.body.from || 'Nordenskiöldsgatan 13';
  let hqWaypoint = await Waypoint.create(app, {
    from: Waypoint.hqPos.endAddress,
    to: destination,
    startTime: new Date()
  });
  // console.log(hqWaypoint);
  let time = req.body.time || new Date('March 22, 2018 12:24:00');
  let futureTimes = wpsByPiggy
    .map((wps) => {
      return wps.filter((wp) => {
        // @ts-ignore
        let possibleTime = moment(wp.endTime).toDate() - time; // .add(wp.duration, 's')
        return possibleTime > 0;
      });
    })
    .map((wps) => (wps.length === 0 ? [hqWaypoint] : wps));

  // console.log(futureTimes);
  let possibilities = await Promise.all(
    futureTimes.map(async (wps) => {
      let endPoint = wps.slice(-1)[0];
      return Waypoint.create(app, {
        from: endPoint.endAddress,
        to: from,
        startTime: time
      });
    })
  );
  allPiggies.forEach((piggy, index) => {
    Object.assign(possibilities[index], { piggy: piggy });
  });
  possibilities.sort((a, b) => {
    // @ts-ignore
    return new Date(a.endTime) - new Date(b.endTime);
  });

  // console.log(possibilities);
  req.possibilities = possibilities;
  console.log(req.possibilities);

  next();
};
