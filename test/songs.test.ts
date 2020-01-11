import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';
import FS from 'fs';

import app from '../src/index';
import UserModel from '../src/api/mongodb/models/user.model';

let token = '';

before(async () => {
  await UserModel.deleteOne({ username: 'testuser6' });

  const password = await bcrypt.hash('supersecretpassword', 12);
  await (new UserModel({
    username: 'testuser6',
    email: 'testuser6@domain.com',
    password,
  })).save();

  const res = await request(app)
    .post('/api/v2/login')
    .set('Accept', 'application/json')
    .send({
      username: 'testuser6',
      password: 'supersecretpassword',
    });

  token = res.body.token;
});

describe('songs', () => {
  it('should return Status-Code 201 and correct body if song successfully uploaded', (done) => {
    FS.readFile('./test/dataset/song.mp3', (err, song) => {
      if (err) {
        done(err);
        return;
      }

      request(app)
        .post('/api/v2/songs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'audio/mpeg')
        .auth(token, { type: 'bearer' })
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
});
