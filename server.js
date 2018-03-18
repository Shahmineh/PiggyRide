const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const validRoutes = [];
Object.assign(app, { validRoutes: validRoutes });

app.use(bodyParser.json());
app.use(express.static('www'));

const Order = require('./backend/order.class');
let order = new Order(app);

const Piggy = require('./backend/piggy.class');
let piggy = new Piggy(app);

const Session = require('./backend/session.class');
let session = new Session(app);

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
    !validRoutes.some((route) => {
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
