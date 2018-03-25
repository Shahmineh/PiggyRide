import User from '../classes/user.class';

export default async function checkLogin (res, ajaxReq) {
  let user = await User.findOne('');
  console.log(user);
  if (user) {
    $('#login-form').hide();
    $('#logout-form').show();
  } else {
    $('#login-form').show();
    $('#logout-form').hide();
  }
  $('#logout-form').off('click')
  $('#logout-form').on('click', function () {
    $.ajax({
      url: '/sign-out',
      type: 'POST'
    })
      .then(res => {
        checkLogin();
      })
      .catch(err => {
        console.log('Error: ', err);
      });
  });
  if (res && res.loggedIn && !user) {
    // MongoDB did not have time to finish saving the last request so try once more
    setTimeout(async () => {
      await $.ajax(ajaxReq);
      checkLogin();
    }, 2000);
  }
}
