import Crypto from 'crypto';
import { Express } from 'express';
import request from 'supertest';
import { expect } from 'chai';
import uuidv4 from 'uuid';
import JWT from 'jsonwebtoken';

import createExpressServer from '../src/server';
import UserModel from '../src/server/mongodb/models/user.model';
import RefreshTokenModel from '../src/server/mongodb/models/refreshToken.model';

const { JWT_SECRET } = process.env;

const userId = uuidv4();
const refreshTokenId = uuidv4();

const refreshToken = JWT.sign({ id: refreshTokenId, userId }, String(JWT_SECRET));

const createTestUserModel = () => {
  const username = Crypto.randomBytes(12).toString('hex');

  return new UserModel({
    _id: userId,
    username,
    email: `${username}@domain.com`,
    password: 'supersecretpassword',
  });
};

const createTestRefreshTokenModel = () => (
  new RefreshTokenModel({ _id: refreshTokenId, userId })
);

let app: Express;

describe('refresh token', () => {
  beforeEach(async () => {
    app = await createExpressServer();

    await createTestUserModel().save();
    await createTestRefreshTokenModel().save();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: userId });
    await RefreshTokenModel.deleteMany({ userId });
  });

  it('should return Status-Code 200 and correct body if tokens successfully refreshed', async () => {
    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken })
      .set('Accept', 'application/json');

    expect(res.status).to.eq(200);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.accessToken).to.be.a('string');
    expect(res.body.refreshToken).to.be.a('string');
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken });

    expect(res.status).to.eq(405);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
  });

  it('should return Status-Code 400 and correct body if invalid refresh token provided', async () => {
    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken: 'invalid-refresh-token' })
      .set('Accept', 'application/json');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Invalid refresh token provided.');
  });

  it('should return Status-Code 400 and correct body if refresh token expired', async () => {
    await RefreshTokenModel.deleteOne({ _id: refreshTokenId });

    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken })
      .set('Accept', 'application/json');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Refresh token expired.');
  });

  it('should return Status-Code 400 and correct body if trying to refresh tokens for deactivated user', async () => {
    await UserModel.deleteOne({ _id: userId });

    const res = await request(app)
      .post('/api/v2/login/refresh')
      .query({ refreshToken })
      .set('Accept', 'application/json');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Trying to get pair of tokens for deactivated user.');
  });
});
