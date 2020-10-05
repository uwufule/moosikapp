import express, { Express } from 'express';
import helmet from 'helmet';
import AppRouter from './AppRouter';
import Database from './core/infrastructure/database/Database';
import ConfigProvider from './core/services/ConfigProvider';
import AsyncErrorHandler from './middlewares/AsyncErrorHandler';

class App {
  private readonly _app: Express;

  private readonly _configProvider: ConfigProvider;

  private readonly _database: Database;

  constructor(configProvider: ConfigProvider) {
    this._app = express();

    this._app.use(helmet({ hsts: false }));

    const appRouter = new AppRouter(configProvider);
    this._app.use('/api', appRouter.get());

    const asyncErrorHandler = new AsyncErrorHandler();
    this._app.use(asyncErrorHandler.getHandler());

    this._configProvider = configProvider;
    this._database = new Database(this._configProvider);
  }

  public init = async () => {
    await this._database.connect();
  };

  public get = () => {
    return this._app;
  };
}

export default App;
