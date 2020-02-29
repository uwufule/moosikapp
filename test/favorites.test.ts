import request from 'supertest';
import { expect } from 'chai';
import JWT from 'jsonwebtoken';

import app from '../src/server';
import UserModel from '../src/server/mongodb/models/user.model';
import SongModel from '../src/server/mongodb/models/song.model';

const { JWT_SECRET } = process.env;

let token: string;

describe('favorites', () => {
  beforeEach(async () => {
    await (new UserModel({
      _id: 'testuser6-uuid',
      username: 'testuser6',
      email: 'testuser6@domain.com',
      password: 'supersecretpassword',
    })).save();

    await (new SongModel({
      _id: 'testsong1-uuid',
      uploadedBy: 'testuser6-uuid',
      path: '/path/to/file',
      likes: ['testuser6-uuid'],
    })).save();

    token = JWT.sign({ uuid: 'testuser6-uuid', role: 1 }, String(JWT_SECRET));
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: 'testuser6-uuid' });

    await SongModel.deleteOne({ _id: 'testsong1-uuid' });
  });

  describe('retrieve', () => {
    it('should return Status-Code 200 and correct body if song list sucessfully retrieved', (done) => {
      request(app)
        .get('/api/v2/favorites')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Successfully retrieved favorite songs.' })
        .end((err, res) => {
          expect(res.body.songs).to.be.a('array');

          done();
        });
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
      request(app)
        .get('/api/v2/favorites')
        .expect(405)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Incorrect `Accept` header provided.' }, done);
    });

    it('should return Status-Code 403 and correct body if invalid token provided', (done) => {
      request(app)
        .get('/api/v2/favorites')
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' })
        .expect(403)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Not authorized.' }, done);
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', (done) => {
      request(app)
        .get('/api/v2/favorites')
        .query({ skip: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Invalid query parameter `skip` provided.' }, done);
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', (done) => {
      request(app)
        .get('/api/v2/favorites')
        .query({ limit: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Invalid query parameter `limit` provided.' }, done);
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', (done) => {
      request(app)
        .get('/api/v2/favorites')
        .query({ scope: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Invalid query parameter `scope` provided.' }, done);
    });
  });

  describe('add', () => {
    it('should return Status-Code 200 and correct body if song sucessfully added to favorites', (done) => {
      request(app)
        .post('/api/v2/favorites/testsong1-uuid')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end((err, res) => {
          expect(res.body.message).to.eq('Successfully added song to favorites.');
          expect(res.body.uuid).to.eq('testsong1-uuid');

          done();
        });
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
      request(app)
        .post('/api/v2/favorites/testsong1-uuid')
        .expect(405)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Incorrect `Accept` header provided.' }, done);
    });

    it('should return Status-Code 403 and correct body if invalid token provided', (done) => {
      request(app)
        .post('/api/v2/favorites/testsong1-uuid')
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' })
        .expect(403)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Not authorized.' }, done);
    });

    it('should return Status-Code 404 and correct body if no song found', (done) => {
      request(app)
        .post('/api/v2/favorites/nonexistent-song-uuid')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .expect(404)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'No song found.' }, done);
    });
  });

  describe('remove', () => {
    it('should return Status-Code 200 and correct body if song sucessfully added to favorites', (done) => {
      request(app)
        .delete('/api/v2/favorites/testsong1-uuid')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .expect(204)
        .expect({}, done);
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {
      request(app)
        .delete('/api/v2/favorites/testsong1-uuid')
        .expect(405)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Incorrect `Accept` header provided.' }, done);
    });

    it('should return Status-Code 403 and correct body if invalid token provided', (done) => {
      request(app)
        .delete('/api/v2/favorites/testsong1-uuid')
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' })
        .expect(403)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'Not authorized.' }, done);
    });

    it('should return Status-Code 404 and correct body if no song found', (done) => {
      request(app)
        .delete('/api/v2/favorites/nonexistent-song-uuid')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .expect(404)
        .expect('Content-Type', /application\/json/)
        .expect({ message: 'No song found.' }, done);
    });

    it('should return Status-Code 404 and correct body if song not in favorites', (done) => {
      request(app)
        .delete('/api/v2/favorites/testsong1-uuid')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .end(() => {
          request(app)
            .delete('/api/v2/favorites/testsong1-uuid')
            .set('Accept', 'application/json')
            .auth(token, { type: 'bearer' })
            .expect(404)
            .expect('Content-Type', /application\/json/)
            .expect({ message: 'No favorite.' }, done);
        });
    });
  });
});
