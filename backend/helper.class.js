const Session = require('./session.class');
const User = require('./user.class');

module.exports = class myHandler {
  constructor (app, userModel) {
    this.expressApp = app;
    this.UserModel = userModel;
    this.MySessionModel = new Session(this.expressApp).myModel;
    return this.session.bind(this);
  }

  async session (req, res, next) {
    // console.log(res);
    if (!req.cookies.session) {
      // set a cookie for a session if it doesn't exist
      // här vill jag skapa en användare
      // see https://expressjs.com/en/4x/api.html#res.cookie
      // console.log(this)
      let mySession = new this.MySessionModel();
      let cookie = res.cookie('session', mySession._id, {
        path: '/',
        httpOnly: true
      });
      // mySession.set({
      //   loggedIn: true,
      //   data: {
      //     user: 'test'
      //   }
      // });

      // save our new cookie to our new session
      mySession.save();
      req.session = mySession;

    } else {

      let session = await this.MySessionModel.findOne({ _id: req.cookies.session });

      if (session) {
        req.session = session;
        req.session.data = req.session.data || {};

        // is there a userId saved on the session and are they logged in?
        if (req.session ) {
          let user = await this.UserModel.findOne({ sessionID: req.session._id});
          // console.log(user)
          if (user) {
            req.user = user; // apply the user object
          }
        }
      } else {
        delete req.cookies.session;
        // return session(req, res, next);
      }
    }
    next();
  }
};
