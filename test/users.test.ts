import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';

import app from '../src/index';
import UserModel from '../src/mongodb/models/user.model';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const ISODATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

beforeEach(async () => {
  await UserModel.deleteOne({ username: 'testuser3' });

  const password = await bcrypt.hash('supersecretpassword', 10);
  const user = new UserModel({
    username: 'testuser3',
    email: 'testuser3@domain.com',
    password,
  });
  await user.save();
});

describe('users', () => {
  it('should return Status-Code 200 and correct body if user founded', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser3',
        password: 'supersecretpassword',
      })
      .end((loginReq, loginRes) => {
        request(app)
          .get('/api/v2/users/testuser3')
          .set('Accept', 'application/json')
          .auth(loginRes.body.token, { type: 'bearer' })
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .end((req, res) => {
            expect(res.body.message).to.eq('Successfully retrieved user.');
            expect(res.body.user.uuid).to.match(UUID_REGEX);
            expect(res.body.user.username).to.be.eq('testuser3');
            expect(res.body.user.email).to.be.eq('testuser3@domain.com');
            expect(res.body.user.role).to.be.eq(1);
            expect(res.body.user.createdAt).to.match(ISODATE_REGEX);

            done();
          });
      });
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
    request(app)
      .get('/api/v2/users/testuser3')
      .auth('access token', { type: 'bearer' })
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
      .auth('invalid access token', { type: 'bearer' })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Not authorized.' }, done);
  });

  it('should return Status-Code 404 and correct body if nonexistent account username provided', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser3',
        password: 'supersecretpassword',
      })
      .end((req, res) => {
        request(app)
          .get('/api/v2/users/nonexistent-account')
          .set('Accept', 'application/json')
          .auth(res.body.token, { type: 'bearer' })
          .expect(404)
          .expect('Content-Type', /application\/json/)
          .expect({ message: 'No user found.' }, done);
      });
  });
});
