import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export function makeInjectStorageInterceptor(fieldName: string) {
  @Injectable()
  class InjectStorageInterceptor implements NestInterceptor {
    constructor(@Inject('CLOUDINARY_STORAGE') readonly storage: any) {}

    intercept(context: ExecutionContext, next: CallHandler) {
      const interceptor = FileInterceptor(fieldName, { storage: this.storage });
      const instance = new (interceptor as any)();
      return instance.intercept(context, next);
    }
  }

  return InjectStorageInterceptor;
}
