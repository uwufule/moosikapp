import request from 'supertest';
import Crypto from 'crypto';
import JWT from 'jsonwebtoken';

import app from '../src/index';
import UserModel from '../src/mongodb/models/user.model';
import TokenModel from '../src/mongodb/models/token.model';

const { JWT_SECRET } = process.env;

describe('logout', () => {
  const token = JWT.sign({ uuid: 'testuser4-uuid' }, String(JWT_SECRET));

  beforeEach(async () => {
    await UserModel.deleteOne({ username: 'testuser4' });

    await (new UserModel({
      _id: 'testuser4-uuid',
      username: 'testuser4',
      email: 'testuser4@domain.com',
      password: 'supersecretpassword',
    })).save();

    await TokenModel.deleteMany({ userId: 'testuser4-uuid' });

    await (new TokenModel({
      userId: 'testuser4-uuid',
      hex: Crypto.randomBytes(6).toString('hex'),
    })).save();
  });

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
      .expect(405)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Incorrect `Accept` header provided.' }, done);
  });

  it('should return Status-Code 403 and correct body if invalid token provided', (done) => {
    request(app)
      .post('/api/v2/logout')
      .set('Accept', 'application/json')
      .auth('invalid-access-token', { type: 'bearer' })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Not authorized.' }, done);
  });

  it('should return Status-Code 410 and correct body if already logged out', (done) => {
    request(app)
      .post('/api/v2/logout')
      .set('Accept', 'application/json')
      .auth(token, { type: 'bearer' })
      .end(() => {
        request(app)
          .post('/api/v2/logout')
          .set('Accept', 'application/json')
          .auth(token, { type: 'bearer' })
          .expect(410)
          .expect('Content-Type', /application\/json/)
          .expect({ message: 'Already logged out.' }, done);
      });
  });
});
