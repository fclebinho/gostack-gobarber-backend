import { container } from 'tsyringe';
import { IHashProvider, BCryptHashProvider } from './hash';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

export * from './hash';
