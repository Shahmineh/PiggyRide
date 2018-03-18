const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const validRoutes = [];
Object.assign(app, { validRoutes: validRoutes });

const Session = require('./backend/session.class');
function session (req, res, next) {
  if (!req.session) {
    // set a cookie for a session if it doesn't exist
    let MySessionModel = new Session(app).myModel;
    // see https://expressjs.com/en/4x/api.html#res.cookie
    let mySession = new MySessionModel({
      loggedIn: true
    });
    res.cookie('session', mySession._id, {
      path: '/',
      httpOnly: true
    });
    // save our new cookie to our new session
    mySession.save(e => {});
    req.session = mySession;
    console.log(req.session);
  } else {




  }
  next();
}

app.use(bodyParser.json());
app.use(express.static('www'));
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
