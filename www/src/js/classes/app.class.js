import Base from './base.class';
import REST from './REST.class';

export default class App extends Base {
  initialize () {
    const app = this;

    app.bindView('mapview.html', '/', null, async () => {
      console.log('Starting get')
      let response = await REST.request('waypoints', 'GET', {});
      console.log(response)

    });
    /*     app.bindView('home.html', '/', null, () => {
      $('#departure-time').datetimepicker({
        locale: 'sv'
      });
      $('#departure-time').on('hide.datetimepicker', function () {
        $.scrollTo('#extras', 1500, 'easeInOutCubic');
      });
    }); */
  }
}
