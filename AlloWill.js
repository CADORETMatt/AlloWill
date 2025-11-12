const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
//Chargement image décor
const Decor1 = new Image();      //VOIR DANS FUNCTION DRAW
Decor1.src = 'Asset1-1.bmp'; // Chemin vers BMP ou PNG
// image silhouette joueur
const PlayerImg = new Image();
// PlayerImg.crossOrigin = "anonymous"; // avant .src
PlayerImg.src = "./Hum1NB.png";
// --- GAME STATE ---
alert("Push on keyboard for start");
function draw() {

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  PlayerImg.onload = () => {
    // Calcul centrage et échelle

    const scale = 1;//Math.min(WIDTH / PlayerImg.width, HEIGHT / PlayerImg.height);
    const drawW = PlayerImg.width * scale;
    const drawH = PlayerImg.height * scale;
    const offsetX = (WIDTH - drawW) / 2;
    const offsetY = (HEIGHT - drawH) / 2;

    // 1️⃣ Affiche l’image
    ctx.drawImage(Decor1,
      0, 0, WIDTH / 2, HEIGHT / 2, // source (partie du décor)
      0, 0, WIDTH, HEIGHT        // destination (sur la "vue")
    );
    // Dessiner uniquement la portion visible du décor*/
    ctx.globalCompositeOperation = "source-over"; // par défaut 
    ctx.globalAlpha = 0.25;
    ctx.drawImage(PlayerImg, offsetX, offsetY + 50, drawW, drawH);
    ctx.globalAlpha = 1;

  };
  //Filtre bleu nuit
  ctx.fillStyle = "rgba(0, 0, 80, 0.7)"; // bleu foncé avec opacité
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

}
draw();
