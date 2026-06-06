import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AgendamentosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinEmpresa')
  handleJoinEmpresa(@ConnectedSocket() client: Socket, @MessageBody() empresaId: string) {
    const room = `empresa:${empresaId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
    return { event: 'joined', room };
  }

  emitNovoAgendamento(empresaId: string, data: any) {
    this.server.to(`empresa:${empresaId}`).emit('agendamento:novo', data);
  }

  emitStatusAgendamento(empresaId: string, data: any) {
    this.server.to(`empresa:${empresaId}`).emit('agendamento:status', data);
  }

  emitAlertaCapacidade(empresaId: string, data: any) {
    this.server.to(`empresa:${empresaId}`).emit('alerta:capacidade', data);
  }
}
