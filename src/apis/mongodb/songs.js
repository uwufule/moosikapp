import SongModel from './models/song';

export async function getSongs(skip = 0, limit = 100) {
  const projection = {
    _id: 0,
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    uploadedBy: 1,
    likes: 1,
  };

  const songs = await SongModel.find({}, projection).skip(skip).limit(limit);
  return songs;
}

export async function getSongByUuid(uuid) {
  const projection = {
    _id: 0,
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    likes: 1,
    path: 1,
    uploadedBy: 1,
    createdAt: 1,
  };

  const song = await SongModel.findOne({ uuid }, projection);
  return song;
}

export async function findSongs(queryString, skip = 0, limit = 100) {
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
    uploadedBy: 1,
    likes: 1,
  };

  const songs = await SongModel.find(query, projection).skip(skip).limit(limit);
  return songs;
}

export async function getFavoriteSongs(userUuid, skip = 0, limit = 100) {
  const query = {
    likes: userUuid,
  };

  const projection = {
    _id: 0,
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    uploadedBy: 1,
  };

  const songs = await SongModel.find(query, projection).skip(skip).limit(limit);
  return songs;
}

export async function saveSong(songData) {
  const song = new SongModel(songData);
  await song.save();
  return true;
}

export async function updateSong(uuid, data) {
  await SongModel.updateOne({ uuid }, data);
  return true;
}

export async function deleteSong(uuid) {
  await SongModel.deleteOne({ uuid });
  return true;
}
