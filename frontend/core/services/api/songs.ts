import { CancelToken } from 'axios';
import { createAxiosInstance, isSuccessStatus } from '../../helpers/axiosHelper';
import DetailedSongData from '../../interfaces/DetailedSongData';
import SongData from '../../interfaces/SongData';
import ApiResponse from './interfaces/ApiResponse';
import { OnUploadProgress } from './interfaces/UploadProgress';

export interface GetSongsRequestParams {
  skip?: number;
  limit?: number;
  scope?: number;
}

type SongList = SongData[];

export const getSongs = async (accessToken: string, params: GetSongsRequestParams) => {
  const res = await createAxiosInstance(accessToken).get<ApiResponse<SongList>>('/songs', {
    params,
  });

  return res.data.result;
};

export const getUserFavoriteSongs = async (accessToken: string, params: GetSongsRequestParams) => {
  const res = await createAxiosInstance(accessToken).get<ApiResponse<SongList>>('/favorites', {
    params,
  });

  return res.data.result;
};

export interface SearchSongsRequestParams extends GetSongsRequestParams {
  query: string;
}

export const searchSongs = async (accessToken: string, params: SearchSongsRequestParams) => {
  const res = await createAxiosInstance(accessToken).get<ApiResponse<SongList>>('/songs/search', {
    params,
  });

  return res.data.result;
};

export const getSongById = async (accessToken: string, songId: string) => {
  const res = await createAxiosInstance(accessToken).get<ApiResponse<DetailedSongData>>(
    `/songs/${songId}`,
  );

  return res.data.result;
};

export interface UploadSongResult {
  id: string;
}

export const uploadSong = async (
  accessToken: string,
  file: File,
  onUploadProgress?: OnUploadProgress,
  cancelToken?: CancelToken,
) => {
  const res = await createAxiosInstance(accessToken).post<ApiResponse<UploadSongResult>>(
    '/songs',
    file,
    {
      headers: {
        'content-type': file.type,
      },
      onUploadProgress,
      cancelToken,
    },
  );

  return res.data.result;
};

export interface UpdatedSongData {
  author?: string;
  title?: string;
  cover?: string;
}

interface UpdateSongResult extends UpdatedSongData {}

export const updateSong = async (
  accessToken: string,
  songId: string,
  songData: UpdatedSongData,
) => {
  const res = await createAxiosInstance(accessToken).put<ApiResponse<UpdateSongResult>>(
    `/songs/${songId}`,
    songData,
  );

  return res.data.result;
};

export interface UpdateCoverResult {
  cover: string;
}

export const updateSongCover = async (accessToken: string, songId: string, file: File) => {
  const res = await createAxiosInstance(accessToken).put<ApiResponse<UpdateCoverResult>>(
    `/songs/${songId}/cover`,
    file,
    {
      headers: {
        'content-type': file.type,
      },
    },
  );

  return res.data.result;
};

export const deleteSong = async (accessToken: string, songId: string): Promise<boolean> => {
  const res = await createAxiosInstance(accessToken).delete(`/songs/${songId}`);
  return isSuccessStatus(res.status);
};

export const addToFavortes = async (accessToken: string, songId: string): Promise<boolean> => {
  const res = await createAxiosInstance(accessToken).put('/favorites', { songId });
  return isSuccessStatus(res.status);
};

export const deleteFromFavorites = async (accessToken: string, songId: string) => {
  const res = await createAxiosInstance(accessToken).delete(`/favorites/${songId}`);
  return isSuccessStatus(res.status);
};
