import UserModel from './models/user';

export async function getUser(queryString) {
  const query = {
    $or: [
      {
        username: queryString,
      }, {
        email: queryString,
      },
    ],
  };

  const projection = {
    _id: 0,
    uuid: 1,
    username: 1,
    email: 1,
    permissionLevel: 1,
    createdAt: 1,
  };

  const user = await UserModel.findOne(query, projection);
  return user;
}

export async function createUser(userData) {
  const user = new UserModel(userData);
  await user.save();
  return true;
}

export async function updateUser(userId, data) {
  await UserModel.updateOne({ uuid: userId }, data);
  return true;
}

export async function deleteUser(userId) {
  await UserModel.deleteOne({ uuid: userId });
  return true;
}
