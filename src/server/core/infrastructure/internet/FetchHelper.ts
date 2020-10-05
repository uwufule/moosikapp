import fetch, { RequestInit } from 'node-fetch';

class FetchClient {
  public static fetch = fetch;

  public static tryFetch = (url: string, init?: RequestInit) => {
    try {
      return FetchClient.fetch(url, init);
    } catch (e) {
      return null;
    }
  };
}

export default FetchClient;
