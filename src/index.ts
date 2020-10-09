import App from './server/App';
import Database from './server/core/infrastructure/database/Database';
import ConfigProvider from './server/core/services/ConfigProvider';
import NextApp from './server/NextApp';

const main = async () => {
  const configProvider = new ConfigProvider();

  const nextApp = new NextApp(configProvider);
  await nextApp.init();
  const nextAppHandler = nextApp.getRequestHandler();

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
