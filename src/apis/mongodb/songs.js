import SongModel from './models/song';

export async function getSongs(skip = 0, limit = 100) {
  const projection = {
    uuid: 1, author: 1, title: 1, cover: 1, _id: 0,
  };

  const songs = await SongModel.find({ }, projection).skip(skip).limit(limit);
  return songs;
}

export async function getSongByUuid(uuid) {
  const projection = {
    author: 1,
    title: 1,
    uploadedBy: 1,
    cover: 1,
    hash: 1,
    type: 1,
    url: 1,
    createdAt: 1,
    _id: 0,
  };

  const song = await SongModel.findOne({ uuid }, projection);
  return song;
}

export async function findSongs(queryString) {
  const query = {
    $or: [
      {
        author: {
          $regex: queryString, $options: 'i',
        },
      },
      {
        title: {
          $regex: queryString, $options: 'i',
        },
      },
    ],
  };

  const projection = {
    uuid: 1, author: 1, title: 1, cover: 1, _id: 0,
  };

  const foundSongs = await SongModel.find(query, projection);
  return foundSongs;
}

export async function saveSong(songData) {
  const song = new SongModel(songData);
  await song.save();
  return true;
}
