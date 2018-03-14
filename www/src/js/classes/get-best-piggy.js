import REST from './REST.class';
import Order from './order.class';
import Waypoint from './waypoint.class';

export default async function getBestPiggy (pickupAddress, time) {
  let response = await REST.request('piggys', 'GET', '');
  let piggys = [];
  let orders = [];

  for (let piggy of response.result) {
    if (piggy.orders) {
      piggys.push(piggy);
      orders.push(await Order.findOne(`_id=${piggy.orders}`));
    }
  }

  orders = orders.filter(
    (order, index, self) =>
      index === self.findIndex(_order => _order._id === order._id)
  );

  for (let order of orders) {
    let dude = await Waypoint.findOne(`_id=${order.waypoints}`);
    console.log(dude);
  }

  console.log('orders filtered', orders);
}

function getUnique (objArr = [{}]) {
  objArr;
}
