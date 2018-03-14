// eslint-disable-next-line
import App from './classes/app.class';
import REST from './classes/REST.class';
import getOrders from './ui/admin-orders';

/**
 * Setup for SPA views
 *
 * @export
 * @param {App} app
 */
export default function viewsSetup (app) {
  app.bindView('mapview.html', '/mapview', null, async () => {});

  app.bindView('admin_orders.html', '/admin', null, () => {
    getOrders();
  });

  /*
  * views/mapview.html = /admin
  */
  app.bindView('/nav', async (Renderer) => {
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
    $('#departure-time').datetimepicker({
      locale: 'sv'
    });
    $('#departure-time').on('hide.datetimepicker', function () {
      $.scrollTo('#extras', 1500, 'easeInOutCubic');
    });
  });
}
