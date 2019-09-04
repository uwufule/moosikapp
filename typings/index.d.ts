import { Request } from 'express';
import { Document } from 'mongoose';

export interface JWTRecord {
  uuid: string,
  role: number,
  timestamp: Date,
}

export interface AuthorizedRequest extends Request {
  jwt: JWTRecord,
}

export interface HTTPException extends Error {
  type: string;
}

export interface Song {
  uuid: string;
  author: string;
  title: string;
  uploadedBy: string;
  cover: string;
  favorite: boolean | undefined;
  edit: boolean | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  uuid: string;
  username: string;
  email: string;
  password: {
    hash: string,
    timestamp: Date;
  };
  role: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISong extends Document {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  uploadedBy: string;
  path: string;
  likes: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}