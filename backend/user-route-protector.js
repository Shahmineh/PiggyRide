const User = require('./user.class')
const userModel = require('mongoose').model('User', User.schema);

module.exports = async function userProtector (req, res, next) {
  if (
    req.url.split('/')[1].indexOf('users') === 0 &&
    ['GET', 'PUT', 'DELETE'].includes(req.method)
  ) {
    let sessionId;
    try {
      sessionId = req.cookies.session || req.session
    } catch (error) {
    }
    let userId =
    sessionId ? await userModel.findOne({sessionID: sessionId}) : -1
    //  &&
    // req.session.data &&
    // req.session.data.user &&
    // req.session.data.user._id;
    // userId = userId || -1;
    req._params = [JSON.stringify({ _id: userId })];
    // console.log(req)
  }
  next();
};
