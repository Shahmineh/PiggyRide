import 'babel-polyfill';
import jQuery from 'jquery';
import 'popper.js';
import 'bootstrap';
import App from './classes/app.class.js';
import initAutocomplete from './classes/google-auto-complete.js';



// @ts-ignore
window.$ = window.jQuery = jQuery; // Sets $ to global

const app = new App();