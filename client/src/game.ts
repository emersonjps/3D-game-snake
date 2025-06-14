import * as THREE from 'three';

interface GameState {
  players: {
    id: string;
    snake: { x: number; y: number }[];
    alive: boolean;
  }[];
  food: { x: number; y: number };
};

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let gridSize = 20;
let blockSize = 1;

const playerColor = 0x00ff00;
const otherColor = 0x8888ff;
const foodColor = 0xff4444;
const stemColor = 0x228833;

const objects: THREE.Object3D[] = [];

export function initRenderer() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // Aproxima ainda mais a câmera do grid
  camera.position.set(gridSize / 2, -gridSize * 0.45, gridSize * 0.7);
  camera.lookAt(gridSize / 2, gridSize / 2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Luz ambiente mais suave
  const ambientLight = new THREE.AmbientLight(0x888888, 0.5);
  scene.add(ambientLight);

  // Luz direcional principal
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(10, 10, 20);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Luz de preenchimento para suavizar sombras
  const fillLight = new THREE.DirectionalLight(0x88aaff, 0.5);
  fillLight.position.set(-10, -10, 10);
  scene.add(fillLight);

  // Luz pontual para brilho extra
  const pointLight = new THREE.PointLight(0xffffff, 0.3, 100);
  pointLight.position.set(gridSize / 2, gridSize / 2, gridSize);
  scene.add(pointLight);

  // Piso com malha matriz
  const floorSize = gridSize;
  const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize, floorSize, floorSize);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.z = -Math.PI / 2;
  floor.position.set(gridSize / 2, gridSize / 2, 0);
  scene.add(floor);
}

function createSnakeSegment(x: number, y: number, color: number) {
  const size = blockSize;
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x + 0.5, y + 0.5, size / 2);
  return cube;
}

function createFood(x: number, y: number) {
  const strawberryGroup = new THREE.Group();

  // Corpo do morango (esfera achatada)
  const sphereGeometry = new THREE.SphereGeometry(blockSize / 2, 16, 16);
  sphereGeometry.scale(1, 1.2, 1); // Alongado no eixo Y
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: foodColor });
  const strawberry = new THREE.Mesh(sphereGeometry, sphereMaterial);
  strawberry.position.set(0, 0, blockSize / 2);
  strawberryGroup.add(strawberry);

  // Cabinho (cilindro)
  const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
  const stemMaterial = new THREE.MeshStandardMaterial({ color: stemColor });
  const stem = new THREE.Mesh(stemGeometry, stemMaterial);
  stem.position.set(0, 0, blockSize + 0.2);
  strawberryGroup.add(stem);

  strawberryGroup.position.set(x + 0.5, y + 0.5, 0);
  return strawberryGroup;
}

export function renderGame(state: GameState, selfId: string) {
  objects.forEach(obj => scene.remove(obj));
  objects.length = 0;

  for (const player of state.players) {
    const color = player.id === selfId ? playerColor : otherColor;
    for (let i = 0; i < player.snake.length; i++) {
      const segment = player.snake[i];
      const cyl = createSnakeSegment(segment.x, segment.y, color);

      // Alinhar o cilindro ao vetor de movimento (no plano XY)
      if (i > 0) {
        const posicaoAnterior = player.snake[i - 1];
        const dx = segment.x - posicaoAnterior.x;
        const dy = segment.y - posicaoAnterior.y;
        const angle = Math.atan2(dy, dx);
        cyl.rotation.z = angle;
      }

      scene.add(cyl);
      objects.push(cyl);
    }
  }

  const food = createFood(state.food.x, state.food.y);
  scene.add(food);
  objects.push(food);

  renderer.render(scene, camera);
}
