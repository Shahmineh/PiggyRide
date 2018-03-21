let piggyType;

module.exports = (() => {
  $('#expresspiggy, #turbopiggy, #spiderpiggy').click(function () {
    piggyType = $(this).text();
    findPiggy();
  });
  $('#departure-time').on('change.datetimepicker', function () {
    findPiggy();
  });
})();

async function findPiggy (type = piggyType) {
  let time = $('#departure-time')
    .children()
    .first()
    .val();
  let from = $('#autocompleteTo').val()
  if (type && time && from) {
    let req = {from: from, time: time}
    let response = await $.ajax({url: '/bestpiggy', type: 'GET', data: req})
    console.log(response);
    let bestPiggy = response.filter((wps) => wps.piggy.type === type).map(wps => Object.assign(wps, {startTime: new Date(wps.startTime), endTime: new Date(wps.endTime)})).sort((a, b) => a.endTime - b.endTime);
    // console.log(bestPiggy)
    return bestPiggy[0].endTime;
  }
}

/* const dateOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'Sweden/Stockholm'
};
.toLocaleDateString('sv-SE', dateOptions) */
