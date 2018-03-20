const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Piggy = require('./piggy.class');
const Waypoint = require('./waypoint.class');

const PiggyModel = mongoose.model('Piggy');

const WaypointModel = mongoose.model(
  'Waypoint',
  new mongoose.Schema(Waypoint.schema)
);

module.exports = function (req, res, next) {
  next();
};
