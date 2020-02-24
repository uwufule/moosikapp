import request from 'supertest';
import { expect } from 'chai';
import FS from 'fs';
import { promisify } from 'util';

import app from '../src/app';

const readFile = promisify(FS.readFile);

describe.skip('songs', () => {
  beforeEach(async () => {
  });

  afterEach(async () => {
  });

  describe('upload', () => {
    it.skip('should return Status-Code 201 and correct body if song successfully uploaded', async () => {
      const song = await readFile('test/dataset/song.mp3');

      const res = await request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth('TOKEN', { type: 'bearer' })
        .send(song);

      // .expect(201)
      // .expect('Content-Type', /application\/json/)
      // .end((req, res) => {
      //   expect(res.body.message).to.eq('You have successfully uploaded a new song.');
      //   expect(res.body.uuid).to.be.a('string');
      // });
    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', async () => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', async () => {

    });

    it.skip('should return Status-Code 413 and correct body if song too large', async () => {

    });

    it.skip('should return Status-Code 409 and correct body if song already exists', async () => {

    });
  });

  describe('get list', () => {
    it.skip('should return Status-Code 200 and correct body if song list sucessfully retrieved', async () => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', async () => {

    });
  });

  describe('get by uuid', () => {
    it.skip('should return Status-Code 200 and correct body if song sucessfully retrieved', async () => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', async () => {

    });

    it.skip('should return Status-Code 404 and correct body if no song found', async () => {

    });
  });

  describe('find', () => {
    it.skip('should return Status-Code 200 and correct body if song list sucessfully retrieved', async () => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', async () => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', async () => {

    });

    it.skip('should return Status-Code 404 and correct body if no song found', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid no query parameter `query` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', async () => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', async () => {

    });
  });

  describe('update', () => {
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
