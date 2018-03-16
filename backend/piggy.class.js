const ModelAndRoutes = require('./model-and-routes.class');
const Schema = require('mongoose').Schema;

module.exports = class Piggy extends ModelAndRoutes {
  static get schema () {
    return {
      type: String,
      number: Number,
      description: String,
      price: Number,
      orders: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
      }
    };
  }
};
