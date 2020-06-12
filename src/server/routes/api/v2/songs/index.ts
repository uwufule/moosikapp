import { Response, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import { BadRequest, Forbidden, NotFound } from 'http-errors';
import { AuthRequest } from '../../../../middlewares/authorization';
import upload from './upload';
import update from './update';
import updateCover from './updateCover';
import { AccessToken } from '../../../../utils/tokens';
import * as Songs from '../../../../mongodb/songs';
import * as Users from '../../../../mongodb/users';

import roles from '../../../../config/roles.json';
import scopes from '../../../../config/scopes.json';

const { CDN_SERVER = '' } = process.env;

const queryParamsScheme = Joi.object({
  skip: Joi.number()
    .min(0)
    .error(new Error('Invalid query parameter `skip` provided.')),
  limit: Joi.number()
    .min(1)
    .max(100)
    .error(new Error('Invalid query parameter `limit` provided.')),
  scope: Joi.number()
    .positive()
    .error(new Error('Invalid query parameter `scope` provided.')),
});

const queryParamsWithQueryString = queryParamsScheme.append({
  query: Joi.string()
    .required()
    .min(2)
    .error(new Error('Invalid query parameter `query` provided.')),
});

const isFav = (scope?: number) => (
  (auth: AccessToken, likes: string[]) => (
    (scope && scope & scopes.favorite)
      ? likes.includes(auth.uuid)
      : undefined
  )
);

const canEdit = (scope?: number) => (
  (auth: AccessToken, uploadedBy: string) => (
    (scope && scope & scopes.edit)
      ? (uploadedBy === auth.uuid) || (auth.role >= roles.moderator)
      : undefined
  )
);

export const getSongs = (): RequestHandler => (
  async (req: AuthRequest, res: Response) => {
    const { error, value } = queryParamsScheme.validate(req.query);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { scope, ...queryParams } = <{
      skip?: number, limit?: number, scope?: number,
    }>value;

    const songList = await Songs.getSongs(queryParams);
    if (!songList.length) {
      throw new NotFound('No songs found.');
    }

    const songs = songList.map(({
      likes, uploadedBy, ...songData
    }) => ({
      ...songData,
      favorite: isFav(scope)(req.auth, likes),
      edit: canEdit(scope)(req.auth, uploadedBy),
    }));

    res.status(200).send({ message: 'Successfully retrieved songs.', songs });
  }
);

export const getById = (): RequestHandler => (
  async (req: AuthRequest, res: Response) => {
    const song = await Songs.getSongById(req.params.songId);
    if (!song) {
      throw new NotFound('No song found.');
    }

    const {
      path, uploadedBy, likes, ...songData
    } = song;

    const username = await Users.getUsername(uploadedBy);

    res.status(200).send({
      message: 'Successfully retrieved song.',
      song: {
        ...songData,
        url: `${CDN_SERVER}${path}`,
        uploadedBy: username || 'Deactivated User',
        favorite: isFav(scopes.favorite)(req.auth, likes),
        edit: canEdit(scopes.edit)(req.auth, uploadedBy),
      },
    });
  }
);

export const findSongs = (): RequestHandler => (
  async (req: AuthRequest, res: Response) => {
    const { error, value } = queryParamsWithQueryString.validate(req.query);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { query, scope, ...queryParams } = <{
      query: string, skip?: number, limit?: number, scope?: number,
    }>value;

    const songList = await Songs.findSongs(decodeURI(query), queryParams);
    if (!songList.length) {
      throw new NotFound('No songs found.');
    }

    const songs = songList.map(({
      likes, uploadedBy, ...songData
    }) => ({
      ...songData,
      favorite: isFav(scope)(req.auth, likes),
      edit: canEdit(scope)(req.auth, uploadedBy),
    }));

    res.status(200).send({ message: 'Successfully retrieved songs.', songs });
  }
);

export const uploadSong = (): RequestHandler => upload;

export const updateSong = (): RequestHandler => update;

export const updateSongCover = (): RequestHandler => updateCover;

export const deleteSong = (): RequestHandler => (
  async (req: AuthRequest, res: Response) => {
    const song = await Songs.getSongById(req.params.songId);
    if (!song) {
      throw new NotFound('No song found.');
    }

    if ((song.uploadedBy !== req.auth.uuid) && (req.auth.role < roles.moderator)) {
      throw new Forbidden('Access denied.');
    }

    await Songs.deleteSong(req.params.songId);

    res.status(204).send();
  }
);
