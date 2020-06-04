import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import ApplicationError from '@shared/errors/application-error';
import { rateLimiterMiddleware } from '@shared/infra/http/middlewares';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(rateLimiterMiddleware);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof ApplicationError) {
      return response.status(err.status).json({
        status: 'error',
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
      internal: err.message,
    });
  },
);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Server started on port 3333');
});
