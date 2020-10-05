import App from './server/App';
import ConfigProvider from './server/core/services/ConfigProvider';
import NextApp from './server/NextApp';

const main = async () => {
  const configProvider = new ConfigProvider();

  const nextApp = new NextApp(configProvider);
  await nextApp.init();
  const nextAppHandler = nextApp.getRequestHandler();

  const app = new App(configProvider);
  await app.init();

  const server = app.get();

  server.get('*', (req, res) => {
    nextAppHandler(req, res);
  });

  server.listen(configProvider.port);
};

main();
