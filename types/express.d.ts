import { UserPayload } from '@app/contracts';
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
    cookies?: { [key: string]: string };
  }
}

// declare module 'express' {
//   export interface Request {
//     cookies?: { [key: string]: string };
//   }
// }
