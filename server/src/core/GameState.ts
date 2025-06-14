import { Player } from '../models/Player';
import { wrapPosition } from '../utils/wrapPosition';

export class GameState {
  players: Map<string, Player>;
  food: { x: number; y: number } | null = null;
  gridSize: number = 20;

  constructor() {
    this.players = new Map();
    this.generateFood();
  }

  addPlayer(id: string) {
    const position = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize),
    };
    this.players.set(id, new Player(id, position));
  }

  removePlayer(id: string) {
    this.players.delete(id);
  }

  update() {
    for (const player of this.players.values()) {
      player.move();

      let head = player.snake[0];
      // aplica wrap nas bordas
      const wrapped = wrapPosition(head.x, head.y, this.gridSize, this.gridSize);
      head.x = wrapped.x;
      head.y = wrapped.y;

      // colisão com comida
      if (head.x === this.food?.x && head.y === this.food?.y) {
        player.grow();
        this.generateFood();
      }

      // TODO: colisão com outros jogadores
    }
  }

  generateFood() {
    this.food = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize),
    };
  }

  getState() {
    return {
      players: Array.from(this.players.values()).map((p) => ({
        id: p.id,
        snake: p.snake,
        alive: p.alive
      })),
        food: this.food ?? { x: 0, y: 0 }
    };
  }
}
