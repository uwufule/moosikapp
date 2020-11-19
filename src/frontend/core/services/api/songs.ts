import createAxiosInstance from '@core/infrastructure/transport/createAxiosInstance';
import Song from '@core/models/Song';
import SongDetails from '@core/models/SongDetails';
import { CancelToken } from 'axios';
import ApiResponse from './interfaces/ApiResponse';
import GetSongsRequestOptions from './interfaces/GetSongsRequestOptions';
import OnUploadProgress from './interfaces/OnUploadProgress';
import SearchSongsRequestOptions from './interfaces/SearchSongsRequestOptions';
import SongUpdateData from './interfaces/SongUpdateData';
import UpdateCoverResult from './interfaces/UpdateCoverResult';
import UploadSongResult from './interfaces/UploadSongResult';

export const getSongs = async (
  accessToken: string,
  options: GetSongsRequestOptions,
): Promise<Song[]> => {
  const res = await createAxiosInstance({ Bearer: accessToken }).get<ApiResponse<Song[]>>(
    '/songs',
    {
      params: options,
    },
  );

  return res.data.result;
};

export const getFavoriteSongs = async (
  accessToken: string,
  options: GetSongsRequestOptions,
): Promise<Song[]> => {
  const res = await createAxiosInstance({ Bearer: accessToken }).get<ApiResponse<Song[]>>(
    '/favorites',
    {
      params: options,
    },
  );

  return res.data.result;
};

export const searchSongs = async (
  accessToken: string,
  options: SearchSongsRequestOptions,
): Promise<Song[]> => {
  const res = await createAxiosInstance({ Bearer: accessToken }).get<ApiResponse<Song[]>>(
    '/songs/search',
    {
      params: options,
    },
  );

  return res.data.result;
};

export const getSongById = async (accessToken: string, songId: string): Promise<SongDetails> => {
  const res = await createAxiosInstance({ Bearer: accessToken }).get<ApiResponse<SongDetails>>(
    `/songs/${songId}`,
  );

  return res.data.result;
};

export const uploadSong = async (
  accessToken: string,
  file: File,
  onUploadProgress?: OnUploadProgress,
  cancelToken?: CancelToken,
): Promise<string> => {
  const res = await createAxiosInstance({ Bearer: accessToken }).post<
    ApiResponse<UploadSongResult>
  >('/songs', file, {
    headers: {
      'content-type': file.type,
    },
    onUploadProgress,
    cancelToken,
  });

  return res.data.result.id;
};

export const updateSong = async (
  accessToken: string,
  songId: string,
  songData: SongUpdateData,
): Promise<SongUpdateData> => {
  const res = await createAxiosInstance({ Bearer: accessToken }).put<ApiResponse<SongUpdateData>>(
    `/songs/${songId}`,
    songData,
  );

  return res.data.result;
};

export const updateSongCover = async (
  accessToken: string,
  songId: string,
  file: File,
): Promise<UpdateCoverResult> => {
  const AxiosInstance = createAxiosInstance({ Bearer: accessToken });
  const res = await AxiosInstance.put<ApiResponse<UpdateCoverResult>>(
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
  const res = await createAxiosInstance({ Bearer: accessToken }).delete(`/songs/${songId}`);
  return res.status >= 200 && res.status < 300;
};

export const addToFavortes = async (accessToken: string, songId: string): Promise<boolean> => {
  await createAxiosInstance({ Bearer: accessToken }).put('/favorites', { songId });

  return true;
};

export const deleteFromFavorites = async (
  accessToken: string,
  songId: string,
): Promise<boolean> => {
  await createAxiosInstance({ Bearer: accessToken }).delete(`/favorites/${songId}`);

  return true;
};
