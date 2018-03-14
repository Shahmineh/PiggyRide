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
      console.log('nameResult', nameResult);

    });
  }// end eventhandler

}// end class
