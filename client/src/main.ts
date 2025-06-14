import { initRenderer, renderGame } from './game';
import { socket } from './socket';

let selfId = '';

initRenderer();

socket.on('connect', () => {
  selfId = socket.id ?? '';
});

socket.on('game:update', (state) => {
  renderGame(state, selfId);
});

window.addEventListener('keydown', (e) => {
  const map: Record<string, string> = {
    ArrowUp: 'down',
    ArrowDown: 'up',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'down',
    s: 'up',
    a: 'left',
    d: 'right',
  };

  console.log('Key pressed:', e.key);

  const dir = map[e.key];
  if (dir) {
    socket.emit('player:move', dir);
  }
});
