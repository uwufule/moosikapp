import APIError from '../errors/APIError';

export default (query: any) => {
  const skip = Number(query.skip);
  if (!Number.isInteger(skip) || skip < 0) {
    throw new APIError(400, 'Invalid query parameter `skip` provided.');
  }

  const limit = Number(query.limit);
  if (!Number.isInteger(limit) || (limit < 1 || limit > 100)) {
    throw new APIError(400, 'Invalid query parameter `limit` provided.');
  }

  const scope = Number(query.scope);
  if (!Number.isInteger(scope)) {
    throw new APIError(400, 'Invalid query parameter `scope` provided.');
  }

  return {
    ...query, skip, limit, scope,
  };
};
