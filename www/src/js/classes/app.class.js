import PopStateHandler from './pop-state-handler.class';

// classes
import REST from './REST.class';

export default class App extends PopStateHandler {
  initialize () {
    const app = this;

    app.bindView('home.html', '/home', null, () => {
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
  let orders = await REST.request('orders', 'GET', {});
  orders = orders.result || [orders];

  let html = $('<div class="col-10 mx-auto"></div>');
  let table = $('<table id="orders" class="table"></table>');
  let tbody = $('<tbody></tbody>');
  let thead = $(`<thead> 
                    <tr>
                      <th scope="col" data-sortable="true" data-field="_id">ID</th>
                      <th scope="col" data-sortable="true" data-field="totalPrice">Price</th>
                      <th scope="col" data-sortable="true" data-field="orderTime">Order time</th>
                      <th scope="col" data-sortable="true" data-field="user">User</th>
                    </tr>
                  </thead>`);

  for (let order of orders) {
    let tr = $(`<tr> 
                <td>${order._id}</td>
                <td>${order.totalPrice}</td>
                <td>${order.orderTime}</td>
                <td>${order.user}</td>
              </tr>`);

    tr.appendTo(tbody);
  }
  thead.appendTo(table);
  tbody.appendTo(table);
  table.appendTo(html);

  table.attr('data-toggle', 'table');

  $('#table').append(html);
}
