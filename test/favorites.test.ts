import Crypto from 'crypto';
import { Express } from 'express';
import request from 'supertest';
import { expect } from 'chai';
import uuidv4 from 'uuid';
import JWT from 'jsonwebtoken';

import createExpressServer from '../src/server';
import UserModel from '../src/server/mongodb/models/user.model';
import SongModel from '../src/server/mongodb/models/song.model';

const { JWT_SECRET } = process.env;

const userId = uuidv4();

const songId = uuidv4();

const token = JWT.sign({ uuid: userId, role: 1 }, String(JWT_SECRET));

const createTestUserModel = () => {
  const username = Crypto.randomBytes(12).toString('hex');

  return new UserModel({
    _id: userId,
    username,
    email: `${username}@domain.com`,
    password: 'supersecretpassword',
  });
};

const createTestSongModel = () => (
  new SongModel({
    _id: songId,
    uploadedBy: userId,
    path: '/path/to/file',
    likes: [userId],
  })
);

let app: Express;

describe('favorites', () => {
  beforeEach(async () => {
    app = await createExpressServer();

    await createTestUserModel().save();

    await createTestSongModel().save();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: userId });

    await SongModel.deleteOne({ _id: songId });
  });

  describe('retrieve', () => {
    it('should return Status-Code 200 and correct body if song list sucessfully retrieved', async () => {
      const res = await request(app)
        .get('/api/v2/favorites')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(200);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Successfully retrieved favorites.');
      expect(res.body.songs).to.be.an('array');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app)
        .get('/api/v2/favorites');

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(app)
        .get('/api/v2/favorites')
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' });

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid authorization.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', async () => {
      const res = await request(app)
        .get('/api/v2/favorites')
        .query({ skip: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `skip` provided.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', async () => {
      const res = await request(app)
        .get('/api/v2/favorites')
        .query({ limit: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `limit` provided.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', async () => {
      const res = await request(app)
        .get('/api/v2/favorites')
        .query({ scope: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `scope` provided.');
    });
  });

  describe('add', () => {
    it('should return Status-Code 204 and correct body if song sucessfully added to favorites', async () => {
      const res = await request(app)
        .post(`/api/v2/favorites/${songId}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(204);
      expect(res.body).to.deep.eq({});
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app)
        .post(`/api/v2/favorites/${songId}`);

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(app)
        .post(`/api/v2/favorites/${songId}`)
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' });

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid authorization.');
    });

    it('should return Status-Code 404 and correct body if no song found', async () => {
      const res = await request(app)
        .post('/api/v2/favorites/nonexistent-song-uuid')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(404);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('No song found.');
    });
  });

  describe('remove', () => {
    it('should return Status-Code 200 and correct body if song sucessfully added to favorites', async () => {
      const res = await request(app)
        .delete(`/api/v2/favorites/${songId}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(204);
      expect(res.body).to.be.deep.eq({});
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app)
        .delete(`/api/v2/favorites/${songId}`);

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(app)
        .delete(`/api/v2/favorites/${songId}`)
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' });

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid authorization.');
    });

    it('should return Status-Code 404 and correct body if no song found', async () => {
      const res = await request(app)
        .delete('/api/v2/favorites/nonexistent-song-uuid')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(404);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('No song found.');
    });

    it('should return Status-Code 404 and correct body if song not in favorites', async () => {
      await SongModel.updateOne({ _id: songId }, { $pull: { likes: userId } });

      const res = await request(app)
        .delete(`/api/v2/favorites/${songId}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(404);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('No favorite found.');
    });
  });
});
