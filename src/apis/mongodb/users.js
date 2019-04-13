import UserModel from './models/user';


export async function getUser(username) {
  const projection = {
    uuid: 1,
    username: 1,
    email: 1,
    permissionLevel: 1,
    createdAt: 1,
    playlists: 1,
    _id: 0,
  };

  try {
    return await UserModel.findOne({ username }, projection);
  } catch (error) {
    throw new Error(error);
  }
}

export async function createUser(userData) {
  try {
    const user = new UserModel(userData);
    return user.save();
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateUser(userId, data) {
  try {
    return await UserModel.updateOne({ uuid: userId }, data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteUser(userId) {
  try {
    return await UserModel.deleteOne({ uuid: userId });
  } catch (error) {
    throw new Error(error);
  }
}
