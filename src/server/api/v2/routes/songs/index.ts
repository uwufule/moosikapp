import { Response, RequestHandler } from 'express';
import { BadRequest, Forbidden, NotFound } from 'http-errors';
import { AuthRequest } from '../../../../middlewares/authorization';
import upload from './upload';
import update from './update';
import updateCover from './updateCover';
import * as Songs from '../../../../database/mongo/songs';
import * as Users from '../../../../database/mongo/users';
import queryParamsScheme, { QueryParams } from '../../utils/validators/queryParamsScheme';
import queryParamsSchemeWithQS, {
  QueryParamsWithQS,
} from '../../utils/validators/queryParamsSchemeWithQS';
import isFav from '../../utils/isFav';
import canEdit from '../../utils/canEdit';
import roles from '../../../../config/roles.json';
import scopes from '../../../../config/scopes.json';

const CDN_SERVER = String(process.env.CDN_SERVER);

export const getSongs = (): RequestHandler => async (req: AuthRequest, res: Response) => {
  const { error, value } = queryParamsScheme.validate(req.query);
  if (error) {
    throw new BadRequest(error.message);
  }
  const { scope, ...queryParams } = <QueryParams>value;

  const foundedSongs = await Songs.getSongs(queryParams);
  if (!foundedSongs.length) {
    throw new NotFound('No songs found.');
  }

  const songs = foundedSongs.map(({ likes, uploadedBy, ...songData }) => ({
    ...songData,
    favorite: isFav(scope)(req.auth.userId, likes),
    edit: canEdit(scope)(req.auth.userId, req.auth.userRole, uploadedBy),
  }));

  res.status(200).send({ message: 'Successfully retrieved songs.', songs });
};

export const getSongById = (): RequestHandler => async (req: AuthRequest, res: Response) => {
  const song = await Songs.getSongById(req.params.songId);
  if (!song) {
    throw new NotFound('No song found.');
  }

  const { path, uploadedBy, likes, ...songData } = song;

  const username = (await Users.getUsername(uploadedBy)) ?? 'Deleted User';

  res.status(200).send({
    message: 'Successfully retrieved song.',
    song: {
      ...songData,
      url: `${CDN_SERVER}${path}`,
      uploadedBy: username,
      favorite: isFav(scopes.favorite)(req.auth.userId, likes),
      edit: canEdit(scopes.edit)(req.auth.userId, req.auth.userRole, uploadedBy),
    },
  });
};

export const findSongs = (): RequestHandler => async (req: AuthRequest, res: Response) => {
  const { error, value } = queryParamsSchemeWithQS.validate(req.query);
  if (error) {
    throw new BadRequest(error.message);
  }
  const { query, scope, ...queryParams } = <QueryParamsWithQS>value;

  const foundedSongs = await Songs.findSongs(decodeURI(query), queryParams);
  if (!foundedSongs.length) {
    throw new NotFound('No songs found.');
  }

  const songs = foundedSongs.map(({ likes, uploadedBy, ...songData }) => ({
    ...songData,
    favorite: isFav(scope)(req.auth.userId, likes),
    edit: canEdit(scope)(req.auth.userId, req.auth.userRole, uploadedBy),
  }));

  res.status(200).send({ message: 'Successfully retrieved songs.', songs });
};

export const uploadSong = (): RequestHandler => upload;

export const updateSong = (): RequestHandler => update;

export const updateSongCover = (): RequestHandler => updateCover;

export const deleteSong = (): RequestHandler => async (req: AuthRequest, res: Response) => {
  const song = await Songs.getSongById(req.params.songId);
  if (!song) {
    throw new NotFound('No song found.');
  }

  if (song.uploadedBy !== req.auth.userId && req.auth.userRole < roles.moderator) {
    throw new Forbidden('Access denied.');
  }

  await Songs.deleteSong(req.params.songId);

  res.status(204).send();
};
