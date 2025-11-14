const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// --- GAME STATE ---
let timeLeft = 60;
let gameOver = false;
let tasksDone = 0;
let requiredTasks = 3;
// Gestion du clavier
const keys = { left: false, right: false, up: false, down: false };
// --- CURSOR ---
const cursor = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 1.1 };
let vitesseLampe = 6; // multiplicateur de vitesse lampe de poche
//Options
const pourcBord = 10;   // pourcentage de bordure
// Variables pour le défilement
let cameraX = 0;        // décalage horizontal de la "vue"
const viewWidth = WIDTH;   // largeur de la fenêtre visible
const decorWidth = 1000; // largeur totale du décor
const edgeZone = 30;          // distance au bord où le scrolling commence
//Chargement image décor
/*const Decor1 = new Image();      //VOIR DANS FUNCTION DRAW
Decor1.src = 'Asset1-1.bmp'; // Chemin vers BMP ou PNG
// image silhouette joueur
const PlayerImg = new Image();
// PlayerImg.crossOrigin = "anonymous"; // avant .src
PlayerImg.src = "./Hum1NB.png";
*/
const images = [];
const srcList = [
  'Asset1-1.bmp',
  "./Hum1NB.png"
];
let loaded = 0;
srcList.forEach((src, i) => {
  const img = new Image();
  img.onload = () => {
    loaded++;
    if (loaded === srcList.length) {
      console.log("Toutes les images sont chargées !");
    }
  };
  img.src = src;
  images[i] = img;
});
const PlayerImg = images[1];
let indAttente = 0;
while (indAttente < 10000) { indAttente++; }
/*Algo - A PLACER
        ///////////////////////////////////////
        - // Créer un objet Image
        -
        ----------------------------------------
        ALGO
        ----------------------------------------
        *-ECRAN DE DEMARRAGE (LOGO MATTMARKETDIGITALS)*/
alert("Push on keyboard for start");
//        **fondu
//*-MENU *******************************
// --- INPUT ---
GestionClavier();
//////function GestionTactile() {
let touchDir = null; // direction du doigt (angle, distance) 
let maxSpeed = 4;    // vitesse max du déplacement

canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("touchmove", handleTouch);
canvas.addEventListener("touchend", () => touchDir = null);
// --- GAME LOOP ---
function update() {
  if (gameOver) return;
  moveClavier();
  // tactile orienté
  if (touchDir) {
    const speed = maxSpeed * touchDir.intensity;
    cursor.x += Math.cos(touchDir.angle) * speed;
    cursor.y += Math.sin(touchDir.angle) * speed;
  }
  // Garder le joueur dans la vue (mais déclencher le défilement)
  antiDefilPerm();
  screenWall();
  defileTimerOrDie();
  // Check "tâches"
  incTaskOrWin(); //cursor{}, tasksDone, requiredTasks, endGame()   
}
//**JEU***********************************
/*     ***INPUT
       ***Le joueur est au centre
*/
/*     ***écran à 1000x250
       ***affichage décor
       ****Assets
       ****AffBMP*/
// --- DESSIN ---

function draw() {

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  //  PlayerImg.onload = () => {
  // Calcul centrage et échelle
  const scale = 1;//Math.min(WIDTH / PlayerImg.width, HEIGHT / PlayerImg.height);
  const drawW = PlayerImg.width * scale;
  const drawH = PlayerImg.height * scale;
  const offsetX = (WIDTH - drawW) / 2;
  const offsetY = (HEIGHT - drawH) / 2;
  //console.log("WIDTH HEIGHT de PlayerImg", PlayerImg.width, PlayerImg.height);
  //console.log(PlayerImg, offsetX, offsetY, drawW, drawH);

  // 1️⃣ Affiche l’image
  ctx.drawImage(
    images[0],
    cameraX, 0,          // zone du décor à afficher
    viewWidth, HEIGHT,   // portion du décor
    0, 0, WIDTH * 2, HEIGHT * 2  // position sur le canvas
  );
  // Dessiner uniquement la portion visible du décor*/
  ctx.globalCompositeOperation = "source-over"; // par défaut 
  ctx.globalAlpha = 0.25;
  ctx.drawImage(PlayerImg, offsetX, offsetY + 50, drawW, drawH);
  ctx.globalAlpha = 1;

  //console.log("dans draw");

  // 1️⃣ Affiche l’image
  //ctx.drawImage(PlayerImg, offsetX, offsetY, drawW, drawH);
  /* // 2️⃣ Lit ses pixels
   const imageData = ctx.getImageData(offsetX, offsetY, drawW, drawH);
   const data = imageData.data;
   // 3️⃣ Modifie chaque pixel
   for (let i = 0; i <
     data.length; i += 4) {
     console.log("data[i] r=", data[i]);
     const r = data[i];
     if (r > 200) {
       data[i + 3] = 0; // transparent
     } else {

      data[i] = 0; data[i + 1] = 0; data[i + 2] = 0;
       data[i + 3] = 64; // noir à 25%
     }
   }
   // 4️⃣ Réécrit les pixels modifiés
   ctx.putImageData(imageData, offsetX, offsetY);*/

  // Dessiner uniquement la portion visible du décor*/
  /*ctx.drawImage(Decor1,
    cameraX, 0, viewWidth / 2, HEIGHT / 2, // source (partie du décor)
    0, 0, viewWidth, HEIGHT        // destination (sur la "vue")
  );*/

  // LightTarget
  ctx.fillStyle = "#fff";
  ctx.fillRect(cursor.x, cursor.y, cursor.w, cursor.h);

  //newPage();

  /////////// Player

  //Dessin effet lampe de poche
  const radius = 120;
  ctx.save();//sauvegarde état
  ctx.fillStyle = "rgba(4, 0, 60, 0.8)"; // obscurité
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.globalCompositeOperation = "destination-out";// découpe cercle
  ctx.beginPath();
  ctx.arc(cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.25;
  ctx.restore();//restaure état
  // ctx.globalCompositeOperation = "source-over";
  //ctx.fillStyle = "rgba(242, 254, 8, 0)"; // zone éclairée
  //ctx.beginPath();
  //ctx.arc(cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, radius, 0, Math.PI * 2);
  //ctx.fill();
  //  ctx.fillRect(0, 0, viewWidth, HEIGHT);
  /*
  const radius = 120;
  const innerRadius = 40; // rayon du cercle jaune central

  // 1️⃣ Fond bleu nuit semi-transparent
  ctx.fillStyle = "rgba(22, 6, 249, 0.3)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 2️⃣ Découpe un cercle pour la lampe (optionnel, pour un trou clair)
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3️⃣ Cercle jaune central
  ctx.fillStyle = "rgba(242, 254, 8, 0.6)";
  ctx.beginPath();
  ctx.arc(cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, innerRadius, 0, Math.PI * 2);
  ctx.fill();

  // 4️⃣ Dégradé bleu autour du jaune
  const grad = ctx.createRadialGradient(
    cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, innerRadius,
    cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, radius
  );
  grad.addColorStop(0, "rgba(242, 254, 8, 0.0)"); // transition douce
  grad.addColorStop(1, "rgba(22, 6, 249, 0.4)"); // bleu nuit
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, radius, 0, Math.PI * 2);
  ctx.fill();
*/


  // Timer
  ctx.font = "20px Georgia";
  ctx.fillStyle = "#f33";
  ctx.fillText(`Temps: ${Math.ceil(timeLeft)}`, 5, 20);//augmenté taille texte
  ctx.fillText(`Tâches: ${tasksDone}/${requiredTasks}`, 5, 40);


  /*    ***DEPLACEMENTJOUEUR
  //    ***affichage 250x250 */
  // Variables pour le défilement
  //Adaptation mobile
  //const ratio = 1000 / 250; //  décor d’origine
  // Si la largeur dépasse l’écran, on réduit
  if (viewWidth > window.innerWidth) {
    viewWidth = window.innerWidth;
    //HEIGHT = WIDTH * ratio;
  }
}



/****Effet lampe de poche
 ****Adrénaline et Endurance influt la vitesse    
 ***COLLISION
 ***ANIMATION
 ****Le décor change dans le noir
 ***INTERACTIIONS
 ****OBJETS DE DECOR
 ****TÂCHES
 ***MENU PAUSE*/
let paused = false;
window.addEventListener("keydown", e => {
  if (e.key === "Escape" || e.key === "F1" || e.key.toLowerCase() === "p" || e.key === "h" || e.key === "H") {
    e.preventDefault(); // empêche F1 d’ouvrir l’aide navigateur
    paused = !paused;
    if (!paused) loop(); // reprise
  }
});
/*
 **OPTIONS
***Vitesse Lampe de poche
***Vitesse Déplacement*/

/* **EXIT 
 ***CREDITS
.        ///////////////////////////////////////
 */

// --- FIN DE PARTIE ---
function endGame(success) {
  gameOver = true;
  setTimeout(() => {
    alert(success ? "Tu as survécu!" : "Le monstre t’a attrapé!");
    document.location.reload();
  }, 500);
}

// --- LOOP ---
/*function loop() {
  update();
  if (paused) return; // on sort de la boucle sans refaire de frame
  draw();
  requestAnimationFrame(loop);
}
loop();
*/
function loop() {
  if (!paused) {
    update();
    draw();
    requestAnimationFrame(loop);
  } else {
    drawPauseOverlay();
    affOptions();
  }
}
loop();

function GestionClavier() {  // const keys = { left: false, right: false, up: false, down: false, param: false };
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowUp") keys.up = true;
    if (e.key === "ArrowDown") keys.down = true;
    //  if (e.key === "h") keys.param = true;

  });
  window.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowUp") keys.up = false;
    if (e.key === "ArrowDown") keys.down = false;
  });
}

function handleTouch(e) {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  // coordonnées relatives au centre
  const dx = x - WIDTH / 2;
  const dy = y - HEIGHT / 2;

  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);

  // on limite la distance max (500/2 = rayon max)
  const maxDist = WIDTH / 2;
  const intensity = Math.min(dist / maxDist, 1); // entre 0 et 1

  touchDir = { angle, intensity };
}

function moveClavier() {
  //const cursor = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 3.1 };
  if (keys.left) cursor.x -= vitesseLampe * cursor.speed;
  if (keys.right) cursor.x += vitesseLampe * cursor.speed;
  if (keys.up) cursor.y -= vitesseLampe * cursor.speed;
  if (keys.down) cursor.y += vitesseLampe * cursor.speed;
}

function screenWall() { //cursor{},viewWidth,HEIGHT
  cursor.x = Math.max(0, Math.min(viewWidth - cursor.w, cursor.x));
  cursor.y = Math.max(0, Math.min(HEIGHT - cursor.h, cursor.y));
}

function defileTimerOrDie() { //timeLeft, endGame()
  timeLeft -= 1 / 60;
  if (timeLeft <= 0) endGame(false);
}

function incTaskOrWin() {
  if (cursor.x < 20 && cursor.y < 20 && tasksDone < requiredTasks) {
    tasksDone++;
    cursor.x = 70; cursor.y = 100; // Retour position
    if (tasksDone === requiredTasks) endGame(true);
  }
}

/*function newPage() {
  ctx.fillStyle = "#6d6d6d7b";
  ctx.fillRect(WIDTH * 10 / 100, 10, 400, 400);
}*/

function drawPauseOverlay() {
  ctx.fillStyle = "#6d6d6d7b";
  ctx.fillRect(WIDTH * pourcBord / 100, HEIGHT * pourcBord / 100, WIDTH - (WIDTH * 2 * pourcBord / 100), HEIGHT - (HEIGHT * 2 * pourcBord / 100));
  ctx.fillStyle = "#015e0fff";
  ctx.font = "65px Georgia";
  ctx.fillText("⏸ Pause ", 120, (HEIGHT / 2) - 100);
  ctx.fillStyle = "#ff8400ff";
  ctx.font = "60px Georgia";
  ctx.fillText("⏸ Pause ", 130, (HEIGHT / 2) - 95);
}

function writeLine(numLigne, text) {
  //const totalLignes = 10; // nombre total de lignes
  const marginTop = 20;     // marge avant la 1re ligne
  const lineHeight = 40;    // espacement vertical entre lignes
  const hautLigne = 200; // haut du contenneur de texte

  ctx.font = "20px Arial"; ctx.fillStyle = "white"; ctx.textAlign = "left"; ctx.textBaseline = "top";
  /*/ Sécurité : éviter les lignes hors limite ; if (numLigne < 1) numLigne = 1; if (numLigne > totalLignes) numLigne = totalLignes;*/
  // Calcul de la position verticale
  const y = marginTop + (numLigne - 1) * lineHeight;

  ctx.fillText(text, 2 * WIDTH * pourcBord / 100, y + hautLigne);
}

function affOptions() {
  writeLine(1, "Avancez ou reculez :");
  writeLine(2, "Flèches directionnelles");
  writeLine(3, "Echap/P/F1/H : ");
  writeLine(4, "Reprendre le jeu");
}

function creatButton(text, x, y, w, h, onClick) {
  ctx.fillStyle = "#333";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(text, x + 10, y + 10);
  canvas.addEventListener("click", function handler(event) { })
}

function antiDefilPerm() {
  if (cursor.x < edgeZone - 17 && keys.left === false && keys.right === false) cursor.x += cursor.speed; // cursor reste sur place
  if (cursor.x > viewWidth - edgeZone && keys.left === false && keys.right === false) cursor.x -= cursor.speed; // cursor reste sur place
  if (cursor.x < edgeZone - 17 && cameraX > 0) {
    cameraX -= cursor.speed; // défilement à gauche
  } else if (cursor.x > viewWidth - edgeZone && cameraX < decorWidth - viewWidth / 2) {
    cameraX += cursor.speed; // défilement à droite
    if (cameraX > decorWidth - viewWidth / 2) cameraX = decorWidth - viewWidth / 2;
  }
}
