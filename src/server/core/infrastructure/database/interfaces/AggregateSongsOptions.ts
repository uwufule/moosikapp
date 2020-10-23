import Scopes from '../../../enums/Scopes';

interface AggregateSongsOptions {
  scope?: Scopes;
  skip?: number;
  limit?: number;
  query?: any;
}

export default AggregateSongsOptions;
