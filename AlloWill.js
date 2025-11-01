const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// --- PLAYER ---
const player = { x: 70, y: 100, w: 16, h: 16, speed: 1.2 };

// --- GAME STATE ---
let timeLeft = 60;
let gameOver = false;
let tasksDone = 0;
let requiredTasks = 3;

// --- INPUT ---
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// --- GAME LOOP ---
function update() {
  if (gameOver) return;

  // Déplacement
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;

  // Collision limites
  player.x = Math.max(0, Math.min(WIDTH - player.w, player.x));
  player.y = Math.max(0, Math.min(HEIGHT - player.h, player.y));

  // Timer
  timeLeft -= 1/60;
  if (timeLeft <= 0) endGame(false);

  // Check "tâches"
  if (player.x < 20 && player.y < 20 && tasksDone < requiredTasks) {
    tasksDone++;
    player.x = 70; player.y = 100; // Retour position
    if (tasksDone === requiredTasks) endGame(true);
  }
}

// --- DESSIN ---
function draw() {
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Joueur
  ctx.fillStyle = "#fff";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Timer
  ctx.fillStyle = "#f33";
  ctx.fillText(`Temps: ${Math.ceil(timeLeft)}`, 5, 10);
  ctx.fillText(`Tâches: ${tasksDone}/${requiredTasks}`, 5, 25);
}

// --- FIN DE PARTIE ---
function endGame(success) {
  gameOver = true;
  setTimeout(() => {
    alert(success ? "Tu as survécu !" : "Le monstre t’a attrapé !");
    document.location.reload();
  }, 500);
}

// --- LOOP ---
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
