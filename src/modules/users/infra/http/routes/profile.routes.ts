import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import { authenticated } from '@modules/users/infra/http/middlewares/authenticate';
import { UpdateProfileController } from '@modules/users/infra/http/controllers';

export const profileRouter = Router();
const profileController = new UpdateProfileController();

profileRouter.use(authenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password_old: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

export default profileRouter;
