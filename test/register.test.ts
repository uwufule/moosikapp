import request from 'supertest';
import { expect } from 'chai';

import app from '../src/app';
import UserModel from '../src/mongodb/models/user.model';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('registration', () => {
  beforeEach(async () => {
    await UserModel.deleteOne({ username: 'testuser1' });
  });

  it('should return Status-Code 201 and correct body if user entered correct data', async () => {
    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser1',
        email: 'testuser1@domain.com',
        password: 'supersecretpassword',
      });

    expect(res.status).to.eq(201);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('You have successfully created a new account.');
    expect(res.body.uuid).to.be.match(UUID_REGEX);
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
    const res = await request(app)
      .post('/api/v2/register');

    expect(res.status).to.eq(405);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
  });

  it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {
    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send('string-instead-json');

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('Invalid body provided.');
  });

  it('should return Status-Code 400 and correct body if user provided invalid username', async () => {
    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'invalid-username',
        email: 'testuser1@domain.com',
        password: 'supersecretpassword',
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
        username: 'testuser1',
        email: 'invalid-email',
        password: 'supersecretpassword',
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
        username: 'username',
        email: 'email@moosikapp.tk',
        password: 'short',
      });

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.match(/Invalid password provided./);
  });

  it('should return Status-Code 400 and correct body if user with provided username/email already exists', async () => {
    await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser1',
        email: 'testuser1@domain.com',
        password: 'supersecretpassword',
      });

    const res = await request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser1',
        email: 'testuser1@domain.com',
        password: 'supersecretpassword',
      });

    expect(res.status).to.eq(400);
    expect(res.header['content-type']).to.match(/application\/json/);
    expect(res.body.message).to.eq('An account with that email address and/or username already exists.');
  });
});
