import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../src/index';
import UserModel from '../src/api/mongodb/models/user.model';

let token = '';

before(async () => {
  await UserModel.deleteOne({ username: 'testuser4' });

  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('supersecretpassword', salt);

  const user = new UserModel({ username: 'testuser4', email: 'testuser4@domain.com', password });
  await user.save();

  request(app)
    .post('/api/v2/login')
    .set('Accept', 'application/json')
    .send({
      username: 'testuser4',
      password: 'supersecretpassword',
    })
    .end((req, res) => {
      token = res.body.token;
    });
});

describe('logout', () => {
  it('should return Status-Code 200 and correct body if user logged out', (done) => {
    request(app)
      .post('/api/v2/logout')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Successfully logged out.' }, done);
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
    request(app)
      .post('/api/v2/logout')
      .auth(token, { type: 'bearer' })
      .expect(405)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Incorrect `Accept` header provided.' }, done);
  });

  it('should return Status-Code 403 and correct body if invalid token provided', (done) => {
    request(app)
      .post('/api/v2/logout')
      .set('Accept', 'application/json')
      .auth('invalid token', { type: 'bearer' })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Not authorized.' }, done);
  });

  it('should return Status-Code 410 and correct body if already logged out', (done) => {
    request(app)
      .post('/api/v2/logout')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' })
      .expect(410)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Already logged out.' }, done);
  });
});
