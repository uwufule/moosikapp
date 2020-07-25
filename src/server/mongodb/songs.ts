import SongModel from './models/song.model';
import toJson from './utils/toJson';

interface GetSongsOptions {
  skip?: number;
  limit?: number;
}

export interface Song {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  likes: string[];
  uploadedBy: string;
}

export const getSongs = async ({ skip = 0, limit = 100 }: GetSongsOptions) => {
  const projection = {
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    likes: 1,
    uploadedBy: 1,
  };

  const songs = await SongModel.find({}, projection).skip(skip).limit(limit);
  return songs.map<Song>((song) => song.toJSON());
};

export const findSongs = async (
  queryString: string,
  { skip = 0, limit = 100 }: GetSongsOptions,
) => {
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
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    likes: 1,
    uploadedBy: 1,
  };

  const songs = await SongModel.find(query, projection).skip(skip).limit(limit);
  return songs.map<Song>((song) => song.toJSON());
};

export const getFavoriteSongs = async (
  userId: string,
  { skip = 0, limit = 100 }: GetSongsOptions,
) => {
  const query = {
    likes: userId,
  };

  const projection = {
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    likes: 1,
    uploadedBy: 1,
  };

  const songs = await SongModel.find(query, projection).skip(skip).limit(limit);
  return songs.map<Song>((song) => song.toJSON());
};

export interface SongDetails extends Song {
  path: string;
  createdAt: Date;
}

export const getSongById = async (uuid: string) => {
  const projection = {
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    likes: 1,
    uploadedBy: 1,
    path: 1,
    createdAt: 1,
  };

  const song = await SongModel.findOne({ _id: uuid }, projection);
  return toJson<SongDetails>(song);
};

interface InitialSongData {
  author?: string;
  title?: string;
  cover?: string;
  uploadedBy: string;
  path: string;
  likes?: string[];
}

export const saveSong = async (data: InitialSongData) => {
  const { _id: uuid } = await new SongModel(data).save();
  return <string>uuid;
};

interface UpdatedSongData {
  [key: string]: any;
}

export const updateSong = async (uuid: string, data: UpdatedSongData) => {
  const res = await SongModel.updateOne({ _id: uuid }, data);
  return !!res.n;
};

export const deleteSong = async (uuid: string) => {
  const res = await SongModel.deleteOne({ _id: uuid });
  return !!res.n;
};
