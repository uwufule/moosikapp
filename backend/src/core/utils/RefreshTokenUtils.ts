import JWT from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken';
import Timestamp from '../models/Timestamp';
import ConfigProvider from '../services/ConfigProvider';

class RefreshTokenUtils {
  private readonly _confighProvider: ConfigProvider;

  constructor(configProvider: ConfigProvider) {
    this._confighProvider = configProvider;
  }

  public tryParse = (refreshToken: string) => {
    try {
      return <Timestamp<RefreshToken>>JWT.verify(refreshToken, this._confighProvider.jwtSecretKey);
    } catch (e) {
      return null;
    }
  };
}

export default RefreshTokenUtils;
