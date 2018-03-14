import 'babel-polyfill';
import jQuery from 'jquery';
import 'popper.js';
import 'bootstrap';
import App from './classes/app.class.js';
import moment from 'moment';
import 'moment/locale/sv';
import geoEvent from './classes/geo-locate.js';
import User from './classes/user.class.js';

// @ts-ignore
window.$ = window.jQuery = jQuery; // Sets $ to global
// @ts-ignore
window.moment = moment;
require('./ui/scroll.js'); // Assigns the scrollTo method to jQuery
// @ts-ignore
require('tempusdominus-bootstrap-4');

const app = new App();
app.initialize(); // Set up the SPA and pop-states
// @ts-ignore
require('startbootstrap-agency/js/agency');

geoEvent();

const user = new User();



