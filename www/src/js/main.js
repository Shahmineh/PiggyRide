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
// @ts-ignore
window.moment = moment;
require('./ui/scroll.js'); // Assigns the scrollTo method to jQuery
// @ts-ignore
require('tempusdominus-bootstrap-4');

const app = new App();

window.initMap = () => {
  let hq = {
    lat: 55.6108096,
    lng: 12.9946562
  };
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: hq
  });

  // get all the cars with position(time) and get the lang/lat and save to array
  let myLatLng = {
    lat: 55.6108096,
    lng: 12.9946562
  };

  // for each marker we need to
  let marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'PIGGY GONE WILD'
  });
};

app.initialize(); // Set up the SPA and pop-states
// @ts-ignore
require('startbootstrap-agency/js/agency');

geoEvent();
