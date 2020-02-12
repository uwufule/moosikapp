import TokenModel from './models/token.model';

export interface RefreshTokenPayload {
  userId: string;
  hex: string;
}

export const addToken = async (payload: RefreshTokenPayload): Promise<boolean> => {
  await (new TokenModel(payload)).save();
  return true;
};

export const isTokenExists = async (payload: RefreshTokenPayload): Promise<boolean> => {
  const res = await TokenModel.find({ ...payload });
  return res.length === 1;
};

export const updateToken = async (old: string, hex: string): Promise<boolean> => {
  const res = await TokenModel.updateOne({ hex: old }, { hex });
  return res.n === 1;
};

export const revokeTokens = async (userId: string): Promise<number | undefined> => {
  const res = await TokenModel.deleteMany({ userId });
  return res.n;
};
