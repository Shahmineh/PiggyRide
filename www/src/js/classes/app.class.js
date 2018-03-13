import PopStateHandler from './pop-state-handler.class';

export default class App extends PopStateHandler {
  initialize () {
    const app = this;

    app.bindView('home.html', '/', null, () => {
      $('#departure-time').datetimepicker({
        locale: 'sv'
      });
      $('#departure-time').on('hide.datetimepicker', function () {
        $.scrollTo('#extras', 1500, 'easeInOutCubic');
      });
    });
  }
}
