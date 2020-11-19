import isAccessTokenExpiresSoon from '@core/utils/isAccessTokenExpiresSoon';
import { selectAccessToken, selectRefreshToken } from '@redux/auth/selectors';
import { useDispatch, useSelector } from 'react-redux';
import * as authApi from '@core/services/api/auth';
import { setToken } from '@redux/auth/actions';
import Token from '@core/models/Token';

const useTokenManager = () => {
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);

  const dispatch = useDispatch();

  const refreshIfNeeded = async (): Promise<Token> => {
    if (isAccessTokenExpiresSoon(accessToken)) {
      const token = await authApi.refresh(refreshToken);

      dispatch(setToken(token.accessToken, token.refreshToken));

      return token;
    }

    return { accessToken, refreshToken };
  };

  return {
    refreshIfNeeded,
  };
};

export default useTokenManager;
