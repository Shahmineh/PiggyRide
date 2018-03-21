const User = require('./user.class')
const userModel = require('mongoose').model('User', User.schema);

module.exports = async function userProtector (req, res, next) {
  if (
    req.url.split('/')[1].indexOf('users') === 0 &&
    ['GET', 'PUT', 'DELETE'].includes(req.method)
  ) {
    console.log(req)
    let userId =
      req.cookies.session ? userModel.findOne({sessionID: req.cookies.session}) : -1
      //  &&
      // req.session.data &&
      // req.session.data.user &&
      // req.session.data.user._id;
    userId = userId || -1;
    req._params = [JSON.stringify({ _id: userId })];
  }
  next();
};
