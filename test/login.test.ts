import Bcrypt from 'bcryptjs';
import { expect } from 'chai';
import Crypto from 'crypto';
import request from 'supertest';
import App from '../src/server/App';
import Database from '../src/server/core/infrastructure/database/Database';

const genarateTestUserData = () => {
  const username = Crypto.randomBytes(6).toString('hex');

  return {
    username,
    email: `${username}@testdomain.net`,
    password: Bcrypt.hashSync('superSecretPassword', 10),
  };
};

const initialize = (app: App, database: Database) => {
  const server = app.getServer();

  const UserModel = database.userModelProvider.get();

  const testUserData = genarateTestUserData();

  describe('login', () => {
    beforeEach(async () => {
      await new UserModel(testUserData).save();
    });

    afterEach(async () => {
      await UserModel.deleteOne({ username: testUserData.username });
    });

    it('should return Status-Code 200 and correct body if user logged in', async () => {
      const res = await request(server)
        .post('/api/v3/login')
        .set('Accept', 'application/json')
        .send({
          username: testUserData.username,
          password: 'superSecretPassword',
        });

      expect(res.status).to.eq(200);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Successfully logged in.');
      expect(res.body.result.accessToken).to.be.a('string');
      expect(res.body.result.refreshToken).to.be.a('string');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(server).post('/api/v3/login');

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {
      const res = await request(server)
        .post('/api/v3/login')
        .set('Accept', 'application/json')
        .send('invalid-content-type');

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid body provided.');
    });

    it('should return Status-Code 400 and correct body if no username provided', async () => {
      const res = await request(server)
        .post('/api/v3/login')
        .set('Accept', 'application/json')
        .send({
          password: 'superSecretPassword',
        });

      expect(res.status).to.to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Username required.');
    });

    it('should return Status-Code 400 and correct body if no password provided', async () => {
      const res = await request(server)
        .post('/api/v3/login')
        .set('Accept', 'application/json')
        .send({
          username: testUserData.username,
        });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Password required.');
    });

    it('should return Status-Code 403 and correct body if nonexistent account data provided', async () => {
      const res = await request(server)
        .post('/api/v3/login')
        .set('Accept', 'application/json')
        .send({
          username: 'nonexistent-username',
          password: 'superSecretPassword',
        });

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('This account has been deactivated.');
    });

    it('should return Status-Code 401 and correct body if invalid password provided', async () => {
      const res = await request(server)
        .post('/api/v3/login')
        .set('Accept', 'application/json')
        .send({
          username: testUserData.username,
          password: 'invalidpassword',
        });

      expect(res.status).to.eq(401);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid authorization.');
    });
  });
};

export default initialize;
