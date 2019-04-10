
export function getPlaylist() {
  return (req, res) => {
    // database actions
    if (false) {
      res.status(404).send({ message: 'Playlist not found.' });
      return;
    }

    res.status(200).send({
      message: 'Successfully retrieved playlist.',
      owner: req.params.username,
      playlist: [],
    });
  };
}

export function updatePlaylist() {
  return (req, res) => {
    // database actions
    if (false) {
      res.status(404).send({ message: 'Playlist not found.' });
      return;
    }

    res.status(200).send({
      message: 'Successfully retrieved playlist.',
      playlistId: req.params.playlistId,
      playlist: [],
    });
  };
}

export function removePlaylist() {
  return (req, res) => {
    // database actions
    if (false) {
      res.status(404).send({ message: 'Song not found.' });
      return;
    }

    res.status(204).send();
  };
}
