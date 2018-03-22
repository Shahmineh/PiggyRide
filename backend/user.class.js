const Schema = require('mongoose').Schema;
const ModelAndRoutes = require('./model-and-routes.class');

module.exports = class User extends ModelAndRoutes {
  // constructor(app, data){
  //   super(app);
  // }


  static get schema () {
    return {
      email: { type: String, unique: true },
      passwordHash: String,
      profileDetail: Object,
      sessionID: String,
      orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
      }],
      roles: [String]
    };
  }



};
