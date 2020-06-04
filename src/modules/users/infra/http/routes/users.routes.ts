import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';
import { authenticated } from '@modules/users/infra/http/middlewares/authenticate';
import {
  UsersController,
  AvatarController,
} from '@modules/users/infra/http/controllers';

export const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const controller = new UsersController();
const avatarController = new AvatarController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  controller.create,
);

usersRouter.patch(
  '/avatar',
  authenticated,
  upload.single('avatar'),
  avatarController.update,
);

export default usersRouter;
