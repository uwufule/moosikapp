import APIError from '../errors/APIError';

export default (query: any) => {
  const skip = Number(query.skip);
  if (skip < 0) {
    throw new APIError(400, 'Invalid query parameter `skip` provided.');
  }

  const limit = Number(query.limit);
  if (limit < 1 || limit > 100) {
    throw new APIError(400, 'Invalid query parameter `limit` provided.');
  }

  return { skip, limit, ...query };
};
