export const clouds = [
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

let bgImg1 = new Image();
let bgImg2 = new Image();
let bgImg3 = new Image();

export function initializeBackground() {
    bgImg1.src = './assets/bg1.png';
    bgImg2.src = './assets/bg2.png';
    bgImg3.src = './assets/bg3.png';
}

export function drawBackgroundOnLoad(context) {
    bgImg1.onload = function() {
        context.drawImage(bgImg1, 0, 0, 800, 400);
    }
    bgImg2.onload = function() {
        context.drawImage(bgImg2, 0, 0, 800, 400);
    }
    bgImg3.onload = function() {
        context.drawImage(bgImg3, 0, 0, 800, 400);
    }
}

export function drawBackground(context) {
    context.drawImage(bgImg1, 0, 0, 800, 400);
    context.drawImage(bgImg2, 0, 0, 800, 400);
    context.drawImage(bgImg3, 0, 0, 800, 400);
}