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
      
      let nameResult = await User.create({ email: email, passwordHash: password });
       console.log('nameResult.error', nameResult.error)
      if (nameResult.error) {
        // console.log('Denna användare existerar redan!');
        //$('err')
        $(".errormsg").html("<p class='danger'> Denna emailadress är redan registrerad! </p>");
        }
        else {
          $(".errormsg").html("<p class='success'> Tack för att du registrerat dig hos oss! </p>");
        }
    });

    $(document).on('click', '#loginbtn', async ()=> {
      email = $('#loginUsername').val();
      password = $('#loginPassword').val();
      let nameResult = await User.find({ email: email, passwordHash: password });
      if (nameResult === undefined || nameResult.length == 0) {
        $(".errormsg").html("<p class='danger'> Vänligen kontrollera att du skrivit rätt emailadress och lösenord! </p>");
      } 
    });


  }// end eventhandler



}// end class
