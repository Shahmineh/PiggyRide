const Schema = require('mongoose').Schema;
const ModelAndRoutes = require('./model-and-routes.class');

module.exports = class User extends ModelAndRoutes {
  static get schema () {
    return {
      email: String,
      passwordHash: String,
      session: {
        type: Schema.Types.ObjectId,
        ref: 'Session'
      },
      orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
      }]
    };
  }
};
