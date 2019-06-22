import {
  getFavoriteSongs as getFavoriteSongsFromDB,
  updateSong as updateSongInDB,
} from '../../apis/mongodb/songs';

export function getFavoriteSongs() {
  return async (req, res) => {
    try {
      const { uuid } = req.jwt;

      const songs = await getFavoriteSongsFromDB(uuid);

      if (!songs.length) {
        res.status(404).send({ message: 'No favorite songs found.' });
        return;
      }

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

      res.status(200).send({ message: 'Successfully added song to favorites.', uuid: songId });
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

      res.status(200).send({ message: 'Successfully removed song from favorites.', uuid: songId });
    } catch (e) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };
}
