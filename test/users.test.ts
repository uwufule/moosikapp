import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';

import app from '../src/index';
import UserModel from '../src/api/mongodb/models/user.model';

const userData = {
  uuid: null,
  username: 'testuser3',
  email: 'testuser3@damain.com',
  role: 1,
  createdAt: Date.now(),
};

let token: string;

before(async () => {
  await UserModel.deleteOne({ username: 'testuser3' });

  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('supersecretpassword', salt);

  const user = new UserModel({ ...userData, password });
  const { _id } = await user.save();
  userData.uuid = _id;

  request(app)
    .post('/api/v2/login')
    .set('Accept', 'application/json')
    .send({
      username: 'testuser3',
      password: 'supersecretpassword',
    })
    .end((req, res) => {
      token = res.body.token;
    });
});

describe('users', () => {
  it('should return Status-Code 200 and correct body if user founded', (done) => {
    request(app)
      .get('/api/v2/users/testuser3')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end((req, res) => {
        expect(res.body.message).to.eq('Successfully retrieved user.');
        expect(res.body.user).to.deep.include({
          ...userData,
          createdAt: new Date(userData.createdAt).toISOString(),
        });

        done();
      });
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
    request(app)
      .get('/api/v2/users/testuser3')
      .auth(token, { type: 'bearer' })
      .send({
        username: 'testuser3',
        password: 'supersecretpassword',
      })
      .expect(405)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Incorrect `Accept` header provided.' }, done);
  });

  it('should return Status-Code 403 and correct body if invalid authorization data provided', (done) => {
    request(app)
      .get('/api/v2/users/nonexistentaccount')
      .set('Accept', 'application/json')
      .auth('invalidtoken', { type: 'bearer' })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Not authorized.' }, done);
  });

  it('should return Status-Code 404 and correct body if nonexistent account username provided', (done) => {
    request(app)
      .get('/api/v2/users/nonexistentaccount')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' })
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'No user found.' }, done);
  });
});
