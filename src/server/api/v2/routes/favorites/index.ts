import { RequestHandler, Response } from 'express';
import { BadRequest, NotFound } from 'http-errors';
import { AuthRequest } from '../../middlewares/authorization';
import * as Songs from '../../../../database/mongo/songs';
import queryParamsScheme, { QueryParams } from '../../utils/validators/queryParamsScheme';
import canEdit from '../../utils/canEdit';

export const getFavoriteSongs = (): RequestHandler => async (req: AuthRequest, res: Response) => {
  const { error, value } = queryParamsScheme.validate(req.query);
  if (error) {
    throw new BadRequest(error.message);
  }
  const { scope, ...queryParams } = <QueryParams>value;

  const foundedSongs = await Songs.getFavoriteSongs(req.auth.userId, queryParams);
  if (!foundedSongs.length) {
    throw new NotFound('No favorites found.');
  }

  const songs = foundedSongs.map(({ likes, uploadedBy, ...songData }) => ({
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
