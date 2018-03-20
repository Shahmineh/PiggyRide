const Session = require('./session.class');

module.exports = class myHandler {
  constructor (app) {
    this.expressApp = app;
    this.MySessionModel = new Session(this.expressApp).myModel;
    console.log(this.MySessionModel)
    return this.session.bind(this);
  }

  async session (req, res, next) {
    // console.log(res);
    if (!req.cookies.session) {
      // set a cookie for a session if it doesn't exist
      //här vill jag skapa en användare
      // see https://expressjs.com/en/4x/api.html#res.cookie
      console.log(this)
      let mySession = new this.MySessionModel();
      let cookie = res.cookie('session', mySession._id, {
        path: '/',
        httpOnly: true
      });
      mySession.set({
        loggedIn: true,
        data: {
          user: 'test'
        }
      });

      // save our new cookie to our new session
      mySession.save();
      req.session = mySession;
    } else {
      //här hämtar vi en användare
      let sessions = await this.MySessionModel.find({ _id: req.cookies.session });
      if (sessions[0]) {
        req.session = sessions[0];
        console.log(req.session);
        // req.session.data = req.session.data || {};
        //  // is there a userId saved on the session and are they logged in?
        // if(req.session.data.userId && req.session.loggedIn){
        //   let users = await User.find({_id: req.session.data.userId});
        //   if(users[0]){
        //     req.user = users[0]; // apply the user object
        //   }
        // }
      }
      // else{
      //   delete(req.cookies.session);
      //   return session(req, res, next);
      // }
    }
    next();
  }
};
