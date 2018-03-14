import PopStateHandler from './pop-state-handler.class';
import viewsSetup from '../views';

// classes
import REST from './REST.class';

export default class App extends PopStateHandler {
  initialize () {
    const app = this;
    viewsSetup(app);
  }
}

async function getOrders () {
  let orders = await REST.request('orders', 'GET', {});
  orders = orders.result || [orders];

  let html = $('<div class="col-10 mx-auto"></div>');
  let table = $(
    '<table id="orders" class="table" data-search="true" data-toggle="table"></table>'
  );
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

  $('#table').append(html);
}
