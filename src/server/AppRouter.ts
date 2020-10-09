import cors from 'cors';
import Express, { Router } from 'express';
import HttpErrors from 'http-errors';
import SongsController from './controllers/SongsController';
import StatusController from './controllers/StatusController';
import UsersController from './controllers/UsersController';
import Database from './core/infrastructure/database/Database';
import ConfigProvider from './core/services/ConfigProvider';
import AsyncErrorHandler from './middlewares/AsyncErrorHandler';
import AuthMiddleware from './middlewares/AuthMiddleware';
import HeadersValidationMiddleware from './middlewares/HeadersValidationMiddleware';

class AppRouter {
  private readonly _configProvider: ConfigProvider;

  private readonly _database: Database;

  private readonly _router: Router;

  constructor(configProvider: ConfigProvider, database: Database) {
    this._configProvider = configProvider;
    this._database = database;

    this._router = Router();

    this._router.use(Express.json());
    this._router.use(cors());
    this._router.use('/v3', this.v3());

    this._router.all('*', () => {
      throw new HttpErrors.MethodNotAllowed('Method not allowed.');
    });
  }

  public getRouter = () => {
    return this._router;
  };

  private v3 = () => {
    const router = Router();

    const statusController = new StatusController(this._configProvider);
    const usersController = new UsersController(this._configProvider, this._database);
    const songsController = new SongsController(this._configProvider, this._database);

    const authMiddleware = new AuthMiddleware(this._configProvider);

    router.use(HeadersValidationMiddleware.validateAccept);

    router.get('/status', AsyncErrorHandler.useAsyncErrorHandler(statusController.get));

    router.post(
      '/signup',
      AsyncErrorHandler.useAsyncErrorHandler(
        HeadersValidationMiddleware.validateContentType('application/json'),
        usersController.signup,
      ),
    );
    router.post(
      '/login',
      AsyncErrorHandler.useAsyncErrorHandler(
        HeadersValidationMiddleware.validateContentType('application/json'),
        usersController.login,
      ),
    );
    router.post(
      '/login/refresh',
      AsyncErrorHandler.useAsyncErrorHandler(
        HeadersValidationMiddleware.validateContentType('application/json'),
        usersController.refresh,
      ),
    );
    router.post(
      '/logout',
      AsyncErrorHandler.useAsyncErrorHandler(authMiddleware.authorize, usersController.logout),
    );

    router.use(authMiddleware.authorize);

    router.get('/users', AsyncErrorHandler.useAsyncErrorHandler(usersController.get));
    router.get(
      '/users/search',
      AsyncErrorHandler.useAsyncErrorHandler(usersController.findByUsername),
    );
    router.get('/users/:userId', AsyncErrorHandler.useAsyncErrorHandler(usersController.getById));

    router.get('/songs', AsyncErrorHandler.useAsyncErrorHandler(songsController.get));
    router.get('/songs/search', AsyncErrorHandler.useAsyncErrorHandler(songsController.find));
    router.get('/songs/:songId', AsyncErrorHandler.useAsyncErrorHandler(songsController.getById));
    router.post(
      '/songs',
      AsyncErrorHandler.useAsyncErrorHandler(
        HeadersValidationMiddleware.validateContentType('audio/mpeg'),
        Express.raw({ type: ['audio/mpeg'], limit: '10MB' }),
        songsController.upload,
      ),
    );
    router.put(
      '/songs/:songId',
      AsyncErrorHandler.useAsyncErrorHandler(
        HeadersValidationMiddleware.validateContentType('application/json'),
        songsController.update,
      ),
    );
    router.put(
      '/songs/:songId/cover',
      AsyncErrorHandler.useAsyncErrorHandler(
        HeadersValidationMiddleware.validateContentType(
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/webp',
        ),
        Express.raw({ type: ['image/*'], limit: '1MB' }),
        songsController.updateCover,
      ),
    );
    router.delete('/songs/:songId', AsyncErrorHandler.useAsyncErrorHandler(songsController.delete));

    router.get('/favorites', AsyncErrorHandler.useAsyncErrorHandler(songsController.getFavorites));
    router.put(
      '/favorites',
      AsyncErrorHandler.useAsyncErrorHandler(songsController.addToFavorites),
    );
    router.delete(
      '/favorites/:songId',
      AsyncErrorHandler.useAsyncErrorHandler(songsController.deleteFromFavorites),
    );

    return router;
  };
}

export default AppRouter;
