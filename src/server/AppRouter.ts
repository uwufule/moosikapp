import cors from 'cors';
import Express, { Router } from 'express';
import HttpErrors from 'http-errors';
import SongsController from './controllers/SongsController';
import StatusController from './controllers/StatusController';
import UsersController from './controllers/UsersController';
import UserCollectionManager from './core/infrastructure/database/UserCollectionManager';
import ConfigProvider from './core/services/ConfigProvider';
import AsyncErrorHandler from './middlewares/AsyncErrorHandler';
import AuthMiddleware from './middlewares/AuthMiddleware';
import HeadersValidationMiddleware from './middlewares/HeadersValidationMiddleware';

class AppRouter {
  private readonly _configProvider: ConfigProvider;

  private readonly _router: Router;

  constructor(configProvider: ConfigProvider) {
    this._configProvider = configProvider;

    this._router = Router();

    this._router.use('/v3', this.getV3Router());

    this._router.all('*', () => {
      throw new HttpErrors.MethodNotAllowed('Method not allowed.');
    });
  }

  public get = () => {
    return this._router;
  };

  private getV3Router = () => {
    const router = Router();

    const userCollectionManager = new UserCollectionManager(this._configProvider);

    const statusController = new StatusController(this._configProvider);
    const usersController = new UsersController(this._configProvider, userCollectionManager);
    const songsController = new SongsController(this._configProvider, userCollectionManager);

    const authMiddleware = new AuthMiddleware(this._configProvider);

    router.use(Express.json());
    router.use(cors());

    router.use(HeadersValidationMiddleware.validateAccept);

    router.get('/status', AsyncErrorHandler.with(statusController.get));

    router.post('/signup', AsyncErrorHandler.with(usersController.signup));
    router.post(
      '/login',
      AsyncErrorHandler.with(
        HeadersValidationMiddleware.validateContentType('application/json'),
        usersController.login,
      ),
    );
    router.post(
      '/login/refresh',
      AsyncErrorHandler.with(
        HeadersValidationMiddleware.validateContentType('application/json'),
        usersController.refresh,
      ),
    );

    router.use(authMiddleware.authorize);

    router.get('/users', AsyncErrorHandler.with(usersController.get));
    router.get('/users/:username', AsyncErrorHandler.with(usersController.getByUsername));

    router.get('/songs', AsyncErrorHandler.with(songsController.get));
    router.get('/songs/search', AsyncErrorHandler.with(songsController.find));
    router.get('/songs/:songId', AsyncErrorHandler.with(songsController.getById));
    router.post(
      '/songs',
      AsyncErrorHandler.with(
        HeadersValidationMiddleware.validateContentType('audio/mpeg'),
        Express.raw({ type: ['audio/mpeg'], limit: '10MB' }),
        songsController.upload,
      ),
    );
    router.put(
      '/songs/:songId',
      AsyncErrorHandler.with(
        HeadersValidationMiddleware.validateContentType('application/json'),
        songsController.update,
      ),
    );
    router.put(
      '/songs/:songId/cover',
      AsyncErrorHandler.with(
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
    router.delete('/songs/:songId', AsyncErrorHandler.with(songsController.delete));

    router.get('/favorites', AsyncErrorHandler.with(songsController.getFavorites));
    router.post('/favorites', AsyncErrorHandler.with(songsController.addToFavorites));
    router.delete(
      '/favorites/:songId',
      AsyncErrorHandler.with(songsController.deleteFromFavorites),
    );

    return router;
  };
}

export default AppRouter;
