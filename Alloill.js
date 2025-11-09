const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
//Chargement image décor
const Decor1 = new Image();      //VOIR DANS FUNCTION DRAW
Decor1.src = 'Asset1-1.bmp'; // Chemin vers BMP ou PNG
// --- GAME STATE ---
let timeLeft = 60;
let gameOver = false;
let tasksDone = 0;
let requiredTasks = 3;
// Gestion du clavier
const keys = { left: false, right: false, up: false, down: false };
// --- PLAYER ---
const player = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 3.1 };


/*Algo - A PLACER
        ///////////////////////////////////////
        - // Créer un objet Image
        -
        ----------------------------------------
        ALGO
        ----------------------------------------
        *-ECRAN DE DEMARRAGE (LOGO MATTMARKETDIGITALS)*/
alert("Push on keyboard for start");

/*        **fondu
        *-MENU *******************************
*/

// --- INPUT ---

GestionClavier();



//////function GestionTactile() {
let touchDir = null; // direction du doigt (angle, distance) 
let maxSpeed = 4;    // vitesse max du déplacement

canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("touchmove", handleTouch);
canvas.addEventListener("touchend", () => touchDir = null);

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
//}

// --- GAME LOOP ---
function update() {
    if (gameOver) return;

    moveClavier();
    // tactile orienté
    if (touchDir) {
        const speed = maxSpeed * touchDir.intensity;
        player.x += Math.cos(touchDir.angle) * speed;
        player.y += Math.sin(touchDir.angle) * speed;
    }

    // Garder le joueur dans la vue (mais déclencher le défilement)
    if (player.x < edgeZone && cameraX > 0) {
        cameraX -= player.speed; // défilement à gauche
        if (cameraX < 0) cameraX = 0;
    } else if (player.x > viewWidth - edgeZone && cameraX < decorWidth - viewWidth / 2) {
        cameraX += player.speed; // défilement à droite
        if (cameraX > decorWidth - viewWidth / 2) cameraX = decorWidth - viewWidth / 2;
    }

    
    screenWall();
    
    defileTimerOrWin();
	
    // Check "tâches"
    if  (player.x < 20 && player.y < 20 && tasksDone < requiredTasks) {
        tasksDone++;
        player.x = 70; player.y = 100; // Retour position
        if (tasksDone === requiredTasks) endGame(true);
    }
    

}

//**JEU***********************************
/*     ***INPUT
       ***Le joueur est au centre
*/
// --- PLAYER ---

/*     ***écran à 1000x250
       ***affichage décor
       ****Assets
       ****AffBMP*/
// --- DESSIN ---

function draw() {
    /*
   ctx.clearRect(0, 0, vueWidth, HEIGHT);
  
    // Ajuster la caméra pour centrer sur le joueur
    cameraX = player.x - vueWidth / 2;
  
    // Empêcher la caméra de sortir des bords
    if (cameraX < 0) cameraX = 0;
    if (cameraX > decorWidth - vueWidth) cameraX = decorWidth - vueWidth;
  */
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);


    // Dessiner uniquement la portion visible du décor*/
    ctx.drawImage(Decor1,
        cameraX, 0, viewWidth / 2, HEIGHT / 2, // source (partie du décor)
        0, 0, viewWidth, HEIGHT        // destination (sur la "vue")
    );
    //Filtre bleu nuit
    ctx.fillStyle = "rgba(0, 0, 80, 0.5)"; // bleu foncé avec opacité
    ctx.fillRect(0, 0, viewWidth, HEIGHT);

    // Draw Background Image
    //Decor1.onload = () => {
    //ctx.drawImage(Decor1, 0, 0, WIDTH, HEIGHT); // VOIR AFFDECOR
    //ctx.drawImage(Decor1, 0, 0, 250, 250, 0, 0, 250, 250);
    //};
    //Filtre bleu nuit
    ctx.fillStyle = "rgba(0, 0, 80, 0.5)"; // bleu foncé avec opacité
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // Joueur
    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Timer
    ctx.font = "20px Georgia";
    ctx.fillStyle = "#f33";
    ctx.fillText(`Temps: ${Math.ceil(timeLeft)}`, 5, 20);//augmenté taille texte
    ctx.fillText(`Tâches: ${tasksDone}/${requiredTasks}`, 5, 40);

}

/*    ***DEPLACEMENTJOUEUR
//    ***affichage 250x250 */
// Variables pour le défilement
//let playerX = 0;        // position du joueur
let cameraX = 0;        // décalage horizontal de la "vue"
const viewWidth = 500;   // largeur de la fenêtre visible
const decorWidth = 1000; // largeur totale du décor
//Adaptation mobile
//const ratio = 1000 / 250; //  décor d’origine
// Si la largeur dépasse l’écran, on réduit
if (viewWidth > window.innerWidth) {
    viewWidth = window.innerWidth;
    //HEIGHT = WIDTH * ratio;
}
const edgeZone = 30;          // distance au bord où le scrolling commence



/****Effet lampe de poche
 ****Adrénaline et Endurance influt la vitesse    
 ***COLLISION
 ***ANIMATION
 ****Le décor change dans le noir
 ***INTERACTIIONS
 ****OBJETS DE DECOR
 ****TÂCHES

 **OPTIONS
 **EXIT 
 ***CREDITS
.        ///////////////////////////////////////
 */

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

function GestionClavier() {  // const keys = { left: false, right: false, up: false, down: false };
    window.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") keys.left = true;
        if (e.key === "ArrowRight") keys.right = true;
        if (e.key === "ArrowUp") keys.up = true;
        if (e.key === "ArrowDown") keys.down = true;
    });
    window.addEventListener("keyup", e => {
        if (e.key === "ArrowLeft") keys.left = false;
        if (e.key === "ArrowRight") keys.right = false;
        if (e.key === "ArrowUp") keys.up = false;
        if (e.key === "ArrowDown") keys.down = false;
    });
}

 function moveClavier () {
  //const player = { x: WIDTH / 2, y: HEIGHT / 2, w: 16, h: 16, speed: 3.1 };
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;
    if (keys.up) player.y -= player.speed;
    if (keys.down) player.y += player.speed;
  }
   
 function screenWall(){ //player{},viewWidth,HEIGHT
		player.x = Math.max(0, Math.min(viewWidth - player.w, player.x));
		player.y = Math.max(0, Math.min(HEIGHT - player.h, player.y));
    }

    function defileTimerOrWin() { //timeLeft, endGame()
		timeLeft -= 1 / 60;
		if (timeLeft <= 0) endGame(false);
	}
