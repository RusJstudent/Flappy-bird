'use strict';

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let height = canvas.height;
let width = canvas.width;

let bird = new Image();
let bg = new Image();
let fg = new Image();
let lowerPipe = new Image();
let upperPipe = new Image();

bird.src = 'images/bird.png';
bg.src = 'images/bg.png';
fg.src = 'images/fg.png';
lowerPipe.src = 'images/lower_pipe.png';
upperPipe.src = 'images/upper_pipe.png';

let fly3 = new Audio();
let score3 = new Audio();
fly3.src = 'audio/fly.mp3';
score3.src = 'audio/score.mp3';

const gap = 90;
let xPos = 10;
let yPos = 150;

const grav = 0.5;
let currentSpeed = grav;
const defaultIncrease = 0.01;
let increaseCounter = defaultIncrease;

let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;

let x = canvas.width;

const pipe = [];
pipe[0] = {
    x: canvas.width,
    y: 0,
}

upperPipe.onload = () => draw();

document.addEventListener('keydown', moveUp);
document.addEventListener('click', moveUp);

function moveUp(e) {
    if (e.repeat) return;
    if (e.type !== 'click' && e.code !== 'ArrowUp') return;
    yPos -= 30;
    currentSpeed = grav;
    increaseCounter = defaultIncrease;

    fly3.currentTime = 0;
    fly3.play();
}

function draw() {
    ctx.drawImage(bg, 0, 0);

    for (let i = 0; i < pipe.length; i++) {
        ctx.drawImage(upperPipe, pipe[i].x, pipe[i].y);
        ctx.drawImage(lowerPipe, pipe[i].x, pipe[i].y + upperPipe.height + gap);

        pipe[i].x--;

        if (pipe[i].x === 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * upperPipe.height) - upperPipe.height,
            });
            
            if (pipe.length > 3) pipe.shift();
        }

        if (xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + upperPipe.width
            && (yPos <= pipe[i].y + upperPipe.height
                || yPos + bird.height >= pipe[i].y + upperPipe.height + gap)) {
                    location.reload();
                }

        if (pipe[i].x === 5) {
            score++;
            score3.currentTime = 0;
            score3.play();
        }
    }

    if (yPos + bird.height >= bg.height - fg.height) location.reload();

    ctx.drawImage(fg, 0, bg.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    ctx.fillStyle = "red";
    ctx.font = "24px Verdana";
    ctx.fillText("Счет: " + score, 100, canvas.height - 67);

    ctx.fillStyle = "black";
    ctx.font = "20px Verdana";
    ctx.fillText("Рекорд: " + bestScore, 10, canvas.height - 20);

    if (score > bestScore) localStorage.setItem('bestScore', score);

    yPos += currentSpeed;
    currentSpeed += increaseCounter;
    if (increaseCounter < 0.1) {
        increaseCounter += 0.0025;
    }
    
    requestAnimationFrame(draw);
}