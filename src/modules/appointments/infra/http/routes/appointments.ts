import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import authenticated from '@modules/users/infra/http/middlewares/authenticate';
import {
  AppointmentsController,
  ProviderAppointmentsController,
} from '@modules/appointments/infra/http/controllers';

export const appointmentsRouter = Router();
const controller = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(authenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  controller.create,
);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
