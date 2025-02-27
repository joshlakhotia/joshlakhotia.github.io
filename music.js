const menuMusic = new Audio('./assets/menumusic.mp3');
menuMusic.loop = true;
menuMusic.volume = 0.3;

const gameMusic = new Audio('./assets/gameplaymusic.mp3');
gameMusic.loop = true;

export function playMenuMusic() {
    menuMusic.play();
}

export function playGameMusic() {
    menuMusic.pause();
    menuMusic.currentTime = 0;
    gameMusic.play();
}

export function pauseGameMusic() {
    gameMusic.pause();
    gameMusic.currentTime = 0;
}