export interface GameStateClient {
  players: {
    id: string;
    snake: { x: number; y: number }[];
    alive: boolean;
  }[];
  food: { x: number; y: number };
};

export const __keep = true; // isso força o Vite a manter o arquivo
