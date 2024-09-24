const clouds = [
    {
        "number": 1,
        "src": "./assets/Cloud 1.png",
        "width": 294,
        "height": 114
    },
    {
        "number": 2,
        "src": "./assets/Cloud 2.png",
        "width": 411,
        "height": 54
    },
    {
        "number": 3,
        "src": "./assets/Cloud 3.png",
        "width": 297,
        "height": 81
    },
    {
        "number": 4,
        "src": "./assets/Cloud 4.png",
        "width": 264,
        "height": 102
    },
    {
        "number": 5,
        "src": "./assets/Cloud 5.png",
        "width": 258,
        "height": 147
    },
    {
        "number": 6,
        "src": "./assets/Cloud 6.png",
        "width": 171,
        "height": 72
    },
    {
        "number": 7,
        "src": "./assets/Cloud 7.png",
        "width": 264,
        "height": 99
    },
    {
        "number": 8,
        "src": "./assets/Cloud 8.png",
        "width": 258,
        "height": 153
    },
    {
        "number": 9,
        "src": "./assets/Cloud 9.png",
        "width": 204,
        "height": 90
    },
    {
        "number": 10,
        "src": "./assets/Cloud 10.png",
        "width": 264,
        "height": 105
    }
]

//board
let board;
let boardWidth = 1000;
let boardHeight = 640;
let context;

//backgroundparalax
let bg3X;

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

//pipes
let pipeArray = [];
let pipeWidth = 352; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 132; //original is 512
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -3; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.2;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //background
    bgImg1 = new Image();
    bgImg1.src = './assets/bg1.png';
    bgImg1.onload = function() {
        context.drawImage(bgImg1, 0, 0, 1000, 640);
    }

    bgImg2 = new Image();
    bgImg2.src = './assets/bg2.png';
    bgImg2.onload = function() {
        context.drawImage(bgImg2, 0, 0, 1000, 640);
    }

    bgImg3 = new Image();
    bgImg3.src = './assets/bg3.png';
    bg3X -= 5;
    bgImg3.onload = function() {
        context.drawImage(bgImg3, bg3X, 0, 1000, 640);
    }

    //load images
    birdImg = new Image();
    birdImg.src = "./flappysuit1.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./assets/Cloud 1.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./assets/Cloud 7.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    context.drawImage(bgImg1, 0, 0, 1000, 640);
    context.drawImage(bgImg2, 0, 0, 1000, 640);
    context.drawImage(bgImg3, 0, 0, 1000, 640);

    //bird
    velocityY += gravity/2;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    if( velocityY <= 0) {
        birdImg.src = "./flappysuit2.png";
    } else {
        birdImg.src = "./flappysuit1.png";
    }
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // if (score > 5) {       //If score is increasing, increase velocity of clouds. Only implement if clound intervals can become dynamic
    //     velocityX = -5;
    // }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 1; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
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

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = Math.random()*(640)-50;
    let randomIndex = Math.floor(Math.random() * 10)
    console.log(randomIndex);
    let randomCloud = clouds[randomIndex];
    const cloudImg = new Image;
    cloudImg.src = randomCloud.src;
    console.log(randomCloud);

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

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -3;




        //reset game
        if (gameOver) {
            velocityX = -3;
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + (b.width - 20) &&   //a's top left corner doesn't reach b's top right corner
           a.x + (a.width - 30) > b.x &&   //a's top right corner passes b's top left corner
           a.y - 10 < b.y + (b.height - 20) &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + (a.height - 20) > b.y;    //a's bottom left corner passes b's top left corner
}