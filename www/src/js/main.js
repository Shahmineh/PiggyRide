import 'babel-polyfill';
import jQuery from 'jquery';
import 'popper.js';
import 'bootstrap';
import App from './classes/app.class.js';
import moment from 'moment';
import 'moment/locale/sv';
import geoEvent from './classes/geo-locate.js';
import User from './classes/user.class.js';
import REST from './classes/REST.class.js';
import getBestPiggie from './classes/get-best-piggy.js';

// @ts-ignore
window.$ = window.jQuery = jQuery; // Sets $ to global
// @ts-ignore
window.moment = moment;
require('./ui/scroll.js'); // Assigns the scrollTo method to jQuery
// @ts-ignore
require('tempusdominus-bootstrap-4');

const app = new App();

window.position = async (timeString, positions) => {
  let time = new Date(timeString);
  let timeDiff = Infinity; // Math.abs(time - this.positions[0].time);
  let currPos = {};

  for (let position of positions) {
    let positionTime = new Date(position.time);
    let currDiff = Math.abs(time - positionTime);
    if (currDiff <= timeDiff) {
      timeDiff = currDiff;
      currPos = position;
    }
  }
  return currPos;
};

window.initMap = async (theTime = '2018-03-13:05:44.000Z') => {
  let hq = {
    lat: 55.6108096,
    lng: 12.9946562
  };

  // get all the cars with position(time) and get the lang/lat and save to array
  let center = {
    lat: 55.589423,
    lng: 13.021704
  };

  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: center
  });

  let response = await REST.request('waypoints', 'GET', {});
  let waypoints = response.result;

  for (let waypoint of waypoints) {
    let poss = await position(theTime, waypoint.positions);
    let marker = new google.maps.Marker({
      position: {
        lat: poss.lat,
        lng: poss.lng
      },
      map: map,
      title: 'PIGGY GONE WILD'
    });
  }

  // let marker = new google.maps.Marker({
  //   position: hq,
  //   map: map,
  //   title: 'HQ'
  // });
};

app.initialize(); // Set up the SPA and pop-states
// @ts-ignore
require('startbootstrap-agency/js/agency');

geoEvent();

getBestPiggie();
const user = new User();
