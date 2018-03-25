import REST from './REST.class.js';
import checkLogin from '../ui/check-login';

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

      if (!email || !password) {
        $('.errormsg').html(
          "<p class='success'> Vänligen fyll i email adress och lösenord! </p>"
        );
      } else {
        let nameResult = await User.create({
          email: email,
          passwordHash: password
        });
        console.log('nameResult.error', nameResult.error);
        if (nameResult.error) {
          // console.log('Denna användare existerar redan!');
          $('err');
          $('.errormsg').html(
            "<p class='danger'> Denna emailadress är redan registrerad! </p>"
          );
        } else {
          $('.errormsg').html(
            "<p class='success'> Tack för att du registrerat dig hos oss! </p>"
          );
        }
      }
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
          // console.log(res);
        })
        .catch(err => {
          // console.log('fewfewfw', err);
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
    });

    $(document).on('click', '#loginbtn', async () => {
      email = $('#loginUsername').val();
      password = $('#loginPassword').val();

      // if (!email || !password) {
      //   $('.errormsg').html(
      //     "<p class='success'> Vänligen fyll i email adress och lösenord! </p>"
      //   );
      // } else {
      //   let nameResult = await User.findOne();
      //   console.log('nameResult1', nameResult);

      //   if (nameResult === undefined || nameResult.length == 0) {
      //     console.log('nameResult2', nameResult);
      //     $('.errormsg').html(
      //       "<p class='danger'> Vänligen kontrollera att du skrivit rätt emailadress och lösenord! </p>"
      //     );
      //   }
      // }

      let data = {
        email: email,
        passwordHash: password
      };
      // console.log('data', data);

      let newData = JSON.stringify(data);
      // console.log('newData', newData);

      $.ajax({
        url: '/login',
        type: 'POST',
        data: newData
      })
        .then(async res => {
          // console.log(res);
          if (!(res instanceof Object)) {
            $('.errormsg').html(
              "<p class='success'> Inkorrekta inloggningsuppgifter. </p>"
            );
          } else {
            await checkLogin(res, {
              url: '/login',
              type: 'POST',
              data: newData
            });
          }
        })
        .catch(err => {
          // console.log('err', err);
          $('.errormsg').html(
            "<p class='success'> Inkorrekta inloggningsuppgifter. </p>"
          );
        });
    });

    $(document).on('click', '#test', async () => {
      // let nameResult = await User.find({
      //   email: email,
      //   passwordHash: password
      // });
      // if (data === undefined || data.length == 0) {
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
          // console.log(res);
        })
        .catch(err => {
          // console.log('fewfewfw', err);
        });
    });
    return true;
  } // end eventhandler
} // end class
