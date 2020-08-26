import Joi from 'joi';

export interface QueryParams {
  skip?: number;
  limit?: number;
  scope?: number;
}

const queryParamsScheme = Joi.object({
  skip: Joi.number().min(0).error(new Error('Invalid query parameter `skip` provided.')),
  limit: Joi.number().min(1).max(100).error(new Error('Invalid query parameter `limit` provided.')),
  scope: Joi.number().positive().error(new Error('Invalid query parameter `scope` provided.')),
});

export default queryParamsScheme;
