import OnUploadProgress from '@core/services/api/interfaces/OnUploadProgress';
import * as songsApi from '@core/services/api/songs';
import { CancelToken } from 'axios';
import useTokenManager from './useTokenManager';

const useUploadSong = () => {
  const tokenManager = useTokenManager();

  const upload = async (
    file: File,
    onUploadProgress?: OnUploadProgress,
    cancelToken?: CancelToken,
  ) => {
    const token = await tokenManager.refreshIfNeeded();
    return songsApi.uploadSong(token.accessToken, file, onUploadProgress, cancelToken);
  };
  return upload;
};

export default useUploadSong;
