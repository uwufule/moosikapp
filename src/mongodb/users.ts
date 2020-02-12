import UserModel from './models/user.model';

interface IUser {
  username: string;
  email: string;
  password: string;
  role?: number;
}

export interface PublicUserData {
  uuid: string;
  username: string;
  email: string;
  role: number;
  createdAt: Date;
}

export interface PrivateUserData extends PublicUserData {
  password: string;
  updatedAt: Date;
}

export interface GenericParams {
  [key: string]: any;
}

export const getUser = async (username: string): Promise<PublicUserData | null> => {
  const projection = {
    uuid: 1,
    username: 1,
    email: 1,
    role: 1,
    createdAt: 1,
  };

  const user = await UserModel.findOne({ username }, projection);
  return user?.toJSON();
};

export const getUserByUuid = async (uuid: string): Promise<PrivateUserData | null> => {
  const user = await UserModel.findById(uuid);
  return user?.toJSON();
};

export const findByUsernameOrEmail = (
  async (queryString: string): Promise<PrivateUserData | null> => {
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
    return user?.toJSON();
  }
);

export const createUser = async (data: IUser): Promise<string> => {
  const { _id: uuid } = await (new UserModel(data)).save();
  return uuid;
};

export const updateUser = async (uuid: string, data: GenericParams): Promise<boolean> => {
  const res = await UserModel.updateOne({ _id: uuid }, data);
  return res.n === 1;
};

export const deleteUser = async (uuid: string): Promise<boolean> => {
  const res = await UserModel.deleteOne({ _id: uuid });
  return res.n === 1;
};
