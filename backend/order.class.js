const Schema = require('mongoose').Schema;
const ModelAndRoutes = require('./model-and-routes.class');

module.exports = class Order extends ModelAndRoutes {
  static get schema () {
    return {
      refNr: Number,
      orderTime: Date,
      totalPrice: Number,
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      extras: [{
        type: Schema.Types.ObjectId,
        ref: "Extra"
      }],
      piggys: [{
        type: Schema.Types.ObjectId,
        ref: "Piggy"
      }],
      waypoints: [{
        type: Schema.Types.ObjectId,
        ref: "Waypoint"
      }]
    };
  }
};