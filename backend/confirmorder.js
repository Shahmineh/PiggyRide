module.exports = function (app, Waypoint, Extra, Piggy, Order, User) {
  return async (req, res) => {
    let incomingOrder = req.body;
    // console.log(req.body);
    let user = await User.findOne({ sessionID: req.session.id });
    sendMail(user.email, incomingOrder);
    Object.assign(incomingOrder, { user: user, orderTime: new Date() });
    let waypoint = await Waypoint.create(app, {
      from: incomingOrder['waypoints[0][from]'],
      to: incomingOrder['waypoints[0][to]'],
      startTime: new Date(incomingOrder['waypoints[0][endTime]'])
    });
    let w = new waypoint.myModel({
      from: waypoint.from,
      to: waypoint.to,
      startTime: waypoint.startTime,
      startAddress: waypoint.startAddress,
      endAddress: waypoint.endAddress,
      duration: waypoint.duration,
      durationMinutes: waypoint.durationMinutes,
      endTime: waypoint.endTime,
      distance: waypoint.distance,
      speed: waypoint.speed,
      positions: waypoint.positions,
      piggy: await Piggy.findOne({_id: incomingOrder['piggies[0][_id]']})
    });
    w.save();
    Order.create(incomingOrder).catch(async () => {
      await Order.remove({ _id: incomingOrder._id });
      await Order.create(incomingOrder);
    });
  };
};

function sendMail (toEmail, order) {
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
    html: `<p>Din piggy är bokad!</p> <p>Ditt bokningsnummer är ${
      order._id
    }</p>` // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}
