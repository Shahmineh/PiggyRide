const ModelAndRoutes = require('./model-and-routes.class');

module.exports = class Extra extends ModelAndRoutes {
  static get schema () {
    return {
      name: String,
      stock: Number,
      description: String,
      price: Number
    };
  }
};
