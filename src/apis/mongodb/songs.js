import SongModel from './models/song';

export async function getSongs(skip = 0, limit = 100) {
  const projection = {
    _id: 0,
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
  };

  const songs = await SongModel.find({}, projection).skip(skip).limit(limit);
  return songs;
}

export async function getSongByUuid(uuid) {
  const projection = {
    _id: 0,
    author: 1,
    title: 1,
    cover: 1,
    url: 1,
    uploadedBy: 1,
    createdAt: 1,
  };

  const song = await SongModel.findOne({ uuid }, projection);
  return song;
}

export async function findSongs(queryString) {
  const query = {
    $or: [
      {
        author: {
          $regex: queryString,
          $options: 'i',
        },
      },
      {
        title: {
          $regex: queryString,
          $options: 'i',
        },
      },
    ],
  };

  const projection = {
    _id: 0,
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
  };

  const foundSongs = await SongModel.find(query, projection);
  return foundSongs;
}

export async function getFavoriteSongs(userUuid) {
  const query = {
    likes: userUuid,
  };

  const projection = {
    _id: 0,
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
  };

  const likedSongs = await SongModel.find(query, projection);
  return likedSongs;
}

export async function saveSong(songData) {
  const song = new SongModel(songData);
  await song.save();
  return true;
}

export async function updateSong(songId, data) {
  await SongModel.updateOne({ uuid: songId }, data);
  return true;
}

export async function deleteSong(songId) {
  await SongModel.deleteOne({ uuid: songId });
  return true;
}
