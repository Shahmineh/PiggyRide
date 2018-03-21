import User from '../classes/user.class'

export default async function checkLogin () {
  let user = await User.findOne('');
  console.log(user);
}

