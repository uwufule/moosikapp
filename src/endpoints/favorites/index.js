import {
  getFavoriteSongs as getFavoriteSongsFromDB,
  updateSong as updateSongInDB,
} from '../../apis/mongodb/songs';

export function getFavoriteSongs() {
  return async (req, res) => {
    const { skip, limit, opts = '' } = req.query;

    const s = Number(skip);
    const l = Number(limit);

    if (s < 0) {
      res.status(400).send({ message: 'Invalid query parameter `skip` provided.' });
      return;
    }

    if (l < 1 || l > 100) {
      res.status(400).send({ message: 'Invalid query parameter `limit` provided.' });
      return;
    }

    const userUuid = req.jwt.uuid;

    try {
      const result = await getFavoriteSongsFromDB(userUuid, s, l);

      if (!result.length) {
        res.status(404).send({ message: 'No favorite songs found.' });
        return;
      }

      const songs = [];

      result.forEach((song) => {
        const {
          uuid, author, title, cover, uploadedBy,
        } = song.toJSON();

        songs.push({
          uuid,
          author,
          title,
          cover,
          editable: opts.includes('edit') ? uploadedBy === userUuid : undefined,
        });
      });

      res.status(200).send({ message: 'Successfully retrieved favorite songs.', songs });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function addSongToFavorite() {
  return async (req, res) => {
    try {
      const { songId } = req.params;

      const { uuid } = req.jwt;

      // check song exists

      await updateSongInDB(songId, { $addToSet: { likes: uuid } });

      res.status(200).send({ message: 'Successfully added song to favorites.' });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}

export function removeSongFromFavorite() {
  return async (req, res) => {
    try {
      const { songId } = req.params;

      const { uuid } = req.jwt;

      // check song in favorites. check song exists

      await updateSongInDB(songId, { $pull: { likes: uuid } });

      res.status(204).send();
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
