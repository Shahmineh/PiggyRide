import Base from './base.class';

export default class App extends Base {
  initialize () {
    const app = this;

    app.bindView('home.html', '/', null, () => {
      $('#departure-time').datetimepicker({
        locale: 'sv'
      });
    });

    /*app.bindView('our-products.html', '/piggys', null, () => {
      $('#piggys').datetimepicker({
        locale: 'sv'
      });
    });

    app.bindView('kundservice.html', '/kundservice', null, () => {
      $('#kundservice').datetimepicker({
        locale: 'sv'
      });
    });*/


  }
}
