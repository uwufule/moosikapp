import Joi, { ObjectSchema } from 'joi';

class UserDataValidators {
  private readonly _singupDataValidator: ObjectSchema;

  private readonly _loginDataValidator: ObjectSchema;

  private readonly _refreshDataValidator: ObjectSchema;

  constructor() {
    this._singupDataValidator = Joi.object({
      username: Joi.string()
        .required()
        .min(1)
        .max(64)
        .regex(/^[\p{L},\p{N}]+$/u)
        .error(
          new Error('Invalid username provided. Username must contain 1-64 letters or numbers.'),
        ),
      email: Joi.string()
        .required()
        .email({ allowUnicode: false })
        .error(new Error('Invalid e-mail address provided.')),
      password: Joi.string()
        .required()
        .min(8)
        .error(new Error('Invalid password provided. Password must be at least 8 symbols long.')),
    });

    this._loginDataValidator = Joi.object({
      username: Joi.string().required().error(new Error('Username required.')),
      password: Joi.string().required().error(new Error('Password required.')),
    });

    this._refreshDataValidator = Joi.object({
      refreshToken: Joi.string().required().error(new Error('Refresh token required.')),
    });
  }

  public validateSignupData = (value: any) => {
    return this._singupDataValidator.validate(value);
  };

  public validateLoginData = (value: any) => {
    return this._loginDataValidator.validate(value);
  };

  public validateRefreshData = (value: any) => {
    return this._refreshDataValidator.validate(value);
  };
}

export default UserDataValidators;
