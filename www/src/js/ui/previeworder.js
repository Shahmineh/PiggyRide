export default async function previewOrder () {
  let query = {
    to: $('#autocompleteTo').val(),
    from: $('#autocompleteFrom').val(),
    time: new Date(
      $('#departure-time')
        .children()
        .first()
        .val()
        .toString()
    ),
    extras: $('input:checked')
      .map(function () {
        return $(this)
          .siblings('label')
          .text();
      })
      .toArray()
      .concat($('#selected-pack').data('piggypack'))
  };
}
