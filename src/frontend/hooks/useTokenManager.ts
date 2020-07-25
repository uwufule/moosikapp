import { useDispatch, useSelector } from 'react-redux';
import JWT from 'jsonwebtoken';
import { setTokens } from '@redux/auth/actions';
import { RootState } from '@redux/store';
import request from '@utils/request';

interface AccessToken {
  uuid: string;
  role: number;
  iat: number;
  exp: number;
}

const useTokenManager = () => {
  const dispatch = useDispatch();

  const [accessToken, refreshToken] = useSelector<RootState, [string, string]>((state) => [
    state.auth.accessToken,
    state.auth.refreshToken,
  ]);

  const isAccessTokenExpiresSoon = () => {
    const payload = <AccessToken>JWT.decode(accessToken);
    if (!payload) {
      throw new Error('Invalid access token.');
    }

    const timeLeft = payload.exp - Math.round(Date.now() / 1000);
    return timeLeft < 60;
  };

  const refresh = async (initRefreshToken?: string) => {
    const res = await request('/login/refresh', {
      method: 'POST',
      params: {
        refreshToken: initRefreshToken || refreshToken,
      },
    });

    dispatch(setTokens(res.data.accessToken, res.data.refreshToken));
    localStorage.setItem('token', res.data.refreshToken);
  };

  return {
    isAccessTokenExpiresSoon,
    refresh,
  };
};

export default useTokenManager;
