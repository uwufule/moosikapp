import fetch, { RequestInfo, RequestInit } from 'node-fetch';

class FetchHelper {
  public static fetch = fetch;

  public static tryFetch = async (url: RequestInfo, init?: RequestInit) => {
    try {
      return await FetchHelper.fetch(url, init);
    } catch (e) {
      return null;
    }
  };
}

export default FetchHelper;
