import Joi from 'joi';

export const UserDTO = {
  registerDto: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  }),
  loginDto: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    captcha: Joi.string().length(4).required(),
  })
} 