import next from 'next';
import Server from 'next/dist/next-server/server/next-server';
import ConfigProvider from './core/services/ConfigProvider';

class NextApp {
  private readonly _frontendSourceDir = 'src/frontend';

  private readonly _app: Server;

  constructor(configProvider: ConfigProvider) {
    this._app = next({ dir: this._frontendSourceDir, dev: configProvider.isDev });
  }

  public init = async () => {
    await this._app.prepare();
  };

  public getRequestHandler = () => {
    return this._app.getRequestHandler();
  };
}

export default NextApp;
