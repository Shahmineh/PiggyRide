import 'babel-polyfill';
import jQuery from 'jquery';
import 'popper.js';
import 'bootstrap';
import App from './classes/app.class.js';
import moment from 'moment';
import geoEvent from './classes/geo-locate.js';

// @ts-ignore
window.$ = window.jQuery = jQuery; // Sets $ to global

const app = new App();

window.moment = moment;
geoEvent();
