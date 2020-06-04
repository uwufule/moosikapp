import next from 'next';
import createExpressServer from './server';

const { NODE_ENV, PORT } = process.env;

const init = async () => {
  const app = next({ dir: 'src/frontend', dev: NODE_ENV !== 'production' });
  await app.prepare();

  const handler = app.getRequestHandler();

  const server = await createExpressServer();

  server.get('*', (req, res) => {
    handler(req, res);
  });

  server.listen(Number(PORT));
};

init();
