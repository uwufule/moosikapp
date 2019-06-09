import PlaylistModel from './models/playlist';

export async function getPlaylist(playlistId) {
  const projection = {
    uuid: 1,
    songlist: 1,
    private: 1,
    _id: 0,
  };

  const playlist = await PlaylistModel.findOne({ uuid: playlistId }, projection);
  return playlist;
}

export async function createPlaylist(playlistData) {
  const playlist = new PlaylistModel(playlistData);
  await playlist.save();
  return true;
}

export async function updatePlaylist(playlistId, data) {
  await PlaylistModel.updateOne({ uuid: playlistId }, data);
  return true;
}

export async function deletePlaylist(playlistId) {
  await PlaylistModel.deleteOne({ uuid: playlistId });
  return true;
}
