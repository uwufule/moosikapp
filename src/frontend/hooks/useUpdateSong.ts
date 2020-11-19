import SongUpdateData from '@core/services/api/interfaces/SongUpdateData';
import UpdateCoverResponseData from '@core/services/api/interfaces/UpdateCoverResult';
import * as songsApi from '@core/services/api/songs';
import useTokenManager from './useTokenManager';

const useUpdateSong = () => {
  const tokenManager = useTokenManager();

  const update = async (songId: string, songData: SongUpdateData): Promise<SongUpdateData> => {
    const token = await tokenManager.refreshIfNeeded();
    return songsApi.updateSong(token.accessToken, songId, songData);
  };

  const updateCover = async (songId: string, file: File): Promise<UpdateCoverResponseData> => {
    const token = await tokenManager.refreshIfNeeded();
    return songsApi.updateSongCover(token.accessToken, songId, file);
  };

  return {
    update,
    updateCover,
  };
};

export default useUpdateSong;
