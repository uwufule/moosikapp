import request from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';

import app from '../src/index';
import UserModel from '../src/api/mongodb/models/user.model';

let token = '';

before(async () => {
  await UserModel.deleteOne({ username: 'testuser7' });

  const password = await bcrypt.hash('supersecretpassword', 12);
  await (new UserModel({
    username: 'testuser7',
    email: 'testuser7@domain.com',
    password,
  })).save();

  const res = await request(app)
    .post('/api/v2/login')
    .set('Accept', 'application/json')
    .send({
      username: 'testuser7',
      password: 'supersecretpassword',
    });

  token = res.body.token;
});

describe('favorites', () => {
  describe('retrieving list', () => {
    it('should return Status-Code 200 and correct body if song list sucessfully retrieved', (done) => {

    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it('should return Status-Code 400 and correct body if invalid query parameter `skip` provided', (done) => {

    });

    it('should return Status-Code 400 and correct body if invalid query parameter `limit` provided', (done) => {

    });

    it('should return Status-Code 400 and correct body if invalid query parameter `scope` provided', (done) => {

    });
  });

  describe('adding', () => {
    it('should return Status-Code 200 and correct body if song sucessfully added to favorites', (done) => {

    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it('should return Status-Code 404 and correct body if no song found', (done) => {

    });
  });

  describe('remove from favorites', () => {
    it('should return Status-Code 200 and correct body if song sucessfully added to favorites', (done) => {

    });

    it('should return Status-Code 405 and correct body if incorrect header `Accept` provided', (done) => {

    });

    it('should return Status-Code 403 and correct body if invalid token provided', (done) => {

    });

    it('should return Status-Code 404 and correct body if no song found', (done) => {

    });

    it('should return Status-Code 404 and correct body if song not in favorites', (done) => {

    });
  });
});
