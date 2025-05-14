import * as THREE from 'three';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let spheres: THREE.Mesh[] = [];
let player: THREE.Mesh;

const SPHERE_RADIUS = 0.5;
const PLAYER_RADIUS = 1; // Rayon du seau circulaire
const PLAYER_HEIGHT = 0.5;
const SPHERE_SPEED = 0.03;
const PLAYER_SPEED = 0.1;

const GAME_AREA_WIDTH = 10;
const GAME_AREA_HEIGHT = 5;
const GAME_AREA_DEPTH = 10;

let score = 0;
let lives = 3;
let gameLoopId: number;
let sphereIntervalId: NodeJS.Timeout;
let keysPressed: { [key: string]: boolean } = {};
let currentSphereCount = 1; // Nombre de sphères par vague

function initScene(canvas: HTMLCanvasElement) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 900);
    camera.position.set(0, GAME_AREA_HEIGHT + 3, 0);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const groundGeometry = new THREE.PlaneGeometry(GAME_AREA_WIDTH * 2, GAME_AREA_DEPTH * 2);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -PLAYER_HEIGHT / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Seau circulaire (cylindre)
    const playerGeometry = new THREE.CylinderGeometry(PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_HEIGHT, 32);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xFF8C00 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, 0, 0);
    player.castShadow = true;
    scene.add(player);

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
    });

    return { scene, camera, renderer, player };
}

function addSphere() {
    const sphereGeometry = new THREE.SphereGeometry(SPHERE_RADIUS, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = (Math.random() - 0.5) * (GAME_AREA_WIDTH - SPHERE_RADIUS * 2);
    sphere.position.y = GAME_AREA_HEIGHT;
    sphere.position.z = (Math.random() - 0.5) * (GAME_AREA_DEPTH - SPHERE_RADIUS * 2);
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    spheres.push(sphere);
    scene.add(sphere);
}

function animate(onScoreUpdate?: (newScore: number) => void, onLivesUpdate?: (newLives: number) => void, onGameOver?: (finalScore: number) => void) {
    gameLoopId = requestAnimationFrame(() => animate(onScoreUpdate, onLivesUpdate, onGameOver));

    // Mouvement du joueur
    if (keysPressed['ArrowLeft']) {
        player.position.x = Math.max(-GAME_AREA_WIDTH / 2 + PLAYER_RADIUS, player.position.x - PLAYER_SPEED);
    }
    if (keysPressed['ArrowRight']) {
        player.position.x = Math.min(GAME_AREA_WIDTH / 2 - PLAYER_RADIUS, player.position.x + PLAYER_SPEED);
    }
    if (keysPressed['ArrowUp']) {
        player.position.z = Math.max(-GAME_AREA_DEPTH / 2 + PLAYER_RADIUS, player.position.z - PLAYER_SPEED);
    }
    if (keysPressed['ArrowDown']) {
        player.position.z = Math.min(GAME_AREA_DEPTH / 2 - PLAYER_RADIUS, player.position.z + PLAYER_SPEED);
    }

    // Gestion des sphères
    for (let i = spheres.length - 1; i >= 0; i--) {
        const sphere = spheres[i];
        sphere.position.y -= SPHERE_SPEED;

        // Collision avec le joueur (cercle à cercle)
        const dx = sphere.position.x - player.position.x;
        const dz = sphere.position.z - player.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const collisionDistance = SPHERE_RADIUS + PLAYER_RADIUS;

        if (distance < collisionDistance && Math.abs(sphere.position.y - player.position.y) < PLAYER_HEIGHT) {
            scene.remove(sphere);
            spheres.splice(i, 1);
            score++;
            if (onScoreUpdate) onScoreUpdate(score);
            continue;
        }

        // Sphère hors jeu
        if (sphere.position.y < -SPHERE_RADIUS * 2) {
            scene.remove(sphere);
            spheres.splice(i, 1);
            lives--;
            if (onLivesUpdate) onLivesUpdate(lives);
            if (lives <= 0) {
                if (onGameOver) onGameOver(score);
                stopGame();
            }
        }
    }

    renderer.render(scene, camera);
}

function startGame(
    canvas: HTMLCanvasElement,
    config: { sphereCount: number, initialScore?: number },
    onScoreUpdate: (newScore: number) => void,
    onLivesUpdate: (newLives: number) => void,
    onGameOver: (finalScore: number) => void
) {
    if (!renderer) {
        initScene(canvas);
    }

    score = config.initialScore || 0;
    lives = 3;
    currentSphereCount = config.sphereCount;

    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    if (sphereIntervalId) {
        clearInterval(sphereIntervalId);
    }

    // Ajout dynamique des sphères
    sphereIntervalId = setInterval(() => {
        for (let i = 0; i < currentSphereCount; i++) {
            setTimeout(() => addSphere(), i * 1000);
        }
    }, 5000);

    animate(onScoreUpdate, onLivesUpdate, onGameOver);
}

function updateSphereCount(newSphereCount: number) {
    currentSphereCount = newSphereCount;
}

function stopGame() {
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    if (sphereIntervalId) {
        clearInterval(sphereIntervalId);
    }
}

function resizeRendererToDisplaySize(rendererInstance: THREE.WebGLRenderer) {
    const canvas = rendererInstance.domElement;
    const width = 800;
    const height = 600;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        rendererInstance.setSize(width, height, false);
        camera.updateProjectionMatrix();
    }
    return needResize;
}

export { initScene, startGame, stopGame, resizeRendererToDisplaySize, addSphere, updateSphereCount };