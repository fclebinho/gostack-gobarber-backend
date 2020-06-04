import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import authenticated from '@modules/users/infra/http/middlewares/authenticate';
import {
  ProvidersController,
  ProviderDayAvailabilityController,
  ProviderMonthAvailabilityController,
} from '@modules/appointments/infra/http/controllers';

export const providersRouter = Router();
const controller = new ProvidersController();
const dayAvailabilityController = new ProviderDayAvailabilityController();
const monthAvailabilityController = new ProviderMonthAvailabilityController();

providersRouter.use(authenticated);

providersRouter.get('/', controller.index);

providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  dayAvailabilityController.index,
);

providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  monthAvailabilityController.index,
);

export default providersRouter;
