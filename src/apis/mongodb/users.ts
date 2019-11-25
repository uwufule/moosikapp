import UserModel from './models/user';

export interface UserData {
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
  const user = await UserModel.findById(uuid);
  return user && user.toJSON();
}

export async function findUser(query: string) {
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

export async function createUser(data: any): Promise<string> {
  const user = new UserModel(data);
  const { _id } = await user.save();
  return _id;
}

export async function updateUser(userId: string, data: GenericParams): Promise<boolean> {
  await UserModel.updateOne({ uuid: userId }, data);
  return true;
}

export async function deleteUser(userId: string): Promise<boolean> {
  await UserModel.deleteOne({ uuid: userId });
  return true;
}

async function main() {
  console.log('creating');

  try {
    const u = new UserModel({ email: '1', username: '1', password: { hash: '1' } });
    const d = await u.save();
    console.log(d.toJSON());
  } catch (e) {
    console.error(e);
  }
}

main();
