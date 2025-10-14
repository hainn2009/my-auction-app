import { Controller, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  // config be apply in main.ts
  // cors: { origin: '*' },
  // cors: {
  //   origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'],
  //   credentials: true,
  // },
  namespace: '/auctions',
})
@Controller()
export class AuctionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server; // Inject Socket.IO Server instance
  private readonly logger = new Logger(AuctionsGateway.name);

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // Send initial auction state
    // client.emit('auction_state', Array.from(this.activeAuctions.entries()));
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
