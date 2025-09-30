import { UserPayload } from '@app/contracts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}
