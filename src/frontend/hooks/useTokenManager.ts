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
      headers: {
        'content-type': 'application/json',
      },
      data: {
        refreshToken: initRefreshToken || refreshToken,
      },
    });

    if (res.data.result) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.result;

      dispatch(setTokens(newAccessToken, newRefreshToken));
      localStorage.setItem('token', newRefreshToken);
    }

    // dispatch(error message);
  };

  return {
    isAccessTokenExpiresSoon,
    refresh,
  };
};

export default useTokenManager;
