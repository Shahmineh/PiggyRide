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
       console.log('nameResult.error', nameResult.error)
      if (nameResult.error) {
        // console.log('Denna användare existerar redan!');
        $('err')
        $(".errormsg").html("<p class='danger'> Denna emailadress är redan registrerad! </p>");
      }
    });

    $(document).on('click', '#loginbtn', async ()=> {
      email = $('#loginUsername').val();
      password = $('#loginPassword').val();
      let nameResult = await User.find({ email: email, passwordHash: password});
      // console.log('nameResult.error', nameResult.error)
      if (nameResult.error) {
        console.log('Vänligen kontrollera att du skrivit rätt emailadress och lösenord!');
        $(".errormsg").html("<p class='danger'> Vänligen kontrollera att du skrivit rätt emailadress och lösenord! </p>");
      } 
    });
  }// end eventhandler

}// end class
