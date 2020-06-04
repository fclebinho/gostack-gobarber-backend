import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import {
  ResetPasswordController,
  RetrievePasswordController,
} from '@modules/users/infra/http/controllers';

const passwordRouter = Router();
const resetController = new ResetPasswordController();
const retrieveController = new RetrievePasswordController();

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetController.create,
);

passwordRouter.post(
  '/retrieve',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  retrieveController.create,
);

export default passwordRouter;
