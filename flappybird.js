const clouds = [
    {
        "number": 1,
        "src": "./assets/Cloud 1.png",
        "width": 184,
        "height": 72
    },
    {
        "number": 2,
        "src": "./assets/Cloud 2.png",
        "width": 257,
        "height": 34
    },
    {
        "number": 3,
        "src": "./assets/Cloud 3.png",
        "width": 186,
        "height": 50
    },
    {
        "number": 4,
        "src": "./assets/Cloud 4.png",
        "width": 165,
        "height": 64
    },
    {
        "number": 5,
        "src": "./assets/Cloud 5.png",
        "width": 162,
        "height": 92
    },
    {
        "number": 6,
        "src": "./assets/Cloud 6.png",
        "width": 107,
        "height": 45
    },
    {
        "number": 7,
        "src": "./assets/Cloud 7.png",
        "width": 165,
        "height": 62
    },
    {
        "number": 8,
        "src": "./assets/Cloud 8.png",
        "width": 162,
        "height": 77
    },
    {
        "number": 9,
        "src": "./assets/Cloud 9.png",
        "width": 128,
        "height": 57
    },
    {
        "number": 10,
        "src": "./assets/Cloud 10.png",
        "width": 165,
        "height": 66
    }
]

let leaderboard = [
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
    {
        name: "Could be u",
        score: 0
    },
]

//board
let board;
let boardWidth = 800;
let boardHeight = 400;
let context;
let context1;

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

//butters wants to be mentioned

//pipes
let pipeArray = [];
let pipeWidth = 352; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 132; //original is 512
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let menu;
let endMenuSeen = true;

//physics
let velocityX = -3; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.2;

let gameOver = false;
let gameStart = false;
let score = 0;

let leaders = JSON.parse(localStorage.getItem('leaders'))

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    highScore = document.getElementById("highscore");
    highScore.height = 400;
    highScore.width = 300;
    context1 = highScore.getContext("2d"); //used for drawing on the board

    //context1.fillStyle = 'gray'; // Set color for the first canvas
    //context1.fillRect(0, 0, 300, 400)

    drawScores(leaders, context1);

    //background
    bgImg1 = new Image();
    bgImg1.src = './assets/bg1.png';
    bgImg1.onload = function() {
        context.drawImage(bgImg1, 0, 0, 1420, 789);
    }

    bgImg2 = new Image();
    bgImg2.src = './assets/bg2.png';
    bgImg2.onload = function() {
        context.drawImage(bgImg2, 0, 0, 1920, 1080);
    }

    bgImg3 = new Image();
    bgImg3.src = './assets/bg3.png';
    bg3X -= 5;
    bgImg3.onload = function() {
        context.drawImage(bgImg3, bg3X, 0, 1920, 1080);
    }

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

    drawScores(leaders, context1);

    requestAnimationFrame(update);
    setInterval(placePipes, 1000); //every 1 seconds
    document.addEventListener("keydown", moveBird);
    document.addEventListener("keydown", startGame);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    if (gameStart) {
        context.clearRect(0, 0, board.width, board.height);

        context.drawImage(bgImg1, 0, 0, 1920, 1080);
        context.drawImage(bgImg2, 0, 0, 1920, 1080);
        context.drawImage(bgImg3, 0, 0, 1920, 1080);

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
            endMenuSeen = false;
            
            context.drawImage(end, 0, 0, 800, 390); //game over menu

            drawScores(leaders, context1);

            // context1.clearRect(0, 0, highScore.width, highScore.height);
            
            // context1.fillStyle = "black"; //color of leaderboard text
            // context1.font = "30px Ubuntu"

            // context1.fillText("High Score", 50, 50)

            // if (leaders) {
            //     for(let i = 0; i < 6; i++) {      //how many scores to display in highscore screen
            //         let leaderY = 125 + (45 * i); //leaderboard vertical position
            //         context1.fillText(leaders[i].name, 50, leaderY, 145); //(text, x, y, maxwidth)
            //         context1.fillText(leaders[i].score, 250, leaderY, 50); //(text, x, y, maxwidth)
            //     }
            // } else {
            //     context1.fillText("Its very quiet in here...", 0, 50);
            // }

            context.fillText(score, 5, 45);

            if(leaders && score > leaders[9].score || !leaders) {
                if(leaders) {
                    leaders.pop(); //get rid of lowest score in leaderboard
                } else {
                    leaders = leaderboard;
                };
                const input = document.getElementById("name");
                input.classList.remove('hidden'); //show name field entry

                document.getElementById('name').addEventListener('keydown', function eventHandler(event) {
                    if (event.key === 'Enter') {
                        const inputValue = this.value; // Get the input value
                        this.value = ''; // Clear the input
                        input.classList.add('hidden'); // hide name field entry after "enter"
                        leaders.push({name: inputValue, score: score});
                        leaders.sort((a, b) => b.score - a.score);
                        console.log("added to leaderboard");
                        localStorage.setItem('leaders', JSON.stringify(leaders)); //store leaders in localStorage
                        drawScores(leaders, context1); //update high score board when new high score is entered
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

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
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
    if(e.code == "Space") {
        gameStart = true;
    }
}

function endGame() {
    gameStart = false;
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
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

function detectCollision(a, b) {
    return a.x < b.x + (b.width - 20) &&   //a's top left corner doesn't reach b's top right corner
           a.x + (a.width - 15) > b.x &&   //a's top right corner passes b's top left corner
           a.y - 10 < b.y + (b.height - 30) &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + (a.height - 20) > b.y;    //a's bottom left corner passes b's top left corner
}

function drawScores(leaders, context1) {
    context1.clearRect(0, 0, highScore.width, highScore.height);

    context1.fillStyle = "gray";
    context1.fillRect(0, 0, 300, 400);
            
    context1.fillStyle = "white"; //color of leaderboard text
    context1.font = "25px Ubuntu"

    context1.fillText("HIGH SCORES", 65, 50)

    if (leaders) {
        for(let i = 0; i < 6; i++) {      //how many scores to display in highscore screen
            let leaderY = 125 + (45 * i); //leaderboard vertical position
            context1.fillText(leaders[i].name, 20, leaderY); //(text, x, y, maxwidth)
            context1.fillText(leaders[i].score, 240, leaderY, 50); //(text, x, y, maxwidth)
        }
    } else {
        context1.fillText("Its very quiet in here...", 20, 150);
    }
}