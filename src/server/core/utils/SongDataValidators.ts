import Joi, { ObjectSchema } from 'joi';

class SongDataValidators {
  private readonly _queryParamsValidator: ObjectSchema;

  private readonly _queryParamsWithQsValidator: ObjectSchema;

  private readonly _updateSongDataValidator: ObjectSchema;

  private readonly _addToFavoritesValidator: ObjectSchema;

  constructor() {
    this._queryParamsValidator = Joi.object({
      skip: Joi.number().min(0).error(new Error('Invalid query parameter `skip` provided.')),
      limit: Joi.number()
        .min(1)
        .max(100)
        .error(new Error('Invalid query parameter `limit` provided.')),
      scope: Joi.number().positive().error(new Error('Invalid query parameter `scope` provided.')),
    });

    this._queryParamsWithQsValidator = this._queryParamsValidator.append({
      query: Joi.string()
        .required()
        .min(2)
        .error(new Error('Invalid query parameter `query` provided.')),
    });

    this._updateSongDataValidator = Joi.object({
      author: Joi.string().min(1).max(120).error(new Error('Invalid field `author` provided.')),
      title: Joi.string().min(1).max(120).error(new Error('Invalid field `title` provided.')),
      cover: Joi.string().uri().error(new Error('Invalid field `cover` provided.')),
    });

    this._addToFavoritesValidator = Joi.object({
      songId: Joi.string()
        .uuid({ version: 'uuidv4' })
        .required()
        .error(new Error('Invalid field `songId` provided.')),
    });
  }

  public validateQueryParams = (value: any) => {
    return this._queryParamsValidator.validate(value);
  };

  public validateQueryParamsWithQs = (value: any) => {
    return this._queryParamsWithQsValidator.validate(value);
  };

  public validateUpdateSongData = (value: any) => {
    return this._updateSongDataValidator.validate(value);
  };

  public validateAddToFavoritesData = (value: any) => {
    return this._addToFavoritesValidator.validate(value);
  };
}

export default SongDataValidators;
