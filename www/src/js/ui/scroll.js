/**
 * Assigns the scrollTo method to jQuery.
 *
 * @param {JQueryStatic} $
 */
function assignScrollTo ($) {
  if (!$) {
    throw new Error('$ not found.');
  }

  let defaultEffect;

  try {
    // @ts-ignore
    require('jquery-ui/ui/effect');
    defaultEffect = 'easeInOutCubic';
  } catch (e) {
    defaultEffect = 'swing';
  }

  const abortScroll = function () {
    $('html, body').stop();
    document.removeEventListener('wheel', abortScroll);
  };

  Object.assign($, {
  /**
   * Scroll to the target selector.
   *
   * @param {string} target
   * @param {number | Function} [time=1500]
   * @param {string | Function} [easing='easeInOutCubic']
   * @param {Function} [callbackFn]
   */
    scrollTo: function (
      target,
      time = 1500,
      easing = defaultEffect,
      callbackFn = undefined
    ) {
      let triggered = 0;
      document.addEventListener('wheel', function () {
        abortScroll();
        if (typeof callbackFn === 'function' && triggered === 0) {
          callbackFn();
          triggered++;
        }
      });
      if (typeof time === 'function') {
        callbackFn = time;
        time = 1500;
      }
      if (typeof easing === 'function') {
        callbackFn = easing;
        easing = defaultEffect;
      }
      $('html, body').animate(
        {
          scrollTop: $(target).offset().top
        },
        time,
        // @ts-ignore
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
  } else if (typeof jQuery === 'function') {
    assignScrollTo(jQuery);
  }
  return assignScrollTo;
})();
