import REST from './REST.class.js';

export default class User extends REST {

  constructor(user){
    super(user);
    this.eventHandlers();
  }

  eventHandlers(){
    let email, password;
    
    $(document).on('click', '#signupbtn', async ()=> {
      email = $('#loginUsername').val();
      password = $('#loginPassword').val();
      let nameResult = await User.create({ email: email, passwordHash: password});
      // console.log('nameResult.error', nameResult.error)
      if (nameResult.error) {
        // console.log('Denna användare existerar redan!');
        $(".errormsg").append("<p class='warning'> Username allready exists! </p>");
      }
    });
  }// end eventhandler

}// end class
