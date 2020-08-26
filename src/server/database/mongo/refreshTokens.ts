import RefreshTokenModel from './models/refreshToken.model';

export const createRefreshTokenId = async (userId: string) => {
  const { _id: id } = await new RefreshTokenModel({ userId }).save();
  return id;
};

export const deleteRefreshTokenById = async (id: string) => {
  const res = await RefreshTokenModel.deleteOne({ _id: id });
  return !!res.n;
};

export const isRefreshTokenExists = (id: string) => RefreshTokenModel.exists({ _id: id });

export const revokeRefreshTokenById = async (id: string) => {
  const res = await RefreshTokenModel.deleteOne({ _id: id });
  return !!res.n;
};

export const revokeRefreshTokensForUser = async (userId: string) => {
  const res = await RefreshTokenModel.deleteMany({ userId });
  return !!res.n;
};
