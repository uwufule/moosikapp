import { Express } from 'express';
import Crypto from 'crypto';
import { readFile } from 'fs';
import { promisify } from 'util';
import request from 'supertest';
import { expect } from 'chai';
import uuidv4 from 'uuid/v4';
import JWT from 'jsonwebtoken';

import createExpressServer from '../src/server';
import UserModel from '../src/server/mongodb/models/user.model';
import SongModel from '../src/server/mongodb/models/song.model';

const readFileAsync = promisify(readFile);

const { JWT_SECRET } = process.env;

const userId = uuidv4();

const songId = uuidv4();

const token = JWT.sign({ uuid: userId, role: 1024 }, String(JWT_SECRET));

const createTestUserModel = () => {
  const username = Crypto.randomBytes(12).toString('hex');

  return new UserModel({
    _id: userId,
    username,
    email: `${username}@domain.com`,
    password: 'supersecretpassword',
  });
};

const createTestSongModel = () =>
  new SongModel({
    _id: songId,
    author: 'TestAuthor',
    title: 'TestTitle',
    cover: 'http://path/to/cover.png',
    uploadedBy: userId,
    path: '/path/to/file',
    likes: [userId],
  });

let app: Express;

describe('songs', () => {
  beforeEach(async () => {
    app = await createExpressServer();

    await createTestUserModel().save();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: userId });
  });

  describe('upload', () => {
    it.skip('should return Status-Code 201 and correct body if song successfully uploaded', async () => {
      const song = await readFileAsync('./test/dataset/song.mp3');

      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth(token, { type: 'bearer' })
        .send(song);

      expect(res.status).to.eq(201);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('You have successfully uploaded a new song.');
      expect(res.body.uuid).to.be.a('string');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app).post('/api/v2/songs');

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {
      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .send('invalid-content-type');

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid body provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth('invalid-access-token', { type: 'bearer' })
        .send();

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid authorization.');
    });

    it('should return Status-Code 413 and correct body if song too large', async () => {
      const largeSong = Buffer.alloc(11534336); // 11MB payload

      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth(token, { type: 'bearer' })
        .send(largeSong);

      expect(res.status).to.eq(413);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Request entity too large.');
    });

    it.skip('should return Status-Code 409 and correct body if song already exists', async () => {
      const song = await readFileAsync('./test/dataset/song.mp3');

      await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth(token, { type: 'bearer' })
        .send(song);

      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth(token, { type: 'bearer' })
        .send(song);

      expect(res.status).to.eq(409);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Resource already exists.');
    });
  });

  describe('get list', () => {
    beforeEach(async () => {
      await createTestSongModel().save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: songId });
    });

    it('should return Status-Code 200 and correct body if song list sucessfully retrieved', async () => {
      const res = await request(app)
        .get('/api/v2/songs')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(200);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Successfully retrieved songs.');
      expect(res.body.songs).to.be.a('array');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app).get('/api/v2/songs');

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs')
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

    it('should return Status-Code 404 and correct body if no song found', async () => {
      await SongModel.deleteMany({});

      const res = await request(app)
        .get('/api/v2/songs')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(404);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('No songs found.');
    });
  });

  describe('get by uuid', () => {
    beforeEach(async () => {
      await createTestSongModel().save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: songId });
    });

    it('should return Status-Code 200 and correct body if song sucessfully retrieved', async () => {
      const res = await request(app)
        .get(`/api/v2/songs/${songId}`)
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(200);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Successfully retrieved song.');
      expect(res.body.song).that.includes.all.keys([
        'uuid',
        'author',
        'title',
        'cover',
        'uploadedBy',
        'url',
        'createdAt',
        'favorite',
        'edit',
      ]);
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app).get(`/api/v2/songs/${songId}`);

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(app)
        .get(`/api/v2/songs/${songId}`)
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' });

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid authorization.');
    });

    it('should return Status-Code 404 and correct body if no song found', async () => {
      const res = await request(app)
        .get('/api/v2/songs/nonexistentsong')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(404);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('No song found.');
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      await createTestSongModel().save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: songId });
    });

    it('should return Status-Code 200 and correct body if song list sucessfully retrieved', async () => {
      const res = await request(app)
        .get('/api/v2/songs/search')
        .query({ query: 'title' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(200);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Successfully retrieved songs.');
      expect(res.body.songs).to.be.a('array');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app).get('/api/v2/songs/search');

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/search')
        .set('Accept', 'application/json')
        .query({ query: 'title' })
        .auth('invalid-access-token', { type: 'bearer' });

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid authorization.');
    });

    it('should return Status-Code 404 and correct body if no song found', async () => {
      const res = await request(app)
        .get('/api/v2/songs/search')
        .query({ query: 'no-response-for-this-query' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(404);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('No songs found.');
    });

    it('should return Status-Code 400 and correct body if invalid no query parameter `query` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/search')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `query` provided.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/search')
        .query({ query: 'title' })
        .query({ skip: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `skip` provided.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/search')
        .query({ query: 'title' })
        .query({ limit: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `limit` provided.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/search')
        .query({ query: 'title' })
        .query({ scope: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `scope` provided.');
    });
  });

  describe.skip('update', () => {
    beforeEach(async () => {
      await createTestSongModel().save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: songId });
    });

    it.skip('should return Status-Code 200 and correct body if song sucessfully updated', async () => {});

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {});

    it.skip('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {});

    it.skip('should return Status-Code 403 and correct body if invalid token provided', async () => {});

    it.skip('should return Status-Code 404 and correct body if no song found', async () => {});

    it.skip('should return Status-Code 403 and correct body if user does not have access to edit song', async () => {});

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `author` provided', async () => {});

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `title` provided', async () => {});

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `cover` provided', async () => {});

    describe('update cover image', () => {
      it.skip('should return Status-Code 200 and correct body if successfuly updated cover image', async () => {});

      it.skip('should return Status-Code 400 and correct body if invalid cover image provided', async () => {});
    });
  });

  describe.skip('delete', async () => {
    beforeEach(async () => {
      await createTestSongModel().save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: songId });
    });

    it.skip('should return Status-Code 204 and correct body if song sucessfully deleted', async () => {});

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {});

    it.skip('should return Status-Code 403 and correct body if invalid token provided', async () => {});

    it.skip('should return Status-Code 404 and correct body if no song found', async () => {});

    it.skip('should return Status-Code 403 and correct body if user does not have access to edit song', async () => {});
  });
});
