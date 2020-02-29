import request from 'supertest';
import { expect } from 'chai';
import FS from 'fs';
import { promisify } from 'util';
import JWT from 'jsonwebtoken';

import app from '../src/server';
import UserModel from '../src/server/mongodb/models/user.model';
import SongModel from '../src/server/mongodb/models/song.model';

const readFile = promisify(FS.readFile);

const { JWT_SECRET } = process.env;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

let token: string;

let song: Buffer;

describe('songs', () => {
  beforeEach(async () => {
    await UserModel.deleteOne({ _id: 'testuser7-uuid' });

    await (new UserModel({
      _id: 'testuser7-uuid',
      username: 'testuser7',
      email: 'testuser7@domain.tld',
      password: 'supersecretpassword',
    })).save();

    await SongModel.deleteMany({});

    token = JWT.sign({ uuid: 'testuser7-uuid', role: 1 }, String(JWT_SECRET));

    song = await readFile('test/dataset/song.mp3');
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: 'testuser7-uuid' });
  });

  describe('upload', () => {
    it('should return Status-Code 201 and correct body if song successfully uploaded', async () => {
      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth(token, { type: 'bearer' })
        .send(song);

      expect(res.status).to.eq(201);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('You have successfully uploaded a new song.');
      expect(res.body.uuid).to.match(UUID_REGEX);
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app)
        .post('/api/v2/songs')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {
      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' })
        .send('not-a-buffer');

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
        .send(song);

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Not authorized.');
    });

    it('should return Status-Code 413 and correct body if song too large', async () => {
      const tooLargeEntity = Buffer.concat([song, Buffer.alloc(11534336)]);

      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth(token, { type: 'bearer' })
        .send(tooLargeEntity);

      expect(res.status).to.eq(413);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Request entity too large.');
    });

    it('should return Status-Code 409 and correct body if song already exists', async () => {
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
      await (new SongModel({
        _id: 'testsong2-uuid',
        uploadedBy: 'testuser7-uuid',
        path: `/path/to/file-${Math.round(Math.random() * 1000)}`,
        likes: ['testuser7-uuid'],
      })).save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: 'testsong2-uuid' });
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
      const res = await request(app)
        .get('/api/v2/songs')
        .auth(token, { type: 'bearer' });

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
      expect(res.body.message).to.eq('Not authorized.');
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
      await (new SongModel({
        _id: 'testsong3-uuid',
        uploadedBy: 'testuser7-uuid',
        path: `/path/to/file-${Math.round(Math.random() * 1000)}`,
        likes: ['testuser7-uuid'],
      })).save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: 'testsong3-uuid' });
    });

    it('should return Status-Code 200 and correct body if song sucessfully retrieved', async () => {
      const res = await request(app)
        .get('/api/v2/songs/testsong3-uuid')
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
      const res = await request(app)
        .get('/api/v2/songs')
        .auth(token, { type: 'bearer' });

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
      expect(res.body.message).to.eq('Not authorized.');
    });

    it('should return Status-Code 404 and correct body if no song found', async () => {
      const res = await request(app)
        .get('/api/v2/songs/nonexistent-song-uuid')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(404);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('No song found.');
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      await (new SongModel({
        _id: 'testsong4-uuid',
        author: 'Author',
        title: 'Title',
        uploadedBy: 'testuser7-uuid',
        path: `/path/to/file-${Math.round(Math.random() * 1000)}`,
        likes: ['testuser7-uuid'],
      })).save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: 'testsong4-uuid' });
    });

    it('should return Status-Code 200 and correct body if song list sucessfully retrieved', async () => {
      const res = await request(app)
        .get('/api/v2/songs/find')
        .query({ query: 'Title' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(200);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Successfully retrieved songs.');
      expect(res.body.songs).to.be.a('array');
    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/find')
        .query({ query: 'Title' })
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(405);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Incorrect `Accept` header provided.');
    });

    it('should return Status-Code 403 and correct body if invalid token provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/find')
        .set('Accept', 'application/json')
        .auth('invalid-access-token', { type: 'bearer' });

      expect(res.status).to.eq(403);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Not authorized.');
    });

    it('should return Status-Code 404 and correct body if no song found', async () => {
      const res = await request(app)
        .get('/api/v2/songs/find')
        .query({ query: 'Nonexistent' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(404);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('No songs found.');
    });

    it('should return Status-Code 400 and correct body if invalid no query parameter `query` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/find')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `query` provided.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/find')
        .query({ query: 'Title' })
        .query({ skip: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `skip` provided.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/find')
        .query({ query: 'Title' })
        .query({ limit: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `limit` provided.');
    });

    it('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', async () => {
      const res = await request(app)
        .get('/api/v2/songs/find')
        .query({ query: 'Title' })
        .query({ scope: 'NaN' })
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      expect(res.status).to.eq(400);
      expect(res.header['content-type']).to.match(/application\/json/);
      expect(res.body.message).to.eq('Invalid query parameter `scope` provided.');
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await (new SongModel({
        _id: 'testsong5-uuid',
        uploadedBy: 'testuser7-uuid',
        path: `/path/to/file-${Math.round(Math.random() * 1000)}`,
        likes: ['testuser7-uuid'],
      })).save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: 'testsong5-uuid' });
    });

    it.skip('should return Status-Code 200 and correct body if song sucessfully updated', async () => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', async () => {

    });

    it.skip('should return Status-Code 404 and correct body if no song found', async () => {

    });

    it.skip('should return Status-Code 403 and correct body if user does not have access to edit song', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `author` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `title` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `cover` provided (from formdata)', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `cover` provided (from json)', async () => {

    });
  });

  describe('delete', async () => {
    beforeEach(async () => {
      await (new SongModel({
        _id: 'testsong6-uuid',
        uploadedBy: 'testuser7-uuid',
        path: `/path/to/file-${Math.round(Math.random() * 1000)}`,
        likes: ['testuser7-uuid'],
      })).save();
    });

    afterEach(async () => {
      await SongModel.deleteOne({ _id: 'testsong6-uuid' });
    });

    it.skip('should return Status-Code 204 and correct body if song sucessfully deleted', async () => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', async () => {

    });

    it.skip('should return Status-Code 404 and correct body if no song found', async () => {

    });

    it.skip('should return Status-Code 403 and correct body if user does not have access to edit song', async () => {

    });
  });
});
