const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const MyHandler = require('./backend/helper.class');
const validRoutes = [];
Object.assign(app, { validRoutes: validRoutes });

app.use(bodyParser.json());
app.use(express.static('www'));
app.use(cookieParser());

const User = require('./backend/user.class');
let UserModel = new User(app).myModel;

const mySession = new MyHandler(app, UserModel);
console.log('sessionMiddleware', mySession);

app.use(mySession);

const Order = require('./backend/order.class');
let order = new Order(app);

const Piggy = require('./backend/piggy.class');
let piggy = new Piggy(app);

// let session = new Session(app);



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

app.post('/login', async (req, res) => {
  let currentUser = await UserModel.findOne({
    email: req.body.email,
    passwordHash: req.body.passwordHash
  });

  if (currentUser) {
    currentUser.sessionID = req.cookies.session;
    req.session.data.userId = currentUser._id;
    req.session.loggedIn = true;
    currentUser.save();
    console.log(req.session);
    res.json(currentUser);
  } else {
    res.json('You need to create an account');
  }
  // let User = await UserModel.find({_id : req.cookies.session});
});

app.post('/register', async (req, res) => {
  // first check if so current user doesnt exist
  let currentUser = await UserModel.findOne({
    email: req.body.email,
    passwordHash: req.body.passwordHash
  });
  if (!currentUser) {
    if (req.body.email && req.body.passwordHash) {
      UserModel.create(req.body)
        .then(result => {
          result.sessionID = req.cookies.session;
          req.session.data.userId = result._id;
          req.session.loggedIn = true;
          result.save();
          res.json(req.body);
          console.log(req.session);
        })
        .catch(error => {
          if (error.errmsg.includes('duplicate')) {
            res.json('Needs to be a unique email!');
          } else {
            res.json(error.errmsg);
          }
        });
    } else {
      res.json('Missing field');
    }
  } else {
    res.json('User aldready exist. Please sign in');
  }
});

app.all('/sign-out', async (req, res) => {
  req.user = {};
  req.session.loggedIn = false;
  let result = await req.session.save();
  res.json({message: 'Logged out', session: req.session, user: req.user});
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
