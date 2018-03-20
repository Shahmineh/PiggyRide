import REST from './REST.class.js';

export default class User extends REST {
  constructor (user) {
    super(user);
    User.eventsInitialized =
      User.eventsInitialized || this.setupEventHandlers();
  }

  setupEventHandlers () {
    let email, password;

    $(document).on('click', '#signupbtn', async () => {
      email = $('#loginUsername').val();
      password = $('#loginPassword').val();

      let data = {
        email: email,
        passwordHash: password
      };
      let newData = JSON.stringify(data);


      $.ajax({
        url: '/register',
        type: 'POST',
        data: newData
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log('fewfewfw', err);
        });
      // fetch('http://localhost:3000/login', {
      //   method: 'POST', // or 'PUT'
      //   body: JSON.stringify({
      //     email: email,
      //     passwordHash: password
      //   }),
      //   headers: new Headers({
      //     'Content-Type': 'application/json'
      //   })
      // })
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(error => console.error('Error:', error))
      //   .then(response => console.log('Success:', response));

      // let nameResult = await User.create({ email: email, passwordHash: password});
      //  console.log('nameResult.error', nameResult.error)
      // if (nameResult.error) {
      //   // console.log('Denna användare existerar redan!');
      //   $('err')
      //   $(".errormsg").html("<p class='danger'> Denna emailadress är redan registrerad! </p>");
      //   }
      //   else {
      //     $(".errormsg").html("<p class='success'> Tack för att du registrerat dig hos oss! </p>");
      //   }
    });

    $(document).on('click', '#loginbtn', async () => {
      email = $('#loginUsername').val();
      password = $('#loginPassword').val();
      // let nameResult = await User.find({
      //   email: email,
      //   passwordHash: password
      // });
      // if (nameResult === undefined || nameResult.length == 0) {
      //   $('.errormsg').html(
      //     "<p class='danger'> Vänligen kontrollera att du skrivit rätt emailadress och lösenord! </p>"
      //   );
      // }
      let data = {
        email: email,
        passwordHash: password
      };
      let newData = JSON.stringify(data);


      $.ajax({
        url: '/login',
        type: 'POST',
        data: newData
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log('fewfewfw', err);
        });
    });

    $(document).on('click', '#test', async () => {

      // let nameResult = await User.find({
      //   email: email,
      //   passwordHash: password
      // });
      // if (nameResult === undefined || nameResult.length == 0) {
      //   $('.errormsg').html(
      //     "<p class='danger'> Vänligen kontrollera att du skrivit rätt emailadress och lösenord! </p>"
      //   );
      // }
      let data = {
        email: email,
        passwordHash: password
      };
      let newData = JSON.stringify(data);


      $.ajax({
        url: '/user',
        type: 'GET',
        data: newData
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log('fewfewfw', err);
        });
    });
  } // end eventhandler
} // end class
