import GetSongsRequestOptions from './GetSongsRequestOptions';

interface SearchSongsRequestOptions extends GetSongsRequestOptions {
  query: string;
}

export default SearchSongsRequestOptions;
