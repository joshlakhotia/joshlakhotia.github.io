import { playGameMusic, playMenuMusic, pauseGameMusic } from './music.js';
import { detectCollision } from './utils.js';
import { clouds, initializeBackground, drawBackground, drawBackgroundOnLoad } from './background.js';
import { drawScores, leaderboard } from './leaderboard.js';

//board
let board;
let boardWidth = 800;
let boardHeight = 400;
let context;
let context1;
let highScore;


//background
let gameOverHigh;
let end;

//bird
let birdWidth = 64; //width/height ratio = 408/228 = 17/12
let birdHeight = 38;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//butters wants to be mentioned

//pipes
let pipeArray = [];
let pipeWidth = 352; //width/height ratio = 384/3072 = 1/8
let pipeX = boardWidth;

let menu;
let endMenuSeen = true;

//physics
let velocityX = -4; //pipes moving left speed
let velocityY = 100; //bird jump speed
let gravity = 0.2;

let gameOver = false;
let gameStart = false;
let score = 0;

let leaders = JSON.parse(localStorage.getItem('leaders'));

let lastPipeTime = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    highScore = document.getElementById("highscore");
    highScore.height = 400;
    highScore.width = 300;
    context1 = highScore.getContext("2d"); //used for drawing on the board

    drawScores(leaders, context1, highScore);

    initializeBackground();
    drawBackgroundOnLoad(context);

    //load images
    birdImg = new Image();
    birdImg.src = "./flappysuit1.png";

    menu = new Image();
    menu.src = "./assets/start.png";
    menu.onload = function () {
        context.drawImage(menu, 0, 0, 800, 350);
    }

    end = new Image();
    end.src = "./assets/gameover.png";

    gameOverHigh = new Image();
    gameOverHigh.src = "./assets/Highscore.png";

    drawScores(leaders, context1, highScore);

    requestAnimationFrame(update);
    //setInterval(placePipes, 500); //every .5 seconds
    document.addEventListener("keydown", moveBird);
    document.addEventListener("keydown", startGame);

    playMenuMusic();
}

function update(timestamp) {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    if (gameStart) {
        //stop menu music and play game music
        playGameMusic();

        context.clearRect(0, 0, board.width, board.height);
        drawBackground(context);

        //bird
        velocityY += gravity/2;
        // bird.y += velocityY;
        bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
        if( velocityY <= 0) {
            birdImg.src = "./flappysuit3.png";
            bird.height = birdHeight;
        } else if (velocityY <= 1) {
            birdImg.src = "./flappysuit2.png";
            bird.height = birdHeight;
        } else {
            birdImg.src = "./flappysuit1.png";
            bird.height = 25;
        }
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        if (bird.y > board.height) {
            gameOver = true;
        }

        //pipes
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 1;
                pipe.passed = true;
            }

            if (detectCollision(bird, pipe)) {
                gameOver = true;
            }
        }

        //clear pipes
        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth - 200) {
            pipeArray.shift(); //removes first element from the array
        }

        //place pipes every 500ms
        if (timestamp - lastPipeTime > 750) {
            placePipes();
            lastPipeTime = timestamp;
        }

        //score
        context.fillStyle = "white";
        context.font="45px sans-serif";
        context.fillText(score, 5, 45);

        if (gameOver) {
            endMenuSeen = false;

            //stop game music and play menu music
            pauseGameMusic();
            playMenuMusic();
            
            context.drawImage(end, 0, 0, 800, 390); //game over menu

            drawScores(leaders, context1, highScore); //draw high score board

            context.fillText(score, 5, 45);

            if(leaders && score > leaders[9].score || !leaders) {
                context.clearRect(0, 0, board.width, board.height);
                context.fillStyle = '#a7bfed';
                context.fillRect(0,0, 800, 400);
                context.drawImage(gameOverHigh, 0, 0, 800, 390);
                context.fillStyle = 'white'
                context.fillText(score, 5, 45);
                if(leaders) {
                    leaders.pop(); //get rid of lowest score in leaderboard
                } else {
                    leaders = leaderboard;
                };
                const input = document.getElementById("name");
                input.classList.remove('hidden'); //show name field entry
                document.getElementById("name").focus();

                document.getElementById('name').addEventListener('keydown', function eventHandler(event) {
                    if (event.key === 'Enter') {
                        const inputValue = this.value; // Get the input value
                        this.value = ''; // Clear the input
                        input.classList.add('hidden'); // hide name field entry after "enter"
                        leaders.push({name: inputValue, score: score});
                        leaders.sort((a, b) => b.score - a.score);
                        localStorage.setItem('leaders', JSON.stringify(leaders)); //store leaders in localStorage
                        drawScores(leaders, context1, highScore); //update high score board when new high score is entered
                        endMenuSeen = true;
                        document.getElementById('name').removeEventListener('keydown', eventHandler);
                        context.fillStyle = '#a7bfed';            //redraws start menu screen after entering high score
                        context.fillRect(0,0, 800, 400);          
                        context.drawImage(menu, 0, 0, 800, 350);
                    }
                });
            } else {
                setTimeout(() => {
                    endMenuSeen = true;              //this block sets a timer after game over and redraws the start menu screen
                    context.fillStyle = '#a7bfed';
                    context.fillRect(0,0, 800, 400);
                    context.drawImage(menu, 0, 0, 800, 350);
                }, 3000);                   //how long to wait after game over and no high score before they can restart the game (avoids accidentally starting new game without seeing end screen)
            }

        }
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    if (gameStart) {
        let randomPipeY = Math.random()*(400-50);
        let randomIndex = Math.floor(Math.random() * 10)
        let randomCloud = clouds[randomIndex]; //pick a random cloud from the clouds array
        const cloudImg = new Image;
        cloudImg.src = randomCloud.src;

        let topPipe = {
            img : cloudImg,
            x : pipeX,
            y : randomPipeY,
            width : randomCloud.width,
            height : randomCloud.height,
            passed : false
        }
        pipeArray.push(topPipe);
    }
    
}

function startGame(e) {
    if(e.code == "ArrowUp") {
        gameStart = true;
    }
}

function moveBird(e) {
    if (e.code == "ArrowUp") {
        //jump
        velocityY = -3;

        //reset game    can somehow prevent restart of game too early while scores are displayed here

        if (gameOver && endMenuSeen) {
            velocityX = -3;
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}