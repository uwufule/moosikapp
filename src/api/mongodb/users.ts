import UserModel from './models/user.model';

interface IUser {
  username: string;
  email: string;
  password: string;
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
  password: string;
  passwordTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenericParams {
  [key: string]: any;
}

export async function getUser(username: string): Promise<BasicUserInfo | null> {
  const projection = {
    uuid: 1,
    username: 1,
    email: 1,
    role: 1,
    createdAt: 1,
  };

  const user = await UserModel.findOne({ username }, projection);
  return user && user.toJSON();
}

export async function getByUuid(uuid: string): Promise<ExtendedUserInfo | null> {
  const user = await UserModel.findById(uuid);
  return user && user.toJSON();
}

export async function findByUsernameOrEmail(queryString: string): Promise<ExtendedUserInfo | null> {
  const query = {
    $or: [
      {
        username: queryString,
      }, {
        email: queryString,
      },
    ],
  };

  const user = await UserModel.findOne(query);
  return user && user.toJSON();
}

export async function createUser(data: IUser): Promise<string> {
  const { _id } = await (new UserModel(data)).save();
  return _id;
}

export async function updateUser(uuid: string, data: GenericParams): Promise<boolean> {
  const res = await UserModel.updateOne({ _id: uuid }, data);
  return res.n === 1;
}

export async function deleteUser(uuid: string): Promise<boolean> {
  const res = await UserModel.deleteOne({ _id: uuid });
  return res.n === 1;
}
