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
  let order = await $.ajax({
    url: '/previeworder',
    type: 'GET',
    data: query
  });
  $('#price').text('Totalpris: ' + order.totalPrice + ' kr');
  let confirmed = false;
  $('#pay').click(async function (e) {
    // e.preventDefault()
    if (!confirmed) {
      $('#confirmation').text(
        'Tack för din beställning! En orderbekräftelse har skickats till din epost.'
      );
      await $.ajax({
        url: '/confirmorder',
        type: 'POST',
        data: order
      });
      confirmed = true;
    }
  });
}
