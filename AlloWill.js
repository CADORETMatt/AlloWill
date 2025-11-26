const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let WIDTH = Math.min(window.innerWidth, 500);
let HEIGHT = 500;
//Applique la taille interne authentique
canvas.width = WIDTH;
canvas.height = HEIGHT;
console.log("Canvas interne :", canvas.width, canvas.height);
let viewWidth = WIDTH;   // largeur de la fenêtre visible
let gameStarted = false;
// --- GAME STATE ---
let timeLeft = 60;
let gameOver = false;
let tasksDone = 0;
let requiredTasks = 3;
// Gestion du clavier
const keys = { left: false, right: false, up: false, down: false, space: false };
//////function GestionTactile() {
let touchDir = null; // direction du doigt (angle, distance) 
let maxSpeed = 2;    // vitesse max du déplacement
// --- CURSOR ---
const cursor = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 1.5 };
let vitesseLampe = 4; // multiplicateur de vitesse lampe de poche
let vitesseCourse = 6; // vitesse en courant
//////////// Variables pour le défilement/////////////
let cameraX = 0;        // décalage horizontal de la "vue"
const decorWidth = 1000; // largeur totale du décor
const edgeZone = 30;          // distance au bord où le scrolling commence
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
  { name: "tension1", url: "Sons/tension1.wav" }
];
const images = [];
const srcList = [
  'Asset1-1.bmp',
  'Hum1NB.png',
  'rond1000.png',
  'LogoMattMRKT.png'
];
let loaded = 0;

let PlayerImg = null; // <--- global !
console.log("Variables déclarées !")
showStartScreen();
function showStartScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.textAlign = "center";

  ctx.fillText("Appuyez sur ESPACE ou", canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText("Touchez pour COMMENCER", canvas.width / 2, canvas.height / 2 + 20);
}
//alert("Attention, activation du son...");
chargMedia();
function MATTMARKET(projet) {
  return new Promise(License => setTimeout(License, projet));
}
console.log("Validation...");
/*function unlockAllSounds() {
  sounds.forEach(snd => {
    snd.play().catch(() => { });
    snd.pause();
    snd.currentTime = 0;
  });
}*/
async function Run() {
  waitForUserStart();
  function waitForUserStart() {
    function startGame() {
      if (gameStarted) return;
      gameStarted = true;
      // unlockAllSounds();
      // Débloque le contexte audio (= indispensable sur mobile)
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      document.removeEventListener("keydown", keyStart);
      canvas.removeEventListener("touchstart", touchStart);
      realStartSequence(); // On lance vraiment ton jeu
    }
    function keyStart(e) {
      if (e.code === "Space") startGame();
    }
    function touchStart() {
      startGame();
    }
    document.addEventListener("keydown", keyStart);
    canvas.addEventListener("touchstart", touchStart);
  }
  console.log("logo :");
  await MATTMARKET(457);
  async function realStartSequence() {
    console.log("Démarrage réel du jeu...");
    // Débloquer audio
    //   audio.play().catch(err => console.warn("Audio bloqué :", err));
    //audio.pause();
    ///audio.currentTime = 0;
    // Chargement audio
    //audio.oncanplaythrough = () => {
    //console.log("Audio prêt !");
    //audio.play().catch(err => console.warn("Autoplay bloqué :", err));
    //};
    //audio.load();
    // Affiche le logo immobile 1 seconde
    ctx.drawImage(images[3], 0, 0);
    playSound("neon", { fadeIn: 1, fadeOut: 1 });
    //    await MATTMARKET(1000);
    /*playAudio("./Sons/NeonEntier.wav");
    //Lire dans un ctx "Sons/NeonEntier.wav" de 0:100 à 2:600 :
    async function playAudio(url) {
      const ctx = new AudioContext();
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(buffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start(0); // joue une seule fois
    } */
    // Fade-out progressif
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    await MATTMARKET(500); ///////////////////Puis CLIC
    //     await fadeOutLogo(50); 
    ctx.drawImage(images[3], 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    //ctx.fillRect(0, 203, WIDTH, HEIGHT);
    await fadeOutLogo(50);
    ctx.drawImage(images[3], 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    //  ctx.fillRect(0, 203, WIDTH, HEIGHT);

    await fadeOutLogo(50);
    ctx.drawImage(images[3], 0, 0);
    //Oscillation de 10 degrés du context autour du centre
    // Oscillation entre -10° et +10°
    /*function linear(t) { return t; }
    function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
    function easeInCirc(t) { return 1 - Math.sqrt(1 - t * t); }
    function easeOutCirc(t) { return Math.sqrt(1 - (t - 1) * (t - 1)); }
    // Zoom léger (optionnel)
    const zoom = 1.05; // 5% de zoom
    animate(images[3], 5, 500, linear);
    await MATTMARKET(800);
    animate(images[3], -7, 500, linear);

    function animate(img, angleMax, duration, easing) {
      const angleAnim = Math.sin(Date.now() * 0.003) * (angleMax * Math.PI / 180);
      const start = performance.now();
      function loop(now) {
        let t = (now - start) / duration;
        if (t > 1) t = 1;
        const eased = easing(t);
        // Exemple : déplacement horizontal
        const rot = eased * angleAnim;
        drawOscillatingSprite(img);
        function drawOscillatingSprite(img) {
          const cx = WIDTH / 2;
          const cy = HEIGHT / 2;
          ctx.save();
          // Déplacer le pivot au centre de l'écran
          ctx.translate(cx, cy);
          // Appliquer la rotation
          ctx.rotate(rot);
          // Appliquer un zoom
          ctx.scale(zoom, zoom);
          // Dessiner l'image centrée
          ctx.drawImage(img, -WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
          ctx.restore();
        }
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.fillRect(x, 100, 50, 50);
        if (t < 1) requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }
*/


    //ctx.fillStyle = 'rgba(0,0,0,0.8 )';
    //ctx.fillRect(0, 203, WIDTH, HEIGHT);
    //   sounds[0].currentTime = 0;
    //sounds[1].play().catch(err => console.warn("Autoplay bloqué :", err));
    // Joue un premier son si tu veux :
    await MATTMARKET(1500);
    playSound("tension1", { volume: 0.8, fadeIn: 4, fadeOut: 4 });
    //    playWithFade(sounds["tension1"], 2, 2); // fade-in 1.5s, fade-out 1s, durée totale 4s  
    function animatePingPong(img, angleMax, duration) {
      const start = performance.now();

      function loop(now) {
        let t = (now - start) / duration;
        if (t > 1) t = 1;

        // t = 0→1 puis retour 1→0 → sinus
        const pingpong = Math.sin(t * Math.PI);
        const angle = pingpong * (angleMax * Math.PI / 180);

        drawOscillatingSprite(img, angle);

        if (t < 1) requestAnimationFrame(loop);  // arrêt automatique
      }

      requestAnimationFrame(loop);
    }

    function drawOscillatingSprite(img, angle) {
      const cx = WIDTH / 2;
      const cy = HEIGHT / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.scale(1.05, 1.05);
      ctx.drawImage(img, -WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
      ctx.restore();
    }

    // Appel : cycle complet (aller-retour)
    animatePingPong(images[3], 15, 6000);  // 2 secondes total

    await MATTMARKET(1100);
    await fadeOutLogo(50);
    ctx.drawImage(images[3], 0, 0);
    await fadeOutLogo(50);
    ctx.drawImage(images[3], 0, 0);
    await MATTMARKET(500);
    //sounds[1].currentTime = 0;
    //sounds[1].play().catch(err => console.warn("Autoplay bloqué :", err));
    await fadeOutLogo(100);
    ctx.drawImage(images[3], 0, 0);
    await fadeOutLogo(100);
    ctx.drawImage(images[3], 0, 0);
    await fadeOutLogo(100);
    ctx.drawImage(images[3], 0, 0);

    function fadeOutLogo(duration = 1500) {
      return new Promise(resolve => {
        let start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);

          // dessine le logo
          ctx.drawImage(images[3], 0, 0);

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

    /*  // Attente logo
      ctx.drawImage(images[3], 0, 0);
      //fadeOut(200); 
      let fade = 0; // commence transparent
      fadeOut();
      function fadeOut() {
  
        while (fade < 1) {
          console.log("fade :", fade);
          fade += 0.00002;
          if (fade > 1) fade = 1;
          ctx.fillStyle = `rgba(0,0,0,${fade})`;
          ctx.fillRect(0, 0, WIDTH / 2, HEIGHT);
        }
      }
  */
    await MATTMARKET(6457);

    // Cha for (let i = 0; i <
    // data.length; i += 4) {rger et préparer l’audio
    //    audio.oncanplaythrough = () => {
    //    console.log("Audio prêt !");
    // Tentative de lecture automatique
    //  document.getElementById("start").addEventListener("click", () => {
    //  audio.play().catch(err => console.log("Audio bloqué :", err));
    // });
    // audio.play().catch(err => console.warn("Lecture audio bloquée :", err));
    //};

    PlayerImg = images[1];

    /*Algo - A PLACER
            ///////////////////////////////////////
            - // Créer un objet Image
            -
            ----------------------------------------
            ALGO
            ----------------------------------------
            *-ECRAN DE DEMARRAGE (LOGO MATTMARKETDIGITALS)*/

    //        **fondu
    //*-MENU *******************************
    // --- INPUT ---
    GestionClavier();
    GestionTactile();
    ecouteTouchePause();
    createButton("F1-P: Pause", 7, () => {
      paused = !paused;   // ou paused = !paused pour toggle
      console.log("Toggle pause !");
    });
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
    loop();
  }
}
Run();
function loop() {
  // userInactif();
  if (!paused) {
    // si clavier et tactile inactifs, isImmobile = true
    if (!isImmobile) {
      update();
      draw();
    }
    defileTimerOrDie();
    Timer();
  } else {
    console.log("En pause : ", paused);
    drawPauseOverlay();
    affOptions();
  }
  requestAnimationFrame(loop);
}
function update() {
  if (gameOver) return;
  moveClavier();
  moveTactile();  // tactile orienté
  antiDefilPerm();
  screenWall();
  // Check "tâches"
  incTaskOrWin(); //cursor{}, tasksDone, requiredTasks, endGame()   
}
function endGame(success) {
  if (gameOver) return;   // <-- stoppe les appels multiples
  gameOver = true;
  setTimeout(() => {
    alert(success ? "Tu as survécu!" : "Le monstre t’a attrapé!");
    document.location.reload();
  }, 500);
}

function draw() {
  // Calcul centrage et échelle
  const scale = 1;//Math.min(WIDTH / PlayerImg.width, HEIGHT / PlayerImg.height);
  const drawW = PlayerImg.width * scale;
  const drawH = PlayerImg.height * scale;
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
    console.log("Son chargé :", s.name);
  }
  console.log("Tous les médias images + sons sont prêts !");
}
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

/*function playWithFade(buffer, fadeIn = 1.0, fadeOut = 1.0, duration = null) {
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.value = 0; // début silencieux
  // Fade-in
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + fadeIn);
  // Si on a demandé                                                                                                                                                                                                                    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,une durée :
  if (duration !== null) {
    // moment du début du fade-out
    const fadeStart = now + duration - fadeOut;
    // Fade-out
    gain.gain.setValueAtTime(1, fadeStart);
    gain.gain.linearRampToValueAtTime(0, fadeStart + fadeOut);
    // Stop total
    src.stop(fadeStart + fadeOut);
  }
  src.start();
}*/
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
  // coordonnées relatives au centre
  const dx = x - WIDTH / 2;
  const dy = y - HEIGHT / 2;
  const dist = Math.hypot(dx, dy);
  const angleTouch = Math.atan2(dy, dx);
  // on limite la distance max (500/2 = rayon max)
  const maxDist = WIDTH / 2;
  const intensity = Math.min(dist / maxDist, 1); // entre 0 et 1
  touchDir = { angleTouch, intensity };
}
function moveClavier() {
  //const cursor = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 3.1 };
  cursor.speed = keys.space ? vitesseCourse : maxSpeed;
  if (keys.left) cursor.x -= vitesseLampe * cursor.speed;
  if (keys.right) cursor.x += vitesseLampe * cursor.speed;
  if (keys.up) cursor.y -= vitesseLampe * cursor.speed;
  if (keys.down) cursor.y += vitesseLampe * cursor.speed;
}
function moveTactile() {
  if (touchDir) {
    const speed = maxSpeed * touchDir.intensity;
    cursor.x += Math.cos(touchDir.angleTouch) * speed;
    cursor.y += Math.sin(touchDir.angleTouch) * speed;
  }
}
function screenWall() { //cursor{},viewWidth,HEIGHT
  cursor.x = Math.max(0, Math.min(viewWidth - cursor.w, cursor.x));
  cursor.y = Math.max(0, Math.min(HEIGHT - cursor.h, cursor.y));
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
  ctx.fillText("⏸ Pause ", 120, (HEIGHT / 2) - 100);
  ctx.fillStyle = "#ff8400ff";
  ctx.font = "60px Georgia";
  ctx.fillText("⏸ Pause ", 130, (HEIGHT / 2) - 95);
  //createButton("F1-P: Pause", 7, () => {
  //paused = false;   // ou paused = !paused pour toggle
  //console.log("Arrêt de la pause !");
  //});
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
//  function enleveCouleur() {
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