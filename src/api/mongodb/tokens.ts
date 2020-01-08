import TokenModel from './models/token.model';

export interface RefreshTokenRecord {
  userId: string;
  payload: string;
}

export async function insert(record: RefreshTokenRecord): Promise<boolean> {
  await (new TokenModel(record)).save();
  return true;
}

export async function contains(record: RefreshTokenRecord): Promise<boolean> {
  const res = await TokenModel.find({ userId: record.userId, payload: record.payload });
  return res.length === 1;
}

export async function update(oldPayload: string, newPayload: string) {
  const res = await TokenModel.updateOne({ payload: oldPayload }, { payload: newPayload });
  return res.n === 1;
}

export async function clear(userId: string) {
  const res = await TokenModel.deleteMany({ userId });
  return res.n;
}
