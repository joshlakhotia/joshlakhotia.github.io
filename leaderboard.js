export let leaderboard = [
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

export function drawScores(leaders, context1, highScore) {
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