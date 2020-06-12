import { Document } from 'mongoose';

const toJson = <T = any>(doc: Document | null) => (
  <T | null>doc?.toJSON() ?? null
);

export default toJson;
