import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as io from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  //   private readonly logger = new Logger(SocketIoAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: io.ServerOptions): io.Server {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    const isString = (value: any): value is string => typeof value === 'string' && value.length > 0;

    const initialOrigins = [frontendUrl, 'http://localhost:5173', 'http://localhost:5174'];
    const allowedOrigins = initialOrigins.filter(isString);

    const serverOptions = {
      ...(options as object),
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };

    // this.logger.log(`Socket.IO CORS configured with: ${JSON.stringify(serverOptions.cors)}`);

    return super.createIOServer(port, serverOptions as io.ServerOptions);
  }
}
