let piggyType;

module.exports = (() => {
  $('#expresspiggy, #turbopiggy, #spiderpiggy').click(function (event) {
    // console.log($(this));
    if ($(this).prop('id') === 'spiderpiggy') {
      $('.piggy-packs').show();
    } else {
      $('.piggy-packs').hide();
    }
    $.scrollTo('#piggy-picker');
    $('.continue-btn').show();
    piggyType = $(this).text();
    findPiggy();
  });
  $('#departure-time').on('change.datetimepicker', function () {
    findPiggy();
  });
  window.findPiggy = findPiggy;
})();

async function findPiggy (type = piggyType) {
  let time = $('#departure-time')
    .children()
    .first()
    .val();
  let from = $('#autocompleteTo').val();
  if (type && time && from) {
    let req = { from: from, time: time };
    let response = await $.ajax({ url: '/bestpiggy', type: 'GET', data: req });
    // console.log(response);
    let bestPiggy = response
      .filter((wps) => wps.piggy.type === type)
      .map((wps) =>
        Object.assign(wps, {
          startTime: new Date(wps.startTime),
          endTime: new Date(wps.endTime)
        })
      )
      .sort((a, b) => a.endTime - b.endTime)[0];
    // console.log(bestPiggy)
    const dateOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Europe/Stockholm'
    };
    let bestTime =
      bestPiggy.startTime < new Date().getTime() + bestPiggy.duration * 1000
        ? bestPiggy.endTime
        : bestPiggy.startTime;
    $('#next-time')
      .text(bestTime.toLocaleDateString('sv-SE', dateOptions))
      .parent()
      .show();
    window.wps = bestPiggy;
    return bestPiggy.startTime;
  }
}

/* const dateOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'Europe/Stockholm'
};
.toLocaleDateString('sv-SE', dateOptions) */
