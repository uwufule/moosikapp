import Authorization from '@core/infrastructure/transport/interfaces/Authorization';

const getAuthString = (authorization?: Authorization) => {
  return (
    authorization &&
    Object.entries(authorization)
      .map((keyValuePair) => keyValuePair.join(' '))
      .join()
  );
};

export default getAuthString;
