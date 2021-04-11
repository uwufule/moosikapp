import { getRequestHandler } from 'moosikapp-frontend';
import App from './App';
import Database from './core/infrastructure/database/Database';
import ConfigProvider from './core/services/ConfigProvider';

const main = async () => {
  const configProvider = new ConfigProvider();

  const nextAppHandler = await getRequestHandler();

  const database = new Database(configProvider);

  const app = new App(configProvider, database);
  await app.init();

  const server = app.getServer();

  server.get('*', (req, res) => {
    nextAppHandler(req, res);
  });

  server.listen(configProvider.port);
};

main();
