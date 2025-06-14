export interface Position {
  x: number;
  y: number;
}

export class Player {
  id: string;
  snake: Position[];
  direction: 'up' | 'down' | 'left' | 'right';
  alive: boolean;

  constructor(id: string, startPosition: Position) {
    this.id = id;
    this.snake = [startPosition];
    this.direction = 'right';
    this.alive = true;
  }

  move() {
    if (!this.alive) return;

    const head = { ...this.snake[0] };
    switch (this.direction) {
      case 'up': head.y -= 1; break;
      case 'down': head.y += 1; break;
      case 'left': head.x -= 1; break;
      case 'right': head.x += 1; break;
    }

    this.snake.unshift(head);
    this.snake.pop(); // remove a cauda (a não ser que coma comida)
  }

  grow() {
    const tail = this.snake[this.snake.length - 1];
    this.snake.push({ ...tail }); // cresce mantendo a cauda anterior
  }

  setDirection(dir: 'up' | 'down' | 'left' | 'right') {
    const opposite = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };

    if (dir !== opposite[this.direction]) {
      this.direction = dir;
    }
  }
}
