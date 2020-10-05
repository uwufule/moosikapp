import Crypto from 'crypto';
import JWT from 'jsonwebtoken';
import joinUrl from 'url-join';
import ConfigProvider from './ConfigProvider';

class UploadTargetUriProvider {
  private readonly _configProvider: ConfigProvider;

  constructor(configProvider: ConfigProvider) {
    this._configProvider = configProvider;
  }

  public get = () => {
    const jti = Crypto.randomBytes(6).toString('hex');
    const targetToken = JWT.sign({ jti }, this._configProvider.jwtSecretKey, { expiresIn: 1800 });

    return joinUrl(this._configProvider.cdnServerUri, 'upload-target', targetToken);
  };
}

export default UploadTargetUriProvider;
