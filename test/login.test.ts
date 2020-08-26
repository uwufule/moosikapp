import Crypto from 'crypto';
import { Express } from 'express';
import request from 'supertest';
import { expect } from 'chai';
import uuidv4 from 'uuid';
import Bcrypt from 'bcryptjs';

import createExpressServer from '../src/server';
import UserModel from '../src/server/database/mongo/models/user.model';

const userId = uuidv4();
const username = Crypto.randomBytes(12).toString('hex');

const createTestUserModel = async () =>
  new UserModel({
    _id: userId,
    username,
    email: `${username}@domain.com`,
    password: await Bcrypt.hash('supersecretpassword', 6),
  });

let app: Express;

describe('login', () => {
  beforeEach(async () => {
    app = await createExpressServer();

    const testUser = await createTestUserModel();
    await testUser.save();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: userId });
  });

  it('should return Status-Code 200 and correct body if user logged in', async () => {
    const res = await request(app).post('/api/v2/login').set('Accept', 'application/json').send({
      username,
      password: 'supersecretpassword',
    });

    expect(res.status).to.eq(200);
    expect(res.header['content-type']).to.match(/application\/json/);

    expect(res.body.message).to.eq('Successfully logged in.');
    expect(res.body.accessToken).to.be.a('string');
    expect(res.body.refreshToken).to.be.a('string');
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
    const res = await request(app).post('/api/v2/login');

    expect(res.status).to.eq(405);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
  });

  it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {
    const res = await request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send('invalid-content-type');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Invalid body provided.');
  });

  it('should return Status-Code 400 and correct body if no username provided', async () => {
    const res = await request(app).post('/api/v2/login').set('Accept', 'application/json').send({
      password: 'supersecretpassword',
    });

    expect(res.status).to.to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Username required.');
  });

  it('should return Status-Code 400 and correct body if no password provided', async () => {
    const res = await request(app).post('/api/v2/login').set('Accept', 'application/json').send({
      username,
    });

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Password required.');
  });

  it('should return Status-Code 403 and correct body if nonexistent account data provided', async () => {
    const res = await request(app).post('/api/v2/login').set('Accept', 'application/json').send({
      username: 'nonexistent-username',
      password: 'supersecretpassword',
    });

    expect(res.status).to.eq(403);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('This account has been deactivated.');
  });

  it('should return Status-Code 401 and correct body if invalid password provided', async () => {
    const res = await request(app).post('/api/v2/login').set('Accept', 'application/json').send({
      username,
      password: 'invalidpassword',
    });

    expect(res.status).to.eq(401);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Invalid authorization.');
  });
});
