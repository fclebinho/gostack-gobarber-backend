import { Router } from 'express';

import {
  UsersRouter,
  SessionsRouter,
  PasswordRouter,
  ProfileRouter,
} from '@modules/users/infra/http/routes';
import {
  AppointmentsRouter,
  ProvidersRouter,
} from '@modules/appointments/infra/http/routes';

export const routes = Router();

routes.use('/appointments', AppointmentsRouter);
routes.use('/providers', ProvidersRouter);
routes.use('/users', UsersRouter);
routes.use('/sessions', SessionsRouter);
routes.use('/password', PasswordRouter);
routes.use('/profile', ProfileRouter);

export default routes;
