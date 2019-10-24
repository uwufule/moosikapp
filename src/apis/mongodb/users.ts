import UserModel from './models/user';

export interface UserData {
  uuid: string;
  username: string;
  email: string;
  password: {
    hash: string;
  };
  role?: number;
}

export interface BasicUserInfo {
  uuid: string;
  username: string;
  email: string;
  role: number;
  createdAt: Date;
}

export interface ExtendedUserInfo extends BasicUserInfo {
  password: {
    hash: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GenericParams {
  [key: string]: any;
}

export async function getUser(username: string): Promise<BasicUserInfo | null> {
  const projection = {
    _id: 0,
    uuid: 1,
    username: 1,
    email: 1,
    role: 1,
    createdAt: 1,
  };

  const user = await UserModel.findOne({ username }, projection);
  return user as BasicUserInfo;
}

export async function getUserByUuid(uuid: string): Promise<ExtendedUserInfo | null> {
  const projection = {
    _id: 0,
  };

  const user = await UserModel.findOne({ uuid }, projection);
  return user as ExtendedUserInfo;
}

export async function findUser(query: string): Promise<ExtendedUserInfo | null> {
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
  return user as ExtendedUserInfo;
}

export async function createUser(data: UserData): Promise<boolean> {
  const user = new UserModel(data);
  await user.save();
  return true;
}

export async function updateUser(userId: string, data: GenericParams): Promise<boolean> {
  await UserModel.updateOne({ uuid: userId }, data);
  return true;
}

export async function deleteUser(userId: string): Promise<boolean> {
  await UserModel.deleteOne({ uuid: userId });
  return true;
}
