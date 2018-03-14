import REST from './REST.class';

export default async function getBestPiggy (pickupAddress, time) {
  let response = await REST.request('piggys', 'GET', {});
  let piggys = [];

  for (let piggy of response.result) {
    if (piggy.orders) {
      piggys.push(piggy);

      // let chosenOne = await REST.findOne(piggy.orders[0]);
      console.log('piggy.orders', piggy.orders);
    }
  }

  console.log(piggys);
}
