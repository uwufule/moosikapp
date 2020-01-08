import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';

import app from '../src/index';
import UserModel from '../src/api/mongodb/models/user.model';

before(async () => {
  await UserModel.deleteOne({ username: 'testuser5' });

  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('supersecretpassword', salt);

  const user = new UserModel({ username: 'testuser5', email: 'testuser5@domain.com', password });
  await user.save();
});

describe('refresh token', () => {
  it('should return Status-Code 200 and correct body if tokens successfully refreshed', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser5',
        password: 'supersecretpassword',
      })
      .end((loginReq, loginRes) => {
        request(app)
          .get(`/api/v2/login/refresh?refreshToken=${loginRes.body.refreshToken}`)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .end((refreshReq, refreshRes) => {
            expect(refreshRes.body.token).to.be.a('string');
            expect(refreshRes.body.refreshToken).to.be.a('string');

            done();
          });
      });
  });

  it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
    request(app)
      .get('/api/v2/login/refresh?refreshToken=refresh-token')
      .expect(405)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Incorrect `Accept` header provided.' }, done);
  });

  it('should return Status-Code 400 and correct body if invalid refresh token provided', (done) => {
    request(app)
      .get('/api/v2/login/refresh?refreshToken=invalid-refresh-token')
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Invalid refresh token.' }, done);
  });

  it('should return Status-Code 400 and correct body if refresh token expired', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser5',
        password: 'supersecretpassword',
      })
      .end((loginReq, loginRes) => {
        request(app)
          .get(`/api/v2/login/refresh?refreshToken=${loginRes.body.refreshToken}`)
          .set('Accept', 'application/json')
          .end(() => {
            request(app)
              .get(`/api/v2/login/refresh?refreshToken=${loginRes.body.refreshToken}`)
              .set('Accept', 'application/json')
              .expect(400)
              .expect('Content-Type', /application\/json/)
              .expect({ message: 'Refresh token expired.' }, done);
          });
      });
  });

  it('should return Status-Code 400 and correct body if trying to refresh tokens for deactivated user', (done) => {
    request(app)
      .post('/api/v2/login')
      .set('Accept', 'application/json')
      .send({
        username: 'testuser5',
        password: 'supersecretpassword',
      })
      .end(async (loginReq, loginRes) => {
        await UserModel.deleteOne({ username: 'testuser5' });

        request(app)
          .get(`/api/v2/login/refresh?refreshToken=${loginRes.body.refreshToken}`)
          .set('Accept', 'application/json')
          .expect(400)
          .expect('Content-Type', /application\/json/)
          .expect({ message: 'Trying to get pair of tokens for deactivated user.' }, done);
      });
  });
});
