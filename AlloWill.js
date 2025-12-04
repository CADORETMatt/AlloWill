const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let WIDTH = Math.min(window.innerWidth - 10, 500);
let HEIGHT = 500;
//Applique la taille interne authentique
canvas.width = WIDTH;
canvas.height = HEIGHT;
console.log("Canvas interne :", canvas.width, canvas.height);
let viewWidth = WIDTH;   // largeur de la fenêtre visible
let gameStarted = false;
// --- GAME STATE ---
let timeLeft = 60;                          //
let gameOver = false;                       //
let tasksDone = 0;                          //
let requiredTasks = 3;
// Gestion du clavier
const keys = { left: false, right: false, up: false, down: false, space: false };
//////function GestionTactile() {
let touchDir = null; // direction du doigt (angle, distance) 
let maxSpeed = 1.5;    // vitesse max du déplacement
// --- CURSOR ---
const cursor = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 1.5 };
let vitesseLampe = 6; // multiplicateur de vitesse lampe de poche
let vitesseCourse = 6; // vitesse en courant
//////////// Variables pour le défilement/////////////
let cameraX = 0;        // décalage horizontal de la "vue"
let exCamera = cameraX;                     //
const decorWidth = 1000; // largeur totale du décor
const edgeZone = 30;// distance au bord où le scrolling commence
let lastInputTime = 0;
let inactiveDelay = 200; // ms avant de considérer le joueur inactif
let clavierUse = false;
///////////    Recharge Partie   /////////////
let rafId = null;
//let isLoopRunning = false;
/*let timeLeft = 60; let gameOver = false; let tasksDone = 0; let cameraX = 0;
    const cursor = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 1.5 };
//////////////////////////////////////////////*/
//let frameNum = 0;
let lastTimestamp = performance.now();
let spriteFrame = 0;
const spriteFrameCount = 5;       // ajuster si nécessaire (nombre d'images dans la spritesheet)
let spriteAnimTimer = 0;
const spriteAnimInterval = 200;   // ms par frame
let spriteFrameWidth = 200;       // valeurs par défaut, recalculées après chargement
let spriteFrameHeight = 300;
//Options
let paused = false;
const pourcBord = 10;   // pourcentage de bordure
/////////// Gestion des boutons dans le canvas///////////
const buttons = [];
const couleurBtn = "#f1780eff";
const couleurBtnText = "#005510ff";
const bHeight = 40; // hauteur standard des boutons
// Positions prédéfinies selon un numéro d'emplacement
const buttonPositions = [
  null, // index 0 inutilisé
  { x: WIDTH * 0.25, y: 0, w: WIDTH * 0.25, h: bHeight }, // 1 : haut centre-gauche
  { x: WIDTH * 0.5, y: 0, w: WIDTH * 0.25, h: bHeight }, // 2 : haut centre-droite
  { x: WIDTH * 0.75, y: 0, w: WIDTH * 0.25, h: bHeight }, // 3 : haut droite
  { x: 0, y: HEIGHT - bHeight, w: WIDTH * 0.25, h: bHeight }, // 4 : bas gauche
  { x: WIDTH * 0.25, y: HEIGHT - bHeight, w: WIDTH * 0.25, h: bHeight }, // 5 : bas centre-gauche
  { x: WIDTH * 0.5, y: HEIGHT - bHeight, w: WIDTH * 0.25, h: bHeight }, // 6 : bas centre-droite
  { x: WIDTH * 0.75, y: HEIGHT - bHeight, w: WIDTH * 0.25, h: bHeight } // 7 : bas droite
];
let isImmobile = false;
let audioCtx = null;          // Le vrai moteur audio
const sounds = {};            // Dictionnaire : nom → AudioBuffer
const soundList = [
  { name: "neon", url: "Sons/NeonEntier.wav" },
  { name: "tension1", url: "Sons/tension1.wav" },
  { name: "glitch1", url: "Sons/glitch1.wav" }
];
const images = [];
const srcList = [
  'Asset1-1.bmp',
  'Hum1NB.png',
  'rond1000.png',
  'LogoMattMRKT.png',
  'HommeMattMRKT.png',
  'LogoHommeDetour.png',//images[5]
  'skelx5right.png',
  'skelx5left.png'
];
//skinPlayer.width = images[6].width;
//skinPlayer.height = images[6].height;
let loaded = 0;
//let PlayerImg = null; // <--- global !
console.log("Variables déclarées !")
showStartScreen();
chargMedia();
skinPlayer = images[6];
//PlayerImg = images[1];
console.log("Validation...");
Run();
function breakRun(projet) { return new Promise(License => setTimeout(License, projet)); }
async function Run() {
  waitForUserStart();
  console.log("logo :");
  await breakRun(457);
  async function realStartSequence() {
    console.log("Démarrage réel du jeu...");
    ///////////////////////////////////////////////////////////////////////
    playSound("neon", { fadeIn: 1, /*fadeOut: 1,*/ finSon: 3.7 });
    // Fade-out progressif
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    await breakRun(500); ///////Puis CLIc
    drawZoomOscill(images[3], 1);//ctx.drawImage(images[3], -WIDTH / 2, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    //ctx.fillRect(0, 203, WIDTH, HEIGHT);
    await fadeOutLogo(50);
    drawZoomOscill(images[3], 1);// ctx.drawImage(images[3], -WIDTH / 2, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    //  ctx.fillRect(0, 203, WIDTH, HEIGHT);
    await fadeOutLogo(50);
    drawZoomOscill(images[3], 1);//ctx.drawImage(images[3], -WIDTH / 2, 0);
    // Joue un premier son si tu veux :
    await breakRun(1000);
    playSound("tension1", { volume: 0.8, fadeIn: 2, fadeOut: 4 });
    await breakRun(500);
    // Appel : cycle complet (aller-retour)
    animatePingPong(images[3], 15, 6000);  // 2 secondes total
    await breakRun(400);
    await fadeOutLogo(50);
    drawZoomOscill(images[3], 1);
    await fadeOutLogo(50);
    drawZoomOscill(images[3], 1);
    await breakRun(500);
    await fadeOutLogo(100);
    drawZoomOscill(images[3], 1);
    await fadeOutLogo(100);
    drawZoomOscill(images[3], 1);
    await fadeOutLogo(100);
    drawZoomOscill(images[3], 1);
    await breakRun(3300);
    playSound("glitch1", { volume: 1, fadeOut: 1 });
    await breakRun(100);
    drawZoomOscill(images[4], 1);
    await fadeOutLogo(12);
    drawZoomOscill(images[4], 1);
    await fadeOutLogo(13);
    await breakRun(100);
    await fadeOutLogo(25);
    drawZoomOscill(images[4], 1);
    await fadeOutLogo(25);
    drawZoomOscill(images[4], 1.1);
    await fadeOutLogo(25);
    drawZoomOscill(images[4], 1.2);
    await fadeOutLogo(25);
    drawZoomOscill(images[4], 1.3);
    await fadeOutLogo(25);
    drawZoomOscill(images[4], 1.4);
    await breakRun(1000);
    await breakRun(2457);
    /////////////////////////////////////////////////////////////
    /*Algo - A PLACER
            ///////////////////////////////////////
            - // Créer un objet Image
            -
            ----------------------------------------
            ALGO
            ----------------------------------------
            *-ECRAN DE DEMARRAGE (LOGO breakRunDIGITALS)*/
    //        **fondu⁰⁰
    //*-MENU *******************************
    // --- INPUT ---
    GestionClavier();
    GestionTactile();
    ecouteTouchePause();
    createButton("F1-P:Pause", 7, () => {
      paused = !paused;   // ou paused = !paused pour toggle
      console.log("Toggle pause !");
    });
    createButton("Esp:Courir", 4, () => { keys.space = true; })
    //userInactif();
    function userInactif() {
      // Aucune activité utilisateur (clavier et tactile) donne true dans isImmobile
      if (!keys.left && !keys.right && !keys.up && !keys.down && !touchDir) {
        isImmobile = true;
      }
      else { isImmobile = false; }
      //setTimeout(userInactif, 1000); // vérifie toutes les secondes  
    }
    // --- GAME LOOP ---
    // debutPartie:
    loop();
    //// ///////////////////////////////////////////////////////
    ///           fadeOutLogo           ///////////////////////
    // ///////////////////////////////////////////////////////
    function animatePingPong(img, angleMax, duration) {
      const start = performance.now();
      requestAnimationFrame(loop);
      function loop(now) {
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        // t = 0→1 puis retour 1→0 → sinus
        const pingpong = Math.sin(t * Math.PI);
        const angle = pingpong * (angleMax * Math.PI / 180);
        drawZoomOscill(img, 1.15, angle);
        if (t < 1) requestAnimationFrame(loop);  // arrêt automatique
      }
    }

  }
  function waitForUserStart() {
    document.addEventListener("keydown", keyStart);
    canvas.addEventListener("touchstart", touchStart);
    function keyStart(e) {
      if (e.code === "Space") { clavierUse = true; startGame(); }
    }
    function touchStart() {
      startGame();
    }
    function startGame() {
      if (gameStarted) return;
      gameStarted = true;
      console.log("Clavier (!=Tactile) : ", clavierUse);
      // Débloque le contexte audio (= indispensable sur mobile)
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      document.removeEventListener("keydown", keyStart);
      canvas.removeEventListener("touchstart", touchStart);
      realStartSequence(); // On lance vraiment ton jeu
    }
  }
}
function loop(timestamp) {
  //if (isLoopRunning) return;  // Évite doublons
  //isLoopRunning = true;
  // ... code ...
  const now = timestamp || performance.now();
  const delta = now - lastTimestamp;
  lastTimestamp = now;
  // userInactif();
  if (!paused) {
    // si clavier et tactile inactifs, isImmobile = true
    if (!isImmobile) {
      update();
      // mise à jour de l'animation de la sprite selon le déplacement de la caméra
      updateSpriteAnimation(delta);
      draw();
    }
    defileTimerOrDie();
    //console.log("Aff. Loop/Timer.");
    Timer();
  } else {
    console.log("En pause : ", paused);
    drawPauseOverlay();
    affOptions();
  }
  rafId = requestAnimationFrame(loop);
  //requestAnimationFrame(loop);
}
function update() {
  if (gameOver) return;
  moveClavier();
  moveTactile();  // tactile orienté
  antiDefilPerm();
  screenWall();
  // Check "tâches"
  incTaskOrWin(); //cursor{}, tasksDone, requiredTasks, endGame()   
  //Demi-tour perso
  if (cursor.x >= WIDTH / 2 && skinPlayer == images[7]) skinPlayer = images[6];
  if (cursor.x < WIDTH / 2 && skinPlayer == images[6]) skinPlayer = images[7];
  /*  function FlipH(img) {
      ctx.save();
      ctx.translate(img.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }*/
}
function endGame(success) {
  if (gameOver) return;   // <-- stoppe les appels multiples
  gameOver = true;
  setTimeout(() => {
    alert(success ? "Tu as survécu!" : "Le monstre t’a attrapé!");
    changeGame();
    timeLeft = 60; gameOver = false; tasksDone = 0; cameraX = 0;
    //    cursor = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 1.5 };
    cursor.x = WIDTH / 2; cursor.y = HEIGHT / 2; cursor.speed = 1.5;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    // Relance une seule boucle propre
    lastTimestamp = performance.now();  // très important !
    rafId = requestAnimationFrame(loop);  // ← uniquement ici
  }, 500);
}
function changeGame() { //  marche pas !!
  // éclair
  console.log("Eclair !");
  ctx.fillStyle = "#ffffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (let i = 0; i < 10000; i += 1) { }
  //console.log("vitLmp : ", vitesseLampe, " c.speed : ", cursor.speed, "framMS : ", spriteAnimTimer);
}

function fadeOutLogo(duration = 1500) {
  return new Promise(resolve => {
    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // dessine le logo
      drawZoomOscill(images[3], 1); //ctx.drawImage(images[3], 0, 0);
      // couche noire qui augmente
      ctx.fillStyle = `rgba(0,0,0,${progress})`;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}
function draw() {
  // Calcul centrage et échelle
  const scaleDraw = 1;//Math.min(WIDTH / PlayerImg.width, HEIGHT / PlayerImg.height);
  const drawW = skinPlayer.width * scaleDraw;
  const drawH = skinPlayer.height * scaleDraw;
  const offsetX = (WIDTH - drawW) / 2;
  const offsetY = (HEIGHT - drawH) / 2;
  ctx.fillStyle = "#1a1a1a";
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  //  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // 1️⃣ Affiche l’image
  ctx.drawImage(
    images[0], cameraX, 0,          // zone du décor à afficher
    viewWidth, HEIGHT,   // portion du décor
    0, 0, WIDTH * 2, HEIGHT * 2  // position sur le canvas
  );// Dessiner uniquement la portion visible du décor*/
  ctx.globalCompositeOperation = "source-over"; // par défaut 
  //ctx.globalAlpha = 0.25;//opacité pour ombre personnage
  //ctx.globalAlpha = 1;
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
  ctx.globalAlpha = 0.6;
  ctx.drawImage(
    images[2], 500 - (cursor.x + cursor.w / 2), 500 - (cursor.y + cursor.h / 2),          // zone du décor à afficher
    WIDTH, HEIGHT,   // portion du décor
    0, 0, WIDTH, HEIGHT  // position sur le canvas
  );// Dessiner uniquement la portion visible du décor*/
  ctx.globalAlpha = 1;
  ctx.save();
  // Animation sprite sheet (images[6])
  // sourceX, sourceY, sourceW, sourceH, dx, dy, dw, dh
  const srcX = spriteFrame * spriteFrameWidth;
  ctx.drawImage(
    skinPlayer,
    srcX, 0, spriteFrameWidth, spriteFrameHeight,
    offsetX + 275, offsetY, drawW - 570, drawH + 100
  );
  //ctx.fillStyle = "rgba(4, 0, 60, 0.3)"; // obscurité
  //ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
}
//**JEU***********************************
/*       ***affichage décor
***Le joueur est au centre
  /*    ***DEPLACEMENTJOUEUR
       ****Assets
       ****AffBMP*/
// --- DESSIN ---
/****Effet lampe de poche
 ****Adrénaline et Endurance influt la vitesse    
 ***COLLISION
 ***ANIMATION
 ****Le décor change dans le noir
 ***INTERACTIIONS
 ****OBJETS DE DECOR
 ****TÂCHES
 ***MENU PAUSE*/
// **OPTIONS /*
//*** Vitesse Lampe de poche
//*** Vitesse Déplacement */
/* **EXIT 
 ***CREDITS
.        /////////////////////////////////////// */
async function loadSound(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
}
async function chargMedia() {
  srcList.forEach((src, i) => {
    const img = new Image();
    img.onload = () => {
      loaded++;
      if (loaded === srcList.length) {
        console.log("Toutes les images sont chargées !");
        // Si skinPlayer est une spritesheet, recalculer la taille d'une frame
        if (skinPlayer && skinPlayer.width && spriteFrameCount > 0) {
          spriteFrameWidth = Math.floor(skinPlayer.width / spriteFrameCount);
          spriteFrameHeight = skinPlayer.height;
          console.log("spriteFrameWidth =", spriteFrameWidth, "spriteFrameHeight =", spriteFrameHeight);
        }
      }
    };
    img.src = src;
    images[i] = img;
  });
  // ⚠️ Création du contexte audio seulement APRÈS interaction utilisateur
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // Chargement des sons WebAudio (async + await)
  for (let s of soundList) {
    sounds[s.name] = await loadSound(s.url);
    //console.log("Son chargé :", s.name);
  }
  console.log("Tous les médias (images + sons) sont prêts !");
}
function drawZoomOscill(img, zoomOscill, angle = 0) {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(zoomOscill, zoomOscill);
  ctx.drawImage(img, -WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
  ctx.restore();
}
function showStartScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Pour plus d'immersion :", canvas.width / 2, canvas.height / 2 - 100);
  ctx.fillText("F11 + Lumières éteintes", canvas.width / 2, canvas.height / 2 - 60);
  ctx.fillText("Appuyez sur ESPACE ou", canvas.width / 2, canvas.height / 2 + 60);
  ctx.fillText("Touchez pour COMMENCER", canvas.width / 2, canvas.height / 2 + 100);
}
/*function newGame() {
  continue debutPartie;
}*/
function playSound(name, options = {}) {
  const {
    volume = 1,
    fadeIn = 0,
    fadeOut = 0,
    debutSon = 0,
    playbackRate = 1,
    finSon = null
  } = options;

  if (!sounds[name]) {
    console.warn("Son inconnu :", name);
    return;
  }
  const src = audioCtx.createBufferSource();
  src.buffer = sounds[name];
  src.playbackRate.value = playbackRate;
  const gain = audioCtx.createGain();
  src.connect(gain).connect(audioCtx.destination);
  const nowAudio = audioCtx.currentTime;
  // ---------- DUREE ----------
  let duration = (finSon !== null)
    ? Math.max(0, finSon - debutSon)
    : Math.max(0, src.buffer.duration - debutSon);
  // empêcher les valeurs invalides
  if (duration <= 0) {
    duration = 0.001; // 1 ms, évite erreur stop-before-start
  }
  // empêcher fadeOut > durée
  const realFadeOut = Math.min(fadeOut, duration - 0.001);
  // ---------- FADE-IN ----------
  if (fadeIn > 0) {
    gain.gain.setValueAtTime(0, nowAudio);
    gain.gain.linearRampToValueAtTime(volume, nowAudio + fadeIn);
  } else {
    gain.gain.setValueAtTime(volume, nowAudio);
  }
  // ---------- LECTURE ----------
  src.start(nowAudio, debutSon, duration);
  // ---------- FADE-OUT ----------
  if (realFadeOut > 0) {
    const fadeStart = nowAudio + duration - realFadeOut;
    gain.gain.setValueAtTime(volume, fadeStart);
    gain.gain.linearRampToValueAtTime(0, fadeStart + realFadeOut);
    src.stop(fadeStart + realFadeOut);
  } else {
    src.stop(nowAudio + duration);
  }
  return { src, gain };
}
function GestionClavier() {  // const keys = { left: false, right: false, up: false, down: false, param: false };
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowUp") keys.up = true;
    if (e.key === "ArrowDown") keys.down = true;
    if (e.key === " " || e.key === "Space") keys.space = true;
  });
  window.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowUp") keys.up = false;
    if (e.key === "ArrowDown") keys.down = false;
    if (e.key === " " || e.key === "Space") keys.space = false;
  });
}
function GestionTactile() {
  canvas.addEventListener("touchstart", handleTouch);
  canvas.addEventListener("touchmove", handleTouch);
  canvas.addEventListener("touchend", () => touchDir = null);
  console.log("tactile ok");
}
function ecouteTouchePause() {
  window.addEventListener("keydown", e => {
    if (e.key === "Escape" || e.key === "F1" || e.key.toLowerCase() === "p" || e.key === "h" || e.key === "H") {
      e.preventDefault(); // empêche F1 d’ouvrir l’aide navigateur
      paused = !paused;
      if (!paused) loop(); // reprise
    }
  });
}
function handleTouch(e) {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  handlePointer(x, y);

  const dx = x - cursor.x;
  const dy = y - cursor.y;

  const dist = Math.hypot(dx, dy);
  const angleTouch = Math.atan2(dy, dx);

  const maxDist = WIDTH / 2;
  const intensity = Math.min(dist / maxDist + 0.5, 1);

  touchDir = { angleTouch, intensity };

  lastInputTime = performance.now();
}
function moveClavier() {
  if (keys.left || keys.right || keys.up || keys.down || keys.space) {
    lastInputTime = performance.now();
  }

  cursor.speed = keys.space ? vitesseCourse : maxSpeed;

  if (keys.left) cursor.x -= vitesseLampe * cursor.speed;
  if (keys.right) cursor.x += vitesseLampe * cursor.speed;
  if (keys.up) cursor.y -= vitesseLampe * cursor.speed;
  if (keys.down) cursor.y += vitesseLampe * cursor.speed;
}
function moveTactile() {
  if (!touchDir) return;

  lastInputTime = performance.now();

  const speed = maxSpeed * touchDir.intensity;
  cursor.x += Math.cos(touchDir.angleTouch) * speed;
  cursor.y += Math.sin(touchDir.angleTouch) * speed;
}
function screenWall() { //cursor{},viewWidth,HEIGHT
  cursor.x = Math.max(0, Math.min(viewWidth - cursor.w, cursor.x));
  cursor.y = Math.max(0, Math.min(HEIGHT - cursor.h, cursor.y));
}
function antiDefilPerm() {

  const now = performance.now();
  const isInactive = (now - lastInputTime) > inactiveDelay;
  console.log("vitLmp : ", vitesseLampe, " c.speed : ", cursor.speed, "framMS : ", spriteAnimTimer);
  // Si inactif → repousser le curseur hors des edgeZones
  if (isInactive) {
    if (cursor.x < edgeZone) cursor.x = edgeZone + 1;
    if (cursor.x > viewWidth - edgeZone) cursor.x = viewWidth - edgeZone - 1;
    return; // aucune tentative de scroll
  }

  // ----- ACTIVITÉ : SCROLL NORMAL -----

  // 1. Garder le curseur visible dans l'écran
  if (cursor.x < 0) cursor.x = 0;
  if (cursor.x > viewWidth - cursor.w) cursor.x = viewWidth - cursor.w;

  // 2. SCROLL GAUCHE
  if (cursor.x < edgeZone && cameraX > 0) {
    cameraX -= cursor.speed;
    if (cameraX < 0) cameraX = 0;
  }

  // 3. SCROLL DROITE
  if (cursor.x > viewWidth - edgeZone &&
    cameraX < decorWidth - viewWidth / 2) {
    cameraX += cursor.speed;
    if (cameraX > decorWidth - viewWidth / 2)
      cameraX = decorWidth - viewWidth / 2;
  }
}
function Timer() {
  ctx.font = "20px Georgia";
  ctx.fillStyle = "#f33";
  ctx.fillText(`Temps: ${Math.ceil(timeLeft)}`, 5, 20);//augmenté taille texte
  ctx.fillText(`Tâches: ${tasksDone}/${requiredTasks}`, 5, 40);
  drawButtons(buttons);
}
function defileTimerOrDie() {
  if (gameOver) return;
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
function drawPauseOverlay() {
  ctx.fillStyle = "#6d6d6d7b";
  ctx.fillRect(WIDTH * pourcBord / 100, HEIGHT * pourcBord / 100, WIDTH - (WIDTH * 2 * pourcBord / 100), HEIGHT - (HEIGHT * 2 * pourcBord / 100));
  ctx.fillStyle = "#015e0fff";
  ctx.font = "65px Georgia";
  ctx.fillText("⏸ Pause ", WIDTH / 2 - 140, (HEIGHT / 2) - 100);
  ctx.fillStyle = "#ff8400ff";
  ctx.font = "60px Georgia";
  ctx.fillText("⏸ Pause ", WIDTH / 2 - 130, (HEIGHT / 2) - 95);
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
  writeLine(3, "Echap/P/F1 : Pause");
  writeLine(4, "Espace : Courir");
}
function createButton(text, emplacement, action) {
  const pos = buttonPositions[emplacement];
  if (!pos) {
    console.warn("Emplacement inconnu :", emplacement);
    return;
  }
  const { x, y, w, h } = pos;
  // Stocker le bouton
  buttons.push({ text, x, y, w, h, action });
}
function drawButtons(buttons) {
  // Redessine tous les boutons
  for (const b of buttons) {
    ctx.fillStyle = couleurBtn;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = couleurBtnText;
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(b.text, b.x + 8, b.y + 12);
  };
}
// Détection clic/touch
function handlePointer(x, y) {
  for (const b of buttons) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      if (b.action) b.action();
      return;
    }
  }
}
function updateSpriteAnimation(deltaMs) {
  // si la caméra a bougé, faire avancer l'animation
  if (cameraX !== exCamera) {
    spriteAnimTimer += deltaMs;
    if (spriteAnimTimer >= spriteAnimInterval / (cursor.speed * cursor.speed)) {
      const step = Math.floor(spriteAnimTimer / spriteAnimInterval);
      spriteFrame = (spriteFrame + step) % spriteFrameCount;
      spriteAnimTimer %= spriteAnimInterval;
    }
  } else {
    // caméra immobile → frame de repos (0)
    spriteFrame = 0;
    spriteAnimTimer = 0;
  }
  exCamera = cameraX;
}
//  function enleveCouleur() {
// 1️⃣ Affiche l’image
//ctx.drawImage(images[1], offsetX, offsetY, drawW, drawH);
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
 ctx.putImageData(imageData, offsetX, offsetY);
}*/
/*function drawLampEffect() {
  const radius = 120;
  const innerRadius = 40; // rayon du cercle jaune central
  // 2️⃣ Découpe un cercle pour la lampe (optionnel, pour un trou clair)
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cursor.x + cursor.w / 2, cursor.y + cursor.h / 2, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
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
}*/