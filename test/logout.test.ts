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

const signAccessToken = (data: any) => {
  return JWT.sign(data, String(process.env.JWT_SECRET_KEY));
};

const initialize = (app: App, database: Database) => {
  const server = app.getServer();

  const TokenModel = database.tokenModelProvider.get();
  const UserModel = database.userModelProvider.get();

  const testUserData = generateTestUserData();
  const testTokenData = generateTestTokenData(testUserData._id);

  const testAccessToken = signAccessToken({ sub: testUserData._id, scope: 1 });

  describe('logout', () => {
    beforeEach(async () => {
      await new UserModel(testUserData);
      await new TokenModel(testTokenData).save();
    });

    afterEach(async () => {
      await UserModel.deleteOne({ _id: testUserData._id });
      await TokenModel.deleteOne({ _id: testTokenData._id });
    });

    it('should return Status-Code 200 and correct body if user logged out', async () => {
      const res = await request(server)
        .post('/api/v3/logout')
        .set('Accept', 'application/json')
        .auth(testAccessToken, { type: 'bearer' });

      expect(res.status).to.eq(200);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Successfully logged out.');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(server).post('/api/v3/logout');

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(server)
        .post('/api/v3/logout')
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' });

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid authorization.');
    });

    it('should return Status-Code 410 and correct body if already logged out', async () => {
      await TokenModel.deleteMany({ userId: testUserData._id });

      const res = await request(server)
        .post('/api/v3/logout')
        .set('Accept', 'application/json')
        .auth(testAccessToken, { type: 'bearer' });

      expect(res.status).to.eq(410);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Already logged out.');
    });
  });
};

export default initialize;
