import RefreshTokenModel from './models/refreshToken.model';

export const createRefreshToken = async (userId: string) => {
  const { _id: uuid } = await new RefreshTokenModel({ userId }).save();
  return uuid;
};

export const deleteRefreshToken = async (uuid: string) => {
  const res = await RefreshTokenModel.deleteOne({ _id: uuid });
  return !!res.n;
};

export const isRefreshTokenExists = (uuid: string) => RefreshTokenModel.exists({ _id: uuid });

export const revokeRefreshTokens = async (userId: string) => {
  const res = await RefreshTokenModel.deleteMany({ userId });
  return !!res.n;
};
