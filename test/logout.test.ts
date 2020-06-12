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

const token = JWT.sign({ uuid: userId, role: 1 }, String(JWT_SECRET));

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
  new RefreshTokenModel({ _id: uuidv4(), userId })
);

let app: Express;

describe('logout', () => {
  beforeEach(async () => {
    app = await createExpressServer();

    await createTestUserModel().save();
    await createTestRefreshTokenModel().save();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: userId });
    await RefreshTokenModel.deleteMany({ userId });
  });

  it('should return Status-Code 200 and correct body if user logged out', async () => {
    const res = await request(app)
      .post('/api/v2/logout')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' });

    expect(res.status).to.eq(200);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Successfully logged out.');
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
    const res = await request(app)
      .post('/api/v2/logout');

    expect(res.status).to.eq(405);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
  });

  it('should return Status-Code 403 and correct body if invalid token provided', async () => {
    const res = await request(app)
      .post('/api/v2/logout')
      .set('Accept', 'application/json')
      .auth('invalid-access-token', { type: 'bearer' });

    expect(res.status).to.eq(403);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Invalid authorization.');
  });

  it('should return Status-Code 410 and correct body if already logged out', async () => {
    await RefreshTokenModel.deleteMany({ userId });

    const res = await request(app)
      .post('/api/v2/logout')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' });

    expect(res.status).to.eq(410);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Already logged out.');
  });
});
