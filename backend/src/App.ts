import express, { Express } from 'express';
import helmet from 'helmet';
import AppRouter from './AppRouter';
import Database from './core/infrastructure/database/Database';
import ConfigProvider from './core/services/ConfigProvider';
import AsyncErrorHandler from './middlewares/AsyncErrorHandler';

class App {
  private readonly _database: Database;

  private readonly _app: Express;

  constructor(configProvider: ConfigProvider, database: Database) {
    this._database = database;

    this._app = express();

    this._app.use(
      helmet({
        hsts: false,
        contentSecurityPolicy: {
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'default-src': ["'self'", '*.moosikapp.ml'],
            'img-src': ["'self'", '*.moosikapp.ml', 'data:'],
            'object-src': ["'self'", 'blob:'],
          },
        },
      }),
    );

    const appRouter = new AppRouter(configProvider, this._database);
    this._app.use('/api', appRouter.getRouter());

    this._app.use(AsyncErrorHandler.getAsyncErrorHandler());
  }

  public init = async () => {
    await this._database.connect();
  };

  public getServer = () => {
    return this._app;
  };
}

export default App;
