const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

const validRoutes = [];
Object.assign(app, { validRoutes: validRoutes });

const Session = require('./backend/session.class');
const MySessionModel = new Session(app).myModel;
async function session (req, res, next) {
  // console.log(res);
  if (!req.cookies.session) {
    // set a cookie for a session if it doesn't exist

    // see https://expressjs.com/en/4x/api.html#res.cookie
    let mySession = new MySessionModel();
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
    let sessions = await MySessionModel.find({ _id: req.cookies.session });
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

app.use(bodyParser.json());
app.use(express.static('www'));
app.use(cookieParser());
app.use(session);

const Order = require('./backend/order.class');
let order = new Order(app);

const Piggy = require('./backend/piggy.class');
let piggy = new Piggy(app);

// let session = new Session(app);

const User = require('./backend/user.class');
let user = new User(app);

const Extra = require('./backend/extra.class');
let extra = new Extra(app);

const Waypoint = require('./backend/waypoint.class');
let waypoint = Waypoint.create(app, {
  from: 'Sallerupsvägen 26B',
  to: 'Björkholmsgatan 2',
  startTime: new Date('2018-03-02 13:00:00')
});

app.get(/^[^.]*$/, (req, res, next) => {
  let reqPath = req.path.split('/').slice(1);
  if (
    reqPath[0] &&
    !validRoutes.some(route => {
      return reqPath[0] === route || reqPath[0].startsWith(route + '/'); // route.slice(0, -1) to match singulars
    })
  ) {
    res.sendFile(path.join(__dirname, '/www/index.html'));
  } else {
    next();
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
