import Joi from 'joi';

export const AudioDTO = {
  updateAudio: Joi.object({
    result: Joi.string(),
  }),
} 