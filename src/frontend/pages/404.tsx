import Error from '@components/Error';

const NotFoundError = () => (
  <Error
    title="404"
    message={['An error 404 occurred on server']}
  />
);

export default NotFoundError;
