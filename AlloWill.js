// Version optimisée du moteur, sans modifier ta fonction draw()
// ----------------------------------------------------------------------
// Architecture propre : Update / Input / Boutons / State Machine
// Le contenu de draw() reste 100% intact
// ----------------------------------------------------------------------

// === CANVAS ===
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let WIDTH = Math.min(window.innerWidth, 500);
let HEIGHT = 500;
canvas.width = WIDTH;
canvas.height = HEIGHT;
let viewWidth = WIDTH;

// === ETAT DU JEU ===
let paused = false;
let gameOver = false;
let timeLeft = 60;
let tasksDone = 0;
let requiredTasks = 3;

// === CURSOR / PLAYER ===
const cursor = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 2 };

// === SCROLLING ===
let cameraX = 0;
const decorWidth = 1000;
const edgeZone = 30;

// === INPUT STATE ===
const keys = { left: false, right: false, up: false, down: false, run: false };
let touchDir = null;
let baseSpeed = 2;
let speedMultiplier = 6;
let touchSpeed = 8;

// === BOUTONS ===
const buttons = [];
const couleurBtn = "#f1780eff";
const couleurBtnText = "#005510ff";
const bHeight = 40;

const buttonPositions = [null,
  { x: WIDTH * 0.25, y: 0, w: WIDTH * 0.25, h: bHeight },
  { x: WIDTH * 0.50, y: 0, w: WIDTH * 0.25, h: bHeight },
  { x: WIDTH * 0.75, y: 0, w: WIDTH * 0.25, h: bHeight },
  { x: 0, y: HEIGHT - bHeight, w: WIDTH * 0.25, h: bHeight },
  { x: WIDTH * 0.25, y: HEIGHT - bHeight, w: WIDTH * 0.25, h: bHeight },
  { x: WIDTH * 0.50, y: HEIGHT - bHeight, w: WIDTH * 0.25, h: bHeight },
  { x: WIDTH * 0.75, y: HEIGHT - bHeight, w: WIDTH * 0.25, h: bHeight }
];

// === IMAGES ===
const images = [];
const srcList = ["Asset1-1.bmp", "Hum1NB.png", "rond1000.png"];
let loaded = 0;

function loadImages() {
  srcList.forEach((src, i) => {
    const img = new Image();
    img.onload = () => {
      loaded++;
      if (loaded === srcList.length) console.log("Toutes les images chargées !");
    };
    img.src = src;
    images[i] = img;
  });
}
loadImages();
const PlayerImg = images[1];

// ----------------------------------------------------------------------
// INPUT SYSTEM : listeners propres
// ----------------------------------------------------------------------

window.addEventListener("keydown", e => handleKey(e, true));
window.innerWidth
window.addEventListener("keyup", e => handleKey(e, false));

function handleKey(e, isDown) {
  const k = e.key.toLowerCase();
  if (k === "arrowleft") keys.left = isDown;
  if (k === "arrowright") keys.right = isDown;
  if (k === "arrowup") keys.up = isDown;
  if (k === "arrowdown") keys.down = isDown;
  if (k === " ") keys.run = isDown;
  if (k === "escape" || k === "p") togglePause();
}

// --- TACTILE ---
canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("touchmove", handleTouch);
canvas.addEventListener("touchend", () => touchDir = null);

function handleTouch(e) {
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = t.clientX - rect.left;
  const y = t.clientY - rect.top;
  handlePointer(x, y);

  // direction
  const dx = x - WIDTH / 2;
  const dy = y - HEIGHT / 2;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const intensity = Math.min(dist / (WIDTH / 2), 1);
  touchDir = { angle, intensity };
}

// ----------------------------------------------------------------------
// BOUTONS DANS CANVAS
// ----------------------------------------------------------------------

function createButton(text, emplacement, action) {
  const pos = buttonPositions[emplacement];
  if (!pos) return;
  buttons.push({ text, action, ...pos, visible: true });
}

function drawButtons() {
  buttons.forEach(b => {
    if (!b.visible) return;
    ctx.fillStyle = couleurBtn;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = couleurBtnText;
    ctx.font = "20px Arial";
    ctx.fillText(b.text, b.x + 8, b.y + 10);
  });
}

function handlePointer(x, y) {
  for (const b of buttons) {
    if (!b.visible) continue;
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      if (b.action) b.action();
      return;
    }
  }
}

// ----------------------------------------------------------------------
// GAME STATE MACHINE
// ----------------------------------------------------------------------

function togglePause() {
  paused = !paused;
}

// ----------------------------------------------------------------------
// UPDATE : logique du jeu (draw est laissé intact)
// ----------------------------------------------------------------------

function update() {
  if (paused || gameOver) return;

  // --- MOVE CLAVIER ---
  let spd = baseSpeed * speedMultiplier;
  if (keys.run) spd *= 2;

  if (keys.left) cursor.x -= spd;
  if (keys.right) cursor.x += spd;
  if (keys.up) cursor.y -= spd;
  if (keys.down) cursor.y += spd;

  // --- MOVE TACTILE ---
  if (touchDir) {
    cursor.x += Math.cos(touchDir.angle) * touchSpeed * touchDir.intensity;
    cursor.y += Math.sin(touchDir.angle) * touchSpeed * touchDir.intensity;
  }

  // --- LIMITES ---
  cursor.x = Math.max(0, Math.min(viewWidth - cursor.w, cursor.x));
  cursor.y = Math.max(0, Math.min(HEIGHT - cursor.h, cursor.y));

  // --- SCROLLING ---
  if (cursor.x < edgeZone && cameraX > 0) {
    cameraX -= cursor.speed;
  } else if (cursor.x > viewWidth - edgeZone && cameraX < decorWidth - viewWidth) {
    cameraX += cursor.speed;
  }

  // --- TIMER ---
  timeLeft -= 1 / 60;
  if (timeLeft <= 0) endGame(false);

  // --- TÂCHES ---
  if (cursor.x < 20 && cursor.y < 20 && tasksDone < requiredTasks) {
    tasksDone++;
    cursor.x = 70;
    cursor.y = 100;
    if (tasksDone === requiredTasks) endGame(true);
  }
}

function endGame(success) {
  gameOver = true;
  setTimeout(() => {
    alert(success ? "Tu as survécu!" : "Le monstre t’a attrapé!");
    document.location.reload();
  }, 500);
}

// ----------------------------------------------------------------------
// LOOP (draw reste intact dans ton script principal)
// ----------------------------------------------------------------------
function loop() {
  update();
  draw();       // <-- Ta fonction d'origine 100% conservée
  drawButtons();
  requestAnimationFrame(loop);
}
loop();
function draw() {
  // Calcul centrage et échelle
  const scale = 1;//Math.min(WIDTH / PlayerImg.width, HEIGHT / PlayerImg.height);
  const drawW = PlayerImg.width * scale;
  const drawH = PlayerImg.height * scale;
  const offsetX = (WIDTH - drawW) / 2;
  const offsetY = (HEIGHT - drawH) / 2;

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // 1️⃣ Affiche l’image
  ctx.drawImage(
    images[0], cameraX, 0,          // zone du décor à afficher
    viewWidth, HEIGHT,   // portion du décor
    0, 0, WIDTH * 2, HEIGHT * 2  // position sur le canvas
  );// Dessiner uniquement la portion visible du décor*/
  ctx.globalCompositeOperation = "source-over"; // par défaut 
  ctx.globalAlpha = 0.25;//opacité pour ombre personnage
  ctx.drawImage(PlayerImg, offsetX, offsetY + 50, drawW, drawH);
  ctx.globalAlpha = 1;
  // LightTarget
  ctx.fillStyle = "#ffffff00";
  ctx.fillRect(cursor.x, cursor.y, cursor.w, cursor.h);
  //Dessin effet lampe de poche
  const radius = 120;
  //ctx.save();//sauvegarde état
  ctx.fillStyle = "rgba(4, 0, 60, 0.8)"; // obscurité
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "rgba(242, 254, 8, 0.2)"; // zone éclairée
  ctx.beginPath();
  ctx.arc(cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.8;
  ctx.drawImage(
    images[2], 500 - (cursor.x + cursor.w / 2), 500 - (cursor.y + cursor.h / 2),          // zone du décor à afficher
    WIDTH, HEIGHT,   // portion du décor
    0, 0, WIDTH, HEIGHT  // position sur le canvas
  );// Dessiner uniquement la portion visible du décor*/
  ctx.globalAlpha = 1;
  // Timer
  ctx.font = "20px Georgia";
  ctx.fillStyle = "#f33";
  ctx.fillText(`Temps: ${Math.ceil(timeLeft)}`, 5, 20);//augmenté taille texte
  ctx.fillText(`Tâches: ${tasksDone}/${requiredTasks}`, 5, 40);
  createButton("F1-P: Pause", 7, () => {
    paused = !paused;   // ou paused = !paused pour toggle
    console.log("Toggle pause !");
  });
}
