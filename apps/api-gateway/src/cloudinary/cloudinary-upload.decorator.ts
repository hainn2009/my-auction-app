import { UseInterceptors } from '@nestjs/common';
import { makeInjectStorageInterceptor } from './inject-storage.interceptor';

export function CloudinaryUpload(fieldName: string) {
  return UseInterceptors(makeInjectStorageInterceptor(fieldName));
}
