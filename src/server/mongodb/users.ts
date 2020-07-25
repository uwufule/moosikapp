import UserModel from './models/user.model';
import toJson from './utils/toJson';

export interface AuthPayload {
  uuid: string;
  password: string;
  role: number;
}

export const getAuthPayloadByUsernameOrEmail = async (usernameOrEmail: string) => {
  const query = {
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  };

  const projection = {
    uuid: 1,
    password: 1,
    role: 1,
  };

  const user = await UserModel.findOne(query, projection);
  return toJson<AuthPayload>(user);
};

export const getAuthPayloadById = async (uuid: string) => {
  const projection = {
    uuid: 1,
    password: 1,
    role: 1,
  };

  const user = await UserModel.findById(uuid, projection);
  return toJson<AuthPayload>(user);
};

export const getUsername = async (uuid: string) => {
  const projection = {
    username: 1,
  };

  const user = await UserModel.findById(uuid, projection);
  return toJson<{ username: string }>(user)?.username;
};

export interface User {
  uuid: string;
  username: string;
  email: string;
  role: number;
  createdAt: Date;
}

export const getByUsername = async (username: string) => {
  const projection = {
    uuid: 1,
    username: 1,
    email: 1,
    role: 1,
    createdAt: 1,
  };

  const user = await UserModel.findOne({ username }, projection);
  return toJson<User>(user);
};

interface InitialUserData {
  username: string;
  email: string;
  password: string;
  role?: number;
}

export const createUser = async (data: InitialUserData) => {
  const { _id: uuid } = await new UserModel(data).save();
  return <string>uuid;
};

interface UpdatedUserData {
  [key: string]: any;
}

export const updateUser = async (uuid: string, data: UpdatedUserData) => {
  const res = await UserModel.updateOne({ _id: uuid }, data);
  return !!res.n;
};

export const deleteUser = async (uuid: string) => {
  const res = await UserModel.deleteOne({ _id: uuid });
  return !!res.n;
};

export const isUserExists = (uuid: string) => UserModel.exists({ _id: uuid });
