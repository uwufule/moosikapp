import Joi, { ObjectSchema } from 'joi';

class UserDataValidators {
  private readonly _singupDataValidator: ObjectSchema;

  private readonly _loginDataValidator: ObjectSchema;

  private readonly _refreshDataValidator: ObjectSchema;

  private readonly _findUserByUsernameDataValidator: ObjectSchema;

  constructor() {
    this._singupDataValidator = Joi.object({
      username: Joi.string()
        .required()
        .regex(/^[^ ]*$/u)
        .error(new Error('Username cannot include white spaces.')),
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

    this._findUserByUsernameDataValidator = Joi.object({
      username: Joi.string()
        .required()
        .min(1)
        .error(new Error('Invalid query parameter `username` privided.')),
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

  public validateFindUserByUsername = (value: any) => {
    return this._findUserByUsernameDataValidator.validate(value);
  };
}

export default UserDataValidators;
