import fetch, { RequestInit } from 'node-fetch';

class FetchHelper {
  public static fetch = fetch;

  public static tryFetch = (url: string, init?: RequestInit) => {
    try {
      return FetchHelper.fetch(url, init);
    } catch (e) {
      return null;
    }
  };
}

export default FetchHelper;
