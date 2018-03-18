// @ts-ignore
require('jquery-ui/ui/effect');

/**
 * Assigns the scrollTo method to jQuery.
 *
 * @param {JQueryStatic} $
 */
function assignScrollTo ($) {
  if (!$) {
    throw new Error('$ not found.');
  }

  const abortScroll = function () {
    $('html, body').stop();
    document.removeEventListener('wheel', abortScroll);
  };

  Object.assign($, {
    scrollTo: function (
      target,
      time = 1500,
      easing = 'easeInOutCubic',
      callbackFn = undefined
    ) {
      document.addEventListener('wheel', abortScroll);
      if (typeof time === 'function') {
        callbackFn = time;
        time = 1500;
      }
      if (typeof easing === 'function') {
        callbackFn = easing;
        easing = 'easeInOutCubic';
      }
      $('html, body').animate(
        {
          scrollTop: $(target).offset().top
        },
        time,
        easing,
        callbackFn
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
