import Crypto from 'crypto';
import { Express } from 'express';
import request from 'supertest';
import { expect } from 'chai';

import createExpressServer from '../src/server';
import UserModel from '../src/server/database/mongo/models/user.model';

const username = Crypto.randomBytes(12).toString('hex');

const user = {
  username,
  email: `${username}@domain.com`,
  password: 'supersecretpassword',
};

let app: Express;

describe('registration', () => {
  beforeEach(async () => {
    app = await createExpressServer();

    await UserModel.deleteOne({ username });
  });

  it('should return Status-Code 201 and correct body if user entered correct data', async () => {
    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send(user);

    expect(res.status).to.eq(201);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('You have successfully created a new account.');
    expect(res.body.uuid).to.be.a('string');
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
    const res = await request(app).post('/api/v2/register');

    expect(res.status).to.eq(405);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
  });

  it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {
    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send('invalid-content-type');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Invalid body provided.');
  });

  it('should return Status-Code 400 and correct body if user provided invalid username', async () => {
    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        ...user,
        username: 'invalid-username',
      });

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.match(/Invalid username provided./);
  });

  it('should return Status-Code 400 and correct body if user provided invalid email', async () => {
    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        ...user,
        email: 'invalid-email',
      });

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.match(/Invalid e-mail address provided./);
  });

  it('should return Status-Code 400 and correct body if user provided invalid password', async () => {
    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        ...user,
        password: 'short',
      });

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.match(/Invalid password provided./);
  });

  it('should return Status-Code 400 and correct body if user with provided username/email already exists', async () => {
    await new UserModel(user).save();

    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send(user);

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq(
      'An account with that email address and/or username already exists.',
    );
  });
});
