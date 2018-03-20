import REST from './REST.class.js';

export default class User extends REST {
  constructor (user) {
    super(user);
    User.eventsInitialized = User.eventsInitialized || this.setupEventHandlers();
  }

  setupEventHandlers () {
    let email, password;

    $(document).on('click', '#signupbtn', async () => {
      email = $('#loginUsername').val();
      password = $('#loginPassword').val();
      let nameResult = await User.create({
        email: email,
        passwordHash: password
      });
      // console.log('nameResult.error', nameResult.error)
      if (nameResult.error) {
        // console.log('Denna användare existerar redan!');
        $('.errormsg').append(
          "<p class='warning'> Username already exists! </p>"
        );
      }
    });
    return true;
  } // end eventhandler
} // end class
