const ModelAndRoutes = require('./model-and-routes.class');

module.exports = class Piggy extends ModelAndRoutes {
  static get schema () {
    return {
      type: String,
      number: Number,
      description: String,
      price: Number
    };
  }
};
