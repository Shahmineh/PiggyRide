import 'babel-polyfill';
import jQuery from 'jquery';
import App from './classes/app.class.js';
import moment from 'moment';
import 'moment/locale/sv';
import User from './classes/user.class.js';
import REST from './classes/REST.class.js';
import checkLogin from './ui/check-login';
import Order from './classes/order.class';
import Waypoint from './classes/waypoint.class';
import Piggy from './classes/piggy.class';
import Extra from './classes/extra.class';

// @ts-ignore
window.$ = window.jQuery = jQuery; // Sets $ to global
// @ts-ignore
window.moment = moment;
require('bootstrap');
require('popper.js');
// @ts-ignore
require('bootstrap-table');
// @ts-ignore
require('bootstrap-table/dist/locale/bootstrap-table-sv-SE');

require('./ui/scroll.js'); // Assigns the scrollTo method to jQuery
// @ts-ignore
require('tempusdominus-bootstrap-4');

const app = new App();

app.initialize(); // Set up the SPA and pop-states
// @ts-ignore
require('startbootstrap-agency/js/agency');

const user = new User();

$(document).on('click', '.portfolio-hover', function () {
  if (
    $(this)
      .parent()
      .parent()
      .attr('id') === 'selected-pack'
  ) {
    console.log('!');
    $(this)
      .parent()
      .parent()
      .removeAttr('id');
  } else {
    $('.portfolio-hover')
      .parent()
      .parent()
      .removeAttr('id');
    $(this)
      .parent()
      .parent()
      .attr('id', 'selected-pack');
  }
});

checkLogin()

window.checkLogin = checkLogin;
window.User = User;
window.Order = Order;
window.Extra = Extra;
window.Waypoint = Waypoint;
window.Piggy = Piggy;
