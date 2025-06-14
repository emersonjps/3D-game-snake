// Função para teleporte nas bordas do campo
export function wrapPosition(x: number, y: number, width: number, height: number) {
  let newX = x;
  let newY = y;

  if (x < 0) newX = width - 1;
  else if (x >= width) newX = 0;

  if (y < 0) newY = height - 1;
  else if (y >= height) newY = 0;

  return { x: newX, y: newY };
}

