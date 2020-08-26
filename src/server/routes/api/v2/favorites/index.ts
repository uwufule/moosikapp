import { RequestHandler, Response } from 'express';
import Joi from '@hapi/joi';
import { BadRequest, NotFound } from 'http-errors';
import { AuthRequest } from '../../../../middlewares/authorization';
import * as Songs from '../../../../mongodb/songs';

import roles from '../../../../config/roles.json';
import scopes from '../../../../config/scopes.json';

const queryParamsScheme = Joi.object({
  skip: Joi.number().min(0).error(new Error('Invalid query parameter `skip` provided.')),
  limit: Joi.number().min(1).max(100).error(new Error('Invalid query parameter `limit` provided.')),
  scope: Joi.number().positive().error(new Error('Invalid query parameter `scope` provided.')),
});

const canEdit = (scope?: number) => (userId: string, userRole: number, uploadedBy: string) =>
  scope && scope & scopes.edit ? uploadedBy === userId || userRole >= roles.moderator : undefined;

export const getFavoriteSongs = (): RequestHandler => async (req: AuthRequest, res: Response) => {
  const { error, value } = queryParamsScheme.validate(req.query);
  if (error) {
    throw new BadRequest(error.message);
  }
  const { scope, ...queryParams } = <
    {
      skip?: number;
      limit?: number;
      scope?: number;
    }
  >value;

  const songList = await Songs.getFavoriteSongs(req.auth.userId, queryParams);
  if (!songList.length) {
    throw new NotFound('No favorites found.');
  }

  const songs = songList.map(({ likes, uploadedBy, ...songData }) => ({
    ...songData,
    edit: canEdit(scope)(req.auth.userId, req.auth.userRole, uploadedBy),
  }));

  res.status(200).send({ message: 'Successfully retrieved favorites.', songs });
};

export const addSongToFavorite = (): RequestHandler => async (req: AuthRequest, res: Response) => {
  const song = await Songs.getSongById(req.params.songId);
  if (!song) {
    throw new NotFound('No song found.');
  }

  await Songs.updateSong(req.params.songId, {
    $addToSet: { likes: req.auth.userId },
  });

  res.status(204).send();
};

export const removeSongFromFavorite = (): RequestHandler => async (
  req: AuthRequest,
  res: Response,
) => {
  const song = await Songs.getSongById(req.params.songId);
  if (!song) {
    throw new NotFound('No song found.');
  }

  if (!song.likes.includes(req.auth.userId)) {
    throw new NotFound('No favorite found.');
  }

  await Songs.updateSong(req.params.songId, {
    $pull: { likes: req.auth.userId },
  });

  res.status(204).send();
};
