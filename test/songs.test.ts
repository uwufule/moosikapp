import request from 'supertest';
import { expect } from 'chai';
import FS from 'fs';

import app from '../src/index';

beforeEach(async () => {
});

describe('songs', () => {
  describe('uploading', () => {
    it.skip('should return Status-Code 201 and correct body if song successfully uploaded', (done) => {
      FS.readFile('./test/dataset/song.mp3', (err, song) => {
        if (err) {
          done(err);
          return;
        }

        request(app)
          .post('/api/v2/songs')
          .set('Accept', 'application/json')
          .set('Content-Type', 'audio/mpeg')
          .auth('TOKEN', { type: 'bearer' })
          .send(song)
          .expect(201)
          .expect('Content-Type', /application\/json/)
          .end((req, res) => {
            expect(res.body.message).to.eq('You have successfully uploaded a new song.');
            expect(res.body.uuid).to.be.a('string');

            done();
          });
      });
    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', (done) => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it.skip('should return Status-Code 413 and correct body if song too large', (done) => {

    });

    it.skip('should return Status-Code 409 and correct body if song already exists', (done) => {

    });
  });

  describe('retrieving list', () => {
    it.skip('should return Status-Code 200 and correct body if song list sucessfully retrieved', (done) => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', (done) => {

    });
  });

  describe('retrieving by uuid', () => {
    it.skip('should return Status-Code 200 and correct body if song sucessfully retrieved', (done) => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it.skip('should return Status-Code 404 and correct body if no song found', (done) => {

    });
  });

  describe('find songs', () => {
    it.skip('should return Status-Code 200 and correct body if song list sucessfully retrieved', (done) => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it.skip('should return Status-Code 404 and correct body if no song found', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid no query parameter `query` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', (done) => {

    });
  });

  describe('updating song', () => {
    it.skip('should return Status-Code 200 and correct body if song sucessfully updated', (done) => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if incorrect header `Content-Type` provided', (done) => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it.skip('should return Status-Code 404 and correct body if no song found', (done) => {

    });

    it.skip('should return Status-Code 403 and correct body if user does not have access to edit song', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `author` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `title` provided', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `cover` provided (from formdata)', (done) => {

    });

    it.skip('should return Status-Code 400 and correct body if invalid body parameter `cover` provided (from json)', (done) => {

    });
  });

  describe('deleting song', () => {
    it.skip('should return Status-Code 204 and correct body if song sucessfully deleted', (done) => {

    });

    it.skip('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it.skip('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it.skip('should return Status-Code 404 and correct body if no song found', (done) => {

    });

    it.skip('should return Status-Code 403 and correct body if user does not have access to edit song', (done) => {

    });
  });
});
