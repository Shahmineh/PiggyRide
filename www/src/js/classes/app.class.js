import PopStateHandler from './pop-state-handler.class';
import viewsSetup from '../views';

export default class App extends PopStateHandler {
  initialize () {
    const app = this;

    viewsSetup(app);
  }
}
