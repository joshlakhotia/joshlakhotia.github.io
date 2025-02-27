export function detectCollision(a, b) {
    return a.x < b.x + (b.width - 20) &&      //a's top left corner doesn't reach b's top right corner
           a.x + (a.width - 15) > b.x &&      //a's top right corner passes b's top left corner
           a.y - 10 < b.y + (b.height - 30) &&    //a's top left corner doesn't reach b's bottom left corner
           a.y + (a.height - 20) > b.y;       //a's bottom left corner passes b's top left corner
}