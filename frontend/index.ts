import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });

export const getRequestHandler = async () => {
  await app.prepare();

  return app.getRequestHandler();
};
