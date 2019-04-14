import PlaylistModel from './models/playlist';


export async function getPlaylist(playlistId) {
  const projection = {
    uuid: 1,
    songlist: 1,
    private: 1,
    _id: 0,
  };

  try {
    return await PlaylistModel.findOne({ uuid: playlistId }, projection);
  } catch (error) {
    throw new Error(error);
  }
}

export async function createPlaylist(playlistData) {
  try {
    const playlist = new PlaylistModel(playlistData);
    return await playlist.save();
  } catch (error) {
    throw new Error(error);
  }
}

export async function updatePlaylist(playlistId, data) {
  try {
    return await PlaylistModel.updateOne({ uuid: playlistId }, data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function deletePlaylist(playlistId) {
  try {
    return await PlaylistModel.deleteOne({ uuid: playlistId });
  } catch (error) {
    throw new Error(error);
  }
}
