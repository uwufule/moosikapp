/* eslint-disable no-underscore-dangle */

import { expect } from 'chai';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import request from 'supertest';
import uuid from 'uuid';
import App from '../src/server/App';
import Database from '../src/server/core/infrastructure/database/Database';

const generateTestUserData = () => {
  const username = Crypto.randomBytes(12).toString('hex');

  return {
    _id: uuid.v4(),
    username,
    email: `${username}@testdomain.net`,
    password: 'supersecretpassword',
  };
};

const generateTestTokenData = (userId: string) => {
  return {
    _id: uuid.v4(),
    userId,
  };
};

const signRefreshToken = (data: any) => {
  return JWT.sign(data, String(process.env.JWT_SECRET_KEY));
};

const initialize = (app: App, database: Database) => {
  const server = app.getServer();

  const TokenModel = database.tokenModelProvider.get();
  const UserModel = database.userModelProvider.get();

  const testUserData = generateTestUserData();
  const testTokenData = generateTestTokenData(testUserData._id);

  const testRefreshToken = signRefreshToken({ jti: testTokenData._id, sub: testUserData._id });

  describe('refresh token', () => {
    beforeEach(async () => {
      await new UserModel(testUserData).save();
      await new TokenModel(testTokenData).save();
    });

    afterEach(async () => {
      await UserModel.deleteOne({ _id: testUserData._id });
      await TokenModel.deleteOne({ _id: testTokenData._id });
    });

    it('should return Status-Code 200 and correct body if tokens successfully refreshed', async () => {
      const res = await request(server)
        .post('/api/v3/login/refresh')
        .set('Accept', 'application/json')
        .send({ refreshToken: testRefreshToken });

      expect(res.status).to.eq(200);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.result.accessToken).to.be.a('string');
      expect(res.body.result.refreshToken).to.be.a('string');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(server)
        .post('/api/v3/login/refresh')
        .send({ refreshToken: testRefreshToken });

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {
      const res = await request(server)
        .post('/api/v3/login/refresh')
        .set('Accept', 'application/json')
        .send('invalid-content-type');

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid body provided.');
    });

    it('should return Status-Code 400 and correct body if invalid refresh token provided', async () => {
      const res = await request(server)
        .post('/api/v3/login/refresh')
        .set('Accept', 'application/json')
        .send({ refreshToken: 'invalid-refresh-token' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid refresh token.');
    });

    it('should return Status-Code 400 and correct body if refresh token expired', async () => {
      await TokenModel.deleteOne({ _id: testTokenData._id });

      const res = await request(server)
        .post('/api/v3/login/refresh')
        .set('Accept', 'application/json')
        .send({ refreshToken: testRefreshToken });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid refresh token.');
    });

    it('should return Status-Code 400 and correct body if trying to refresh tokens for deactivated user', async () => {
      await UserModel.deleteOne({ _id: testUserData._id });

      const res = await request(server)
        .post('/api/v3/login/refresh')
        .set('Accept', 'application/json')
        .send({ refreshToken: testRefreshToken });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Trying to get token for deactivated user.');
    });
  });
};

export default initialize;
