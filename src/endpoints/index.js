import v1 from './v1';

export default (app) => {
  // 404 not found
  v1(app);

  app.all('/api/*', (req, res) => {
    res.status(404).send({ message: 'The resource you are trying to request does not exist.' });
  });
};
