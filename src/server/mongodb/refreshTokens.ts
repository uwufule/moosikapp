import RefreshTokenModel from './models/refreshToken.model';

export const createRefreshToken = async (userId: string): Promise<string> => {
  const { _id: uuid } = await (new RefreshTokenModel({ userId })).save();
  return uuid;
};

export const deleteRefreshToken = async (uuid: string): Promise<boolean> => {
  await RefreshTokenModel.findByIdAndDelete(uuid);
  return true;
};

export const isRefreshTokenExists = async (uuid: string): Promise<boolean> => {
  const res = await RefreshTokenModel.findById(uuid);
  return res !== null;
};

export const revokeRefreshTokens = async (userId: string): Promise<boolean> => {
  const { n = 0 } = await RefreshTokenModel.deleteMany({ userId });
  return n > 0;
};
