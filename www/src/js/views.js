// eslint-disable-next-line
import App from './classes/app.class';
import REST from './classes/REST.class';
import getOrders from './ui/admin-orders';
import geoEvent from './classes/geo-locate.js';

/**
 * Setup for SPA views
 *
 * @export
 * @param {App} app
 */
export default function viewsSetup (app) {
  app.bindView('our-products.html', '/info', null, async () => {});

  app.bindView('kundservice.html', '/kundservice', null, async () => {});

  app.bindView('mapview.html', '/mapview', null, async () => {
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

    window.initAdminMap = async (theTime = '2018-03-02 10:05:44.000Z') => {
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

      let response = await REST.request('waypoints', 'GET', '');
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
  });

  app.bindView('admin_orders.html', '/admin', null, () => {
    getOrders();
  });

  /*
  * views/mapview.html = /admin
  */
  app.bindView('/nav', async Renderer => {
    // let waypoints = await REST.request('waypoints', 'GET', {});

    window.initMap = () => {
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService();
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: 37.77, lng: -122.447 }
      });
      directionsDisplay.setMap(map);

      calculateAndDisplayRoute(directionsService, directionsDisplay);
      delete window.initMap;

      function calculateAndDisplayRoute (directionsService, directionsDisplay) {
        var selectedMode = 'DRIVING';
        directionsService.route(
          {
            origin: {
              lat: 55.6108096,
              lng: 12.9946562
            },
            destination: { lat: 55.565798, lng: 12.975453 },
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: google.maps.TravelMode[selectedMode]
          },
          function (response, status) {
            if (status == 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          }
        );
      }
    };
    Renderer.renderView('mapview.html', null);
  });

  /*
  * views/home.html = /
  */
  app.bindView('home.html', '/', null, () => {
    geoEvent();
    $('#departure-time').datetimepicker({
      locale: 'sv'
    });
    $('#departure-time').on('hide.datetimepicker', function () {
      $.scrollTo('#extras', 1500, 'easeInOutCubic');
    });
  });
}
