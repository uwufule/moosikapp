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
    password: 'supersecretpassword',
  };
};

const initialize = (app: App, database: Database) => {
  const server = app.getServer();

  const UserModel = database.userModelProvider.get();

  const testUserData = genarateTestUserData();

  describe('signup', () => {
    beforeEach(async () => {
      await UserModel.deleteOne({ username: testUserData.username });
    });

    afterEach(async () => {
      await UserModel.deleteOne({ username: testUserData.username });
    });

    it('should return Status-Code 201 and correct body if user entered correct data', async () => {
      const res = await request(server)
        .post('/api/v3/signup')
        .set('Accept', 'application/json')
        .send(genarateTestUserData());

      expect(res.status).to.eq(201);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('You have successfully created a new account.');
      expect(res.body.result.id).to.be.a('string');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(server).post('/api/v3/signup');

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {
      const res = await request(server)
        .post('/api/v3/signup')
        .set('Accept', 'application/json')
        .send('invalid-content-type');

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid body provided.');
    });

    it('should return Status-Code 400 and correct body if user provided invalid username', async () => {
      const res = await request(server)
        .post('/api/v3/signup')
        .set('Accept', 'application/json')
        .send({
          ...genarateTestUserData(),
          username: 'invalid-username',
        });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.match(/Invalid username provided./);
    });

    it('should return Status-Code 400 and correct body if user provided invalid email', async () => {
      const res = await request(server)
        .post('/api/v3/signup')
        .set('Accept', 'application/json')
        .send({
          ...genarateTestUserData(),
          email: 'invalid-email',
        });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.match(/Invalid e-mail address provided./);
    });

    it('should return Status-Code 400 and correct body if user provided invalid password', async () => {
      const res = await request(server)
        .post('/api/v3/signup')
        .set('Accept', 'application/json')
        .send({
          ...genarateTestUserData(),
          password: 'short',
        });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.match(/Invalid password provided./);
    });

    it('should return Status-Code 400 and correct body if user with provided username/email already exists', async () => {
      await new UserModel(testUserData).save();

      const res = await request(server)
        .post('/api/v3/signup')
        .set('Accept', 'application/json')
        .send(testUserData);

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq(
        'An account with that email address and/or username already exists.',
      );
    });
  });
};

export default initialize;
