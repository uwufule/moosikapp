import request from 'supertest';
import { expect } from 'chai';

import UserModel from '../src/api/mongodb/models/user.model';
import app from '../src/index';

before(async () => {
  await UserModel.deleteOne({ username: 'testuser1' });
});

describe('registration', () => {
  it('should return Status-Code 201 and correct body if user entered correct data', (done) => {
    request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser1',
        email: 'testuser1@domain.com',
        password: 'supersecretpassword',
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .end((req, res) => {
        expect(res.body.message).to.eq('You have successfully created a new account.');
        expect(res.body).to.have.property('uuid');

        done();
      });
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
    request(app)
      .post('/api/v2/register')
      .send({
        username: 'testuser1',
        email: 'testuser1@domain.com',
        password: 'supersecretpassword',
      })
      .expect(405)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Incorrect `Accept` header provided.' }, done);
  });

  it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', (done) => {
    request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send('')
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Invalid body provided.' }, done);
  });

  it('should return Status-Code 400 and correct body if user entered invalid username', (done) => {
    request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'incorrect username',
        email: 'testuser1@domain.com',
        password: 'supersecretpassword',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end((req, res) => {
        expect(res.body.message).to.match(/Invalid username provided./);

        done();
      });
  });

  it('should return Status-Code 400 and correct body if user entered invalid email', (done) => {
    request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser1',
        email: 'invalid email',
        password: 'supersecretpassword',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end((req, res) => {
        expect(res.body.message).to.match(/Invalid e-mail address provided./);

        done();
      });
  });

  it('should return Status-Code 400 and correct body if user entered invalid password', (done) => {
    request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'username',
        email: 'email@moosikapp.tk',
        password: 'short',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .end((req, res) => {
        expect(res.body.message).to.match(/Invalid password provided./);

        done();
      });
  });

  it('should return Status-Code 400 and correct body if user with provided username/email already exists', (done) => {
    request(app)
      .post('/api/v2/register')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser1',
        email: 'testuser1@domain.com',
        password: 'supersecretpassword',
      })
      .end(() => {
        request(app)
          .post('/api/v2/register')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify({
            username: 'testuser1',
            email: 'testuser1@domain.com',
            password: 'supersecretpassword',
          }))
          .expect(400)
          .expect('Content-Type', /application\/json/)
          .expect({ message: 'An account with that email address and/or username already exists.' }, done);
      });
  });
});
