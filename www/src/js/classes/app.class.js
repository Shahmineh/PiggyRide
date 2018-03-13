import PopStateHandler from './pop-state-handler.class';
import Order from './order.class';

export default class App extends PopStateHandler {
  initialize () {
    const app = this;

    app.bindView('home.html', '/', null, () => {
      $('#departure-time').datetimepicker({
        locale: 'sv'
      });
      $('#departure-time').on('hide.datetimepicker', function () {
        $.scrollTo('#extras', 1500, 'easeInOutCubic');
      });
    });

    app.bindView('admin_orders.html', '/admin', null, () => {
      getOrders();
    });
  }
}

async function getOrders () {
  let orders = await Order.find({});
  console.log(orders);

  // let ordersHead = $('#orders thead')[0];
}
