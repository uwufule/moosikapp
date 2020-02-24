import request from 'supertest';
import { expect } from 'chai';
import JWT from 'jsonwebtoken';

import app from '../src/app';
import UserModel from '../src/mongodb/models/user.model';

const { JWT_SECRET } = process.env;

describe('users', () => {
  const token = JWT.sign({ uuid: 'testuser3-uuid', role: 1 }, String(JWT_SECRET));

  beforeEach(async () => {
    await (new UserModel({
      _id: 'testuser3-uuid',
      username: 'testuser3',
      email: 'testuser3@domain.tld',
      password: 'supersecretpassword',
    })).save();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ username: 'testuser3' });
  });

  it('should return Status-Code 200 and correct body if user founded', async () => {
    const res = await request(app)
      .get('/api/v2/users/testuser3')
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
      .get('/api/v2/users/testuser3')
      .auth('access token', { type: 'bearer' });

    expect(res.status).to.eq(405);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
  });

  it('should return Status-Code 403 and correct body if invalid authorization data provided', async () => {
    const res = await request(app)
      .get('/api/v2/users/nonexistentaccount')
      .set('Accept', 'application/json')
      .auth('invalid access token', { type: 'bearer' });

    expect(res.status).to.eq(403);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Not authorized.');
  });

  it('should return Status-Code 404 and correct body if nonexistent account username provided', async () => {
    const res = await request(app)
      .get('/api/v2/users/nonexistent-account')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' });

    expect(res.status).to.eq(404);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('No user found.');
  });
});
