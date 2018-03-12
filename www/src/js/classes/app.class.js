import Base from './base.class';

export default class App extends Base {
  initialize () {
    const app = this;

    app.bindView('home', '/', null, () => {
      $('#departure-time').datetimepicker({
        locale: 'sv'
      });
      $('#departure-time').on('hide.datetimepicker', function () {
        $.scrollTo('#extras', 1500, 'easeInOutCubic');
      });
    });
  }
}
