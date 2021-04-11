import Scopes from '../../../enums/Scopes';

interface GetSongsOptions {
  scope?: Scopes;
  skip?: number;
  limit?: number;
}

export default GetSongsOptions;
