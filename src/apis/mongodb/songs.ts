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

export async function getSongByUuid(uuid: string) {
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

export async function findSongs(query: string, skip = 0, limit = 100) {
  const q = {
    $or: [
      {
        author: {
          $regex: query,
          $options: 'i',
        },
      },
      {
        title: {
          $regex: query,
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

  const songs = await SongModel.find(q, projection).skip(skip).limit(limit);
  return songs;
}

export async function getFavoriteSongs(userUuid: string, skip = 0, limit = 100) {
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

export async function saveSong(data: any) {
  const song = new SongModel(data);
  await song.save();
  return true;
}

export async function updateSong(uuid: string, data: any) {
  await SongModel.updateOne({ uuid }, data);
  return true;
}

export async function deleteSong(uuid: string) {
  await SongModel.deleteOne({ uuid });
  return true;
}
