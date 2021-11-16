var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');

let finish = new Audio();
let bar_hit = new Audio();
let wall_hit = new Audio();


bar_hit.src = "media/bar_hit.mp3";
wall_hit.src = "media/wall_hit.mp3";
finish.src = "media/finish.mp3";




const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score,
    maxScore,
    movement,
    rod,
    ballSpeedX = 2,
    ballSpeedY = 2;

let gameOn = false;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;



(function() {
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (rod === "null" || maxScore === "null") {
        alert("This is the first time you are playing this game. Use A abd D for navigation. LET'S START");
        maxScore = 0;
        rod = "Rod1";
    } else {
        alert(" Press Enter to start the game. Press A and D to control bars. Max score is " + maxScore * 100);
    }

    resetBoard(rod);
})();



function resetBoard(rodName) {

    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';


    // Lossing player gets the ball
    if (rodName === rod2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (rodName === rod1Name) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    score = 0;
    gameOn = false;

}


function storeWin(rod, score) {

    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, maxScore);
    }

    clearInterval(movement);
    resetBoard(rod);

    alert(" Your score " + (score * 100) + ". Max score is: " + (maxScore * 100));

}


window.addEventListener('keypress', function(event) {

    let rodSpeed = 30;
    let rodRect = rod1.getBoundingClientRect();

    if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {

        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = (rodRect.x) + rodSpeed + 'px';
    } else if (event.code === "KeyA" && (rodRect.x > 0)) {

        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }


    if (event.code === "Enter") {

        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            let rod1X;
            let rod2X;

            movement = setInterval(function() {
                if (score >= 30) {
                    ballX += ballSpeedX * 2.2;
                    ballY += ballSpeedY * 2.2;

                } else if (score >= 25) {
                    ballX += ballSpeedX * 2;
                    ballY += ballSpeedY * 2;
                } else if (score >= 20) {
                    ballX += ballSpeedX * 1.8;
                    ballY += ballSpeedY * 1.8;
                } else if (score >= 15) {
                    ballX += ballSpeedX * 1.6;
                    ballY += ballSpeedY * 1.6;
                } else if (score >= 10) {
                    ballX += ballSpeedX * 1.4;
                    ballY += ballSpeedY * 1.4;
                } else if (score >= 5) {
                    ballX += ballSpeedX * 1.2;
                    ballY += ballSpeedY * 1.2;
                } else {
                    ballX += ballSpeedX;
                    ballY += ballSpeedY;
                }

                rod1X = rod1.getBoundingClientRect().x;
                rod2X = rod2.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';



                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    wall_hit.play();
                    ballSpeedX = -ballSpeedX; // Reverses the direction

                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for Rod 1
                if (ballY <= rod1Height) {

                    ballSpeedY = -ballSpeedY; // Reverses the direction

                    score++;

                    // Check if the game ends
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        finish.play();
                        storeWin(rod2Name, score);

                    }

                    bar_hit.play();
                } else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {

                    ballSpeedY = -ballSpeedY; // Reverses the direction

                    score++;

                    // Check if the game ends
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        finish.play();
                        storeWin(rod1Name, score);
                    }

                    bar_hit.play();
                }




            }, 10);
        }
    }


});