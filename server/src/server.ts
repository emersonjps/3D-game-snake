import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameState } from './core/GameState';
import { setupGameEvents } from './events/gameEvents';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const gameState = new GameState();

setupGameEvents(io, gameState);

// Loop de atualização do jogo
setInterval(() => {
  gameState.update();
  io.emit('game:update', gameState.getState());
}, 200); // atualiza a cada 200ms

httpServer.listen(3000, () => {
  console.log("Servidor Snake multiplayer na porta 3000");
});
