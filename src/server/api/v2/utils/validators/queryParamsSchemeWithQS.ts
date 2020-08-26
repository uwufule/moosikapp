import Joi from '@hapi/joi';
import queryParamsScheme, { QueryParams } from './queryParamsScheme';

export interface QueryParamsWithQS extends QueryParams {
  query: string;
}

const queryParamsSchemeWithQS = queryParamsScheme.append({
  query: Joi.string()
    .required()
    .min(2)
    .error(new Error('Invalid query parameter `query` provided.')),
});

export default queryParamsSchemeWithQS;
