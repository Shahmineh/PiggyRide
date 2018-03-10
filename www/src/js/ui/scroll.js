/**
 * Assigns the scrollTo method to jQuery.
 *
 * @param {JQueryStatic} $
 */
function assignScrollTo ($) {
  if (!$) {
    throw new Error('$ not found.');
  }
  Object.assign($, {
    scrollTo: function (target, time = 2000) {
      $('html, body').animate(
        {
          scrollTop: $(target).offset().top
        },
        time
      );
      // console.log('Scrolled');
    }
  });
}

module.exports = (() => {
  if (typeof $ === 'function') {
    assignScrollTo($);
  }
  return assignScrollTo;
})();
