export default async function previewOrder () {
  let query = {
    to: $('#autocompleteTo').val(),
    from: $('#autocompleteFrom').val(),
    time: $('#departure-time')
      .children()
      .first()
      .val()
      .toString(),
    extras: $('input:checked')
      .map(function () {
        return $(this)
          .siblings('label')
          .text();
      })
      .toArray()
      .concat($('#selected-pack').data('piggypack')),
      wps: window.wps || 0
  };
  await $.ajax({
    url: '/previeworder',
    type: 'GET',
    data: query
  });
}
