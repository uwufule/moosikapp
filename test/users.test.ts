import Crypto from 'crypto';
import { Express } from 'express';
import request from 'supertest';
import { expect } from 'chai';
import uuidv4 from 'uuid/v4';
import JWT from 'jsonwebtoken';

import createExpressServer from '../src/server';
import UserModel from '../src/server/mongodb/models/user.model';

const { JWT_SECRET } = process.env;

const userId = uuidv4();
const username = Crypto.randomBytes(12).toString('hex');

const token = JWT.sign({ uuid: userId, role: 1 }, String(JWT_SECRET));

const createTestUserModel = () => (
  new UserModel({
    _id: userId,
    username,
    email: `${username}@domain.com`,
    password: 'supersecretpassword',
  })
);

let app: Express;

describe('users', () => {
  beforeEach(async () => {
    app = await createExpressServer();

    await createTestUserModel().save();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: userId });
  });

  it('should return Status-Code 200 and correct body if user founded', async () => {
    const res = await request(app)
      .get(`/api/v2/users/${username}`)
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' });

    expect(res.status).to.eq(200);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Successfully retrieved user.');
    expect(res.body.user).that.includes.all.keys([
      'uuid',
      'username',
      'email',
      'role',
      'createdAt',
    ]);
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
    const res = await request(app)
      .get(`/api/v2/users/${username}`)
      .auth('access token', { type: 'bearer' });

    expect(res.status).to.eq(405);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
  });

  it('should return Status-Code 403 and correct body if invalid authorization data provided', async () => {
    const res = await request(app)
      .get(`/api/v2/users/${username}`)
      .set('Accept', 'application/json')
      .auth('invalid access token', { type: 'bearer' });

    expect(res.status).to.eq(403);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Not authorized.');
  });

  it('should return Status-Code 404 and correct body if nonexistent account username provided', async () => {
    const res = await request(app)
      .get('/api/v2/users/nonexistentaccount')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' });

    expect(res.status).to.eq(404);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('No user found.');
  });
});
