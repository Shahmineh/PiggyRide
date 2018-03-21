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

/*
  Start a REPL if server was started with --inspect or --debug.
  Note that await in the REPL is only available in Node v10.0+.
*/
const nodeArgs = process.execArgv.join();
if (nodeArgs.includes('--inspect') || nodeArgs.includes('--debug')) {
  // Start read-eval-print loop
  const nodeRepl = require('repl');
  setTimeout(async () => {
    console.info('Starting REPL 🐍');
    const repl = nodeRepl.start({
      useColors: true,
      prompt: 'PiggyRide > ',
      input: process.stdin,
      output: process.stdout,
      useGlobal: true
    });
    let context = repl.context;
    Object.assign(context, {
      app: app,
      Waypoint: Waypoint,
      waypoint: await waypoint
    });
    // console.log(global === repl.context);
    repl.on('exit', function () {
      console.info('REPL closed');
    });
  }, 2500);
}

function sendMail (toEmail) {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'malmopiggyride@gmail.com',
      pass: 'piggyride1'
    }
  });

  const mailOptions = {
    from: 'malmopiggyride@gmail.com', // sender address
    to: toEmail, // list of receivers
    subject: 'Din bokningsbekräftelse', // Subject line
    html: '<p>Din piggy är bokad!</p>' // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}
