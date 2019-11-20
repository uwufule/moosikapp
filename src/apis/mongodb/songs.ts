import SongModel from './models/song';

interface ISong {
  uuid: string;
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
  uploadedBy: string;
  likes: Array<string>;
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
    _id: 0,
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    uploadedBy: 1,
    likes: 1,
  };

  const songs = await SongModel.find({}, projection).skip(skip).limit(limit);
  return songs as Array<BasicSongInfo>;
}

export async function getSongByUuid(uuid: string): Promise<ExtendedSongInfo | null> {
  const projection = {
    _id: 0,
    uuid: 1,
    author: 1,
    title: 1,
    cover: 1,
    uploadedBy: 1,
    likes: 1,
    path: 1,
    createdAt: 1,
  };

  const song = await SongModel.findOne({ uuid }, projection);
  return song as ExtendedSongInfo;
}

export async function findSongs(
  query: string,
  skip = 0,
  limit = 100,
): Promise<Array<BasicSongInfo>> {
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
  return songs as Array<BasicSongInfo>;
}

export async function getFavoriteSongs(
  user: string,
  skip = 0,
  limit = 100,
): Promise<Array<BasicSongInfo>> {
  const query = {
    likes: user,
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
  return songs as Array<BasicSongInfo>;
}

export async function saveSong(data: ISong): Promise<boolean> {
  const song = new SongModel(data);
  await song.save();
  return true;
}

export async function updateSong(uuid: string, data: GenericParams): Promise<boolean> {
  await SongModel.updateOne({ uuid }, data);
  return true;
}

export async function deleteSong(uuid: string): Promise<boolean> {
  await SongModel.deleteOne({ uuid });
  return true;
}
