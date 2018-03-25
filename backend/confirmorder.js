module.exports = async (req, res) => {
  let incomingOrder = req.body;
  let user = await UserModel.findOne({ sessionID: req.session.id });
  sendMail(user.email, incomingOrder);
  Object.assign(incomingOrder, { user: user, orderTime: new Date() });
  order.model.create(incomingOrder).catch(async () => {
    await order.model.remove({ _id: incomingOrder._id });
    await order.model.create(incomingOrder);
  });
}

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
