const request = require('request-promise-native');

export default function geoEvent () {
  $(document).on('click', '#getLocation', function () {
    if (navigator.geolocation) {
      $('#autocompleteFrom')[0].placeholder = 'hittar närmaste adress..';
      navigator.geolocation.getCurrentPosition(position => {
        getClosestAddress(position);
      });
    } else {
      this.innerHTML = 'Geolocation is not supported by this browser.';
    }
  });
}

async function getClosestAddress (position) {
  let url = 'https://maps.googleapis.com/maps/api/geocode/json';

  let params = {
    latlng: `${position.coords.latitude},${position.coords.longitude}`,
    key: 'AIzaSyBrE71qz1iEQgNnM3fbzIXB5pmRoB9rWiQ'
  };

  for (let param in params) {
    url += url.includes('?') ? '&' : '?';
    url += param + '=' + encodeURIComponent(params[param]);
  }

  let data = JSON.parse(await request(url));

  $('#autocompleteFrom')[0].value = data.results[0].formatted_address.split(
    ','
  )[0];
}