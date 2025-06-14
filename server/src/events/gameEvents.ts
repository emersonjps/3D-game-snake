import { Server, Socket } from 'socket.io';
import { GameState } from '../core/GameState';

export function setupGameEvents(io: Server, gameState: GameState) {
  io.on('connection', (socket: Socket) => {
    console.log(`Player conectado: ${socket.id}`);
    gameState.addPlayer(socket.id);

    socket.on('player:move', (dir: 'up' | 'down' | 'left' | 'right') => {
      const player = gameState.players.get(socket.id);

      console.log(`Player ${socket.id} moved: ${dir}`);

      if (player) {
        player.setDirection(dir);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Player desconectado: ${socket.id}`);
      gameState.removePlayer(socket.id);
    });
  });
}
