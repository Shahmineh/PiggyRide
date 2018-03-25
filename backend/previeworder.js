module.exports = function (app, Waypoint, Extra, Piggy, Order, User) {
  return async function (req, res, next) {
    let result = 0;
    let query = req.query;
    let extras = query.extras;
    let possibleExtras = await Extra.find();
    if (Array.isArray(extras)) {
      let extrasPrice = extras.reduce((acc, extra) => {
        let pack = possibleExtras.find(
          extraPack => extraPack.name === extra
        );
        acc = acc + (pack ? pack.price : 15);
        return acc;
      }, 0);
      result = result + extrasPrice;
    }
    let waypoint = await Waypoint.create(app, {from: query.from, to: query.to, startTime: new Date(query.time)});
    result = result + (waypoint.durationMinutes * 5);

    let newOrder = await Order.create({
      totalPrice: result,
      user: req.session._id ? await User.findOne({session: req.session._id}) : 0,
      extras: extras && extras.length > 0 ? await Promise.all(extras.map(extra => Extra.findOne({name: extra}))).catch() : [],
      piggies: await Piggy.find({_id: query.wps.piggy._id}),
      waypoints: [new waypoint.myModel({
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
        positions: waypoint.positions
      })]
    });
    // console.log(query);
    // console.log(result);
    // console.log(newOrder);

    res.json(newOrder);
  };
};
