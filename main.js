const canvas = document.getElementById(`mainCanvas`);
const ctx = canvas.getContext(`2d`);
let isPaused = false;

// images
const bgImg = new Image();
bgImg.src = 'background.png'

const birdImg = new Image();
birdImg.src = 'fisch.png';

const pipeImg = new Image();
pipeImg.src = 'pipe.png';

const bubbleImg = new Image();
bubbleImg.src = 'bubble.png';
let bubbles = [];

// make responsive
function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener(`resize`, resize);
resize()

// declare bird 
let birdY = canvas.height / 2;
let velocity = 0;
const gravity = 0.5;
const jump = -8;
const birdSize = 30;

//declare pipes
let pipes = [];
const pipeWidth = 100;
const pipeGap = 180;
let pipeTimer = 70;


let score = 0;
let isGameOver = false;

let spacePressed = false; 

function createBubbleGroup() {
    const isMobile = window.innerWidth < 768; 
    const startX = Math.random() * canvas.width;
    
    let maxGroupSize = isMobile ? 3 : 8; 
    let minGroupSize = isMobile ? 2 : 5;
    
    const groupSize = Math.floor(Math.random() * (maxGroupSize - minGroupSize)) + minGroupSize; 

    for (let i = 0; i < groupSize; i++) {
        bubbles.push({
            x: startX + (Math.random() * (isMobile ? 50 : 100) - (isMobile ? 25 : 50)), 
            y: canvas.height + Math.random() * 200, 
            size: Math.random() * (isMobile ? 30 : 60) + (isMobile ? 20 : 40), 
            speed: Math.random() * 1.5 + 1, 
            opacity: Math.random() * 0.4 + 0.1 
        });
    }
}

function handleInput(){
    if (isGameOver){
        resetGame();
        return;
    }
    if (isPaused) return;
    velocity = jump;
}

window.addEventListener(`keydown`, (e) => {
    if (e.code === `Space` && !spacePressed){
        handleInput();
        spacePressed = true;
    }
    if (e.code === `KeyP` && !isGameOver) {
        isPaused = !isPaused; 
    }
});

window.addEventListener(`keyup`, (e) => {
    if (e.code === `Space`){
        spacePressed = false;
    }
});

window.addEventListener(`touchstart`, (e) => {
    e.preventDefault(); //prevents zoom
    handleInput();
}, { passive: false });
window.addEventListener(`mousedown`, (e) => {
    handleInput();
});

document.getElementById('pauseBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isGameOver) isPaused = !isPaused;
});

//addition to make sure game is always possible
let lastPipeTop = canvas.height / 2;

function createPipe (){
    //define random height for top pipe with a min of 50pxx 
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const maxDistance = 200;

    let lowBound = lastPipeTop - maxDistance;
    let highBound = lastPipeTop + maxDistance;

    if (lowBound < minHeight) lowBound = minHeight;
    if (highBound > maxHeight) highBound = maxHeight;

    const topHeight = Math.floor(Math.random() * (highBound - lowBound)) + lowBound;
    

    pipes.push({
        x: canvas.width,
        top: topHeight,
        passed: false
    });
    //save height for next pipe
    lastPipeTop = topHeight;
}

function resetGame(){
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
    isPaused = false;
    document.getElementById(`scoreText`).innerText = `0`;
    pipeTimer = 70;
    lastPipeTop = canvas.height / 2;
    bubbles = [];
}

function update(){
    if (isGameOver){
        //load highscore from save if exists
        let highscore = localStorage.getItem(`flappyHighscore`) || 0;
        //check if current score is better
        if (score > highscore){
            localStorage.setItem(`flappyHighscore`, score);
            highscore = score;
        }
        //draw game over texxt
        ctx.fillStyle = `rgba(0, 0, 0, 0.5)`; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `white`;
        ctx.textAlign = `center`;
        ctx.font = `bold 50px Arial`;
        ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = `30px Arial`;
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.font = `20px Arial`;
        ctx.fillText(`Bester Highscore: ${highscore}`, canvas.width / 2, canvas.height / 2 + 50);
        ctx.font = `italic 18px Arial`;
        ctx.fillText(`Click to restart`, canvas.width / 2, canvas.height / 2 + 100);
        requestAnimationFrame(update);
        return;
    }

    if (isPaused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 50px Arial";
        ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Drücke 'P' zum Weiterspielen", canvas.width / 2, canvas.height / 2 + 50);
        
        requestAnimationFrame(update);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Hintergrund wieder statisch (dein Original-Code)
    const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
    const bgX = (canvas.width / 2) - (bgImg.width / 2) * scale;
    const bgY = (canvas.height / 2) - (bgImg.height / 2) * scale;
    ctx.drawImage(bgImg, bgX, bgY, bgImg.width * scale, bgImg.height * scale);

    const spawnChance = window.innerWidth < 768 ? 0.005 : 0.01;
    if (Math.random() < spawnChance) {
        createBubbleGroup();
    }

    for (let i = 0; i < bubbles.length; i++) {
        let b = bubbles[i];
        b.y -= b.speed; 
        b.x += Math.sin(b.y * 0.02) * 0.5;

        ctx.save();
        ctx.globalAlpha = b.opacity;
        ctx.drawImage(bubbleImg, b.x, b.y, b.size, b.size);
        ctx.restore();

        if (b.y + b.size < 0) {
            bubbles.splice(i, 1);
            i--;
        }
    }

    //bird physic
    velocity += gravity;
    birdY += velocity;


    //check if bird is out of frame
    if ( birdY < 0){
        birdY = 0;
        velocity = 0;
    }
    if (birdY + birdSize > canvas.height){
        isGameOver = true;
    }

    pipeTimer++;
    if (pipeTimer % 100 === 0){
        createPipe();
    }
    for (let i = 0; i < pipes.length; i++){
        let p = pipes[i];
        p.x -= 4;

        const sWidth = pipeImg.width;
        const sHeight = pipeImg.height;
        const aspect = sWidth / pipeWidth;
        const headHeightSource = sWidth * 0.8; 
        const headHeightDisplay = headHeightSource / aspect;

        ctx.save();
        ctx.filter = "hue-rotate(150deg) brightness(1.1) saturate(0.9)";

        // Top Pipe
        ctx.save();
        ctx.translate(p.x + pipeWidth / 2, p.top);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, 0, 0, sWidth, headHeightSource, -pipeWidth / 2, 0, pipeWidth, headHeightDisplay);
        ctx.drawImage(pipeImg, 0, headHeightSource, sWidth, sHeight - headHeightSource, -pipeWidth / 2, headHeightDisplay, pipeWidth, canvas.height);
        ctx.restore();
        
        // Bottom Pipe
        ctx.drawImage(pipeImg, 0, 0, sWidth, headHeightSource, p.x, p.top + pipeGap, pipeWidth, headHeightDisplay);
        ctx.drawImage(pipeImg, 0, headHeightSource, sWidth, sHeight - headHeightSource, p.x, p.top + pipeGap + headHeightDisplay, pipeWidth, canvas.height);
        ctx.restore();

        // score logic
        if (!p.passed && p.x + pipeWidth < 50){
            score++;
            p.passed = true;
            document.getElementById(`scoreText`).innerText = score;
        }

        //check for collision
        if (
            50 + birdSize > p.x &&
            50 < p.x + pipeWidth &&
            (birdY < p.top || birdY + birdSize > p.top + pipeGap)
        ) {
            isGameOver = true;
        }
        //delete pipes that are out of frame 
        if (p.x + pipeWidth < 0){
            pipes.splice(i, 1);
            i--;
        }
    }

   // draw fisch
    ctx.save();

    ctx.translate(50 + birdSize / 2, birdY + birdSize / 2);
    
    let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (velocity / 12)));
    ctx.rotate(rotation);
    let squeeze = Math.sin(Date.now() * 0.001) * 1;
    
    ctx.drawImage(birdImg, -birdSize / 2, -birdSize / 2 - (squeeze/2), birdSize, birdSize + squeeze);
    ctx.restore();

    requestAnimationFrame(update)
}

update()