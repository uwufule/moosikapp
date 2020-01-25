import TokenModel from './models/token.model';

export interface RefreshTokenPayload {
  userId: string;
  hex: string;
}

export async function insert(payload: RefreshTokenPayload): Promise<boolean> {
  await (new TokenModel(payload)).save();
  return true;
}

export async function contains(payload: RefreshTokenPayload): Promise<boolean> {
  const res = await TokenModel.find({ ...payload });
  return res.length === 1;
}

export async function update(old: string, hex: string): Promise<boolean> {
  const res = await TokenModel.updateOne({ hex: old }, { hex });
  return res.n === 1;
}

export async function clear(userId: string): Promise<number | undefined> {
  const res = await TokenModel.deleteMany({ userId });
  return res.n;
}
