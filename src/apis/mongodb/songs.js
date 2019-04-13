import SongModel from './models/song';


export async function getSongs(skip = 0, limit = 100) {
  const projection = {
    uuid: 1, author: 1, title: 1, _id: 0,
  };

  try {
    return await SongModel.find({ }, projection).skip(skip).limit(limit);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getSongByUuid(uuid) {
  const projection = {
    author: 1,
    title: 1,
    uploadedBy: 1,
    url: 1,
    coverUrl: 1,
    hash: 1,
    createdAt: 1,
    _id: 0,
  };

  try {
    return await SongModel.findOne({ uuid }, projection);
  } catch (error) {
    throw new Error(error);
  }
}

export async function findSong(queryString) {
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
    uuid: 1, author: 1, title: 1, _id: 0,
  };

  try {
    return await SongModel.find(query, projection);
  } catch (error) {
    throw new Error(error);
  }
}

export async function saveSong(songData) {
  try {
    const song = new SongModel(songData);
    return await song.save();
  } catch (error) {
    throw new Error(error);
  }
}
