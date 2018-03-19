import REST from './REST.class.js';

export default class Admin extends REST {
  constructor (user) {
    super(user);
    User.eventsInitialized = User.eventsInitialized || this.setupEventHandlers();
  }

  setupEventHandlers () {
    $(document).on('click', '#listallusers', async () => {
      console.log('CLICK');
      let email;

      let allUsers = await Admin.find({ email: email });
      console.log('allUsers', allUsers);
     
     
     
    });
    return true;
  } // end eventhandler

} // end class