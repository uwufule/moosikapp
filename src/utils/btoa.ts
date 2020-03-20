import isServer from './isServer';

export default (str: string) => (
  isServer ? Buffer.from(str).toString('base64') : btoa(str)
);
