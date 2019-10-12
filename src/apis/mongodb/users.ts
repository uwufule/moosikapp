import UserModel from './models/user';
import { User } from '../../../typings';

export async function getUser(username: string): Promise<User | null> {
  const projection = {
    _id: 0,
    uuid: 1,
    username: 1,
    email: 1,
    role: 1,
    createdAt: 1,
  };

  const user = await UserModel.findOne({ username }, projection);
  return user;
}

export async function getUserByUuid(uuid: string): Promise<User | null> {
  const projection = {
    _id: 0,
  };

  const user = await UserModel.findOne({ uuid }, projection);
  return user;
}

export async function findUser(query: string): Promise<User | null> {
  const q = {
    $or: [
      {
        username: query,
      }, {
        email: query,
      },
    ],
  };

  const projection = {
    _id: 0,
  };

  const user = await UserModel.findOne(q, projection);
  return user;
}

export async function createUser(data: any): Promise<boolean> {
  const user = new UserModel(data);
  await user.save();
  return true;
}

export async function updateUser(userId: string, data: any): Promise<boolean> {
  await UserModel.updateOne({ uuid: userId }, data);
  return true;
}

export async function deleteUser(userId: string): Promise<boolean> {
  await UserModel.deleteOne({ uuid: userId });
  return true;
}
