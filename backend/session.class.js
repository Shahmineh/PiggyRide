const Schema = require('mongoose').Schema;
const ModelAndRoutes = require('./model-and-routes.class');

module.exports = class Session extends ModelAndRoutes {
  static get schema () {
    return {
      data: Schema.Types.Mixed
    };
  }
};
