import SongModel from './models/song.model';

interface ISong {
  author?: string;
  title?: string;
  cover?: string;
  uploadedBy: string;
  path: string;
  likes?: Array<string>;
}

export interface BasicSongInfo {
  uuid: string;
  author: string;
  title: string;
  cover: string;
  likes: Array<string>;
  uploadedBy: string;
}

export interface ExtendedSongInfo extends BasicSongInfo {
  path: string;
  createdAt: Date;
}

export interface GenericParams {
  [key: string]: any;
}

export async function getSongs(skip = 0, limit = 100): Promise<Array<BasicSongInfo>> {
  const projection = {
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    likes: 1,
    uploadedBy: 1,
  };

  const songs = await SongModel.find({}, projection).skip(skip).limit(limit);
  return songs.map((song) => song.toJSON());
}

export async function getByUuid(uuid: string): Promise<ExtendedSongInfo | null> {
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
  return song && song.toJSON();
}

export async function findSongs(
  queryString: string,
  skip = 0,
  limit = 100,
): Promise<Array<BasicSongInfo>> {
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
  return songs.map((song) => song.toJSON());
}

export async function getFavoriteSongs(
  userId: string,
  skip = 0,
  limit = 100,
): Promise<Array<BasicSongInfo>> {
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
  return songs.map((song) => song.toJSON());
}

export async function saveSong(data: ISong): Promise<string> {
  const { _id } = await (new SongModel(data)).save();
  return _id;
}

export async function updateSong(uuid: string, data: GenericParams): Promise<boolean> {
  const res = await SongModel.updateOne({ _id: uuid }, data);
  return res.n === 1;
}

export async function deleteSong(uuid: string): Promise<boolean> {
  const res = await SongModel.deleteOne({ _id: uuid });
  return res.n === 1;
}
