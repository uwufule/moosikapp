import scopes from '../../../config/scopes.json';

const isFav = (scope?: number) => (userId: string, likes: string[]) =>
  scope && scope & scopes.favorite ? likes.includes(userId) : undefined;

export default isFav;
