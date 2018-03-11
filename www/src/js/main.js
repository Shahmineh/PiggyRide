import 'babel-polyfill';
import jQuery from 'jquery';
import 'popper.js';
import 'bootstrap';
import App from './classes/app.class.js';
import moment from 'moment';
import 'moment/locale/sv';
import geoEvent from './classes/geo-locate.js';

// @ts-ignore
window.$ = window.jQuery = jQuery; // Sets $ to global
require('./ui/scroll.js'); // Assigns the scrollTo method to jQuery

const app = new App();

window.moment = moment;
geoEvent();
