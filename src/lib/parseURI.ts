import url from 'url';
import qs from 'qs';

export function parseUri(callbackUri: string) {
  const { query, hash } = url.parse(callbackUri, true);
  const hashObject = hash ? qs.parse(hash.replace(/^#/, '')) : {};
  if (query.error) {
    const error = new Error(query.error as string);
    throw error;
  }

  return {
    ...query,
    ...hashObject,
  };
}
