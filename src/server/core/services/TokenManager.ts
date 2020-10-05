import JWT from 'jsonwebtoken';
import TokenCollectionManager from '../infrastructure/database/TokenCollectionManager';
import Token from '../models/Token';
import ConfigProvider from './ConfigProvider';

class TokenManager {
  private static readonly ACCESS_TOKEN_EXPIRE_TIME = '30m';

  private static readonly REFRESH_TOKEN_EXPIRE_TIME = '30d';

  private readonly _configProvider: ConfigProvider;

  private readonly _tokenCollectionManager: TokenCollectionManager;

  constructor(configProvider: ConfigProvider, tokenCollectionManager: TokenCollectionManager) {
    this._configProvider = configProvider;
    this._tokenCollectionManager = tokenCollectionManager;
  }

  public createToken = async (userId: string, userRole: number): Promise<Token> => {
    const refreshTokenId = await this._tokenCollectionManager.add(userId);
    return {
      accessToken: this.signAccessToken(userId, userRole),
      refreshToken: this.signRefreshToken(refreshTokenId, userId),
    };
  };

  public updateToken = async (
    userId: string,
    userRole: number,
    tokenId: string,
  ): Promise<Token> => {
    await this._tokenCollectionManager.delete(tokenId);

    const refreshTokenId = await this._tokenCollectionManager.add(userId);
    return {
      accessToken: this.signAccessToken(userId, userRole),
      refreshToken: this.signRefreshToken(refreshTokenId, userId),
    };
  };

  private signAccessToken = (userId: string, userRole: number) => {
    return JWT.sign({ sub: userId, scope: userRole }, this._configProvider.jwtSecretKey, {
      expiresIn: TokenManager.ACCESS_TOKEN_EXPIRE_TIME,
    });
  };

  private signRefreshToken = (tokenId: string, userId: string) => {
    return JWT.sign({ jti: tokenId, sub: userId }, this._configProvider.jwtSecretKey, {
      expiresIn: TokenManager.REFRESH_TOKEN_EXPIRE_TIME,
    });
  };
}

export default TokenManager;
