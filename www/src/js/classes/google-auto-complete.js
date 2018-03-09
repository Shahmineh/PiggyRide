// function initGoogleAutocomplete() {
//   var defaultBounds = new google.maps.LatLngBounds(
//     new google.maps.LatLng(55.541985, 12.902565),
//     new google.maps.LatLng(55.646026, 13.099391));

//   let options = {
//     bounds: defaultBounds,
//     types: ['geocode'],
//     strictbounds: true
//   };
//   // Create the autocomplete object, restricting the search to geographical
//   // location types.
//   let autocomplete = new google.maps.places.Autocomplete(
//     /** @type {!HTMLInputElement} */
//     (document.getElementById('autocomplete')),
//     options);

//   console.log(autocomplete)

//   // When the user selects an address from the dropdown, populate the address
//   // fields in the form.
//   autocomplete.addListener('place_changed', fillInAddress);
// }

// function fillInAddress() {
//   // Get the place details from the autocomplete object.
//   var place = autocomplete.getPlace();
// }
