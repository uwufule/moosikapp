import Roles from '../enums/Roles';
import Scopes from '../enums/Scopes';

class ConfigProvider {
  public readonly isDev: boolean;

  private _port: number = 8080;

  private _jwtSecretKey: string;

  private _mongoUri: string;

  private _cdnServerUri: string;

  public readonly roles = Roles;

  public readonly scopes = Scopes;

  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production';

    const port = process.env.PORT;
    if (port) {
      this._port = Number.parseInt(port, 10);
    }

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('No mongo uri');
    }
    this._mongoUri = mongoUri;

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error('No jwt secret key');
    }
    this._jwtSecretKey = jwtSecretKey;

    const cdnServerUri = process.env.CDN_SERVER_URI;
    if (!cdnServerUri) {
      throw new Error('No cdn server uri');
    }
    this._cdnServerUri = cdnServerUri;
  }

  public get port() {
    return this._port;
  }

  public get jwtSecretKey() {
    return this._jwtSecretKey;
  }

  public get mongoUri() {
    return this._mongoUri;
  }

  public get cdnServerUri() {
    return this._cdnServerUri;
  }
}

export default ConfigProvider;
