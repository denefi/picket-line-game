// audio files
const evil_laugh = new Audio("./audio/evil-laugh.opus");
const saccoVanzetti = new Audio("./audio/sacco-vanzetti.opus");
const hit = new Audio("./audio/hit.wav");
const gameMusic = new Audio("./audio/game-music.mp3");
gameMusic.loop = true;
const scoreUpSound = new Audio("./audio/score-up.wav");
const shootSound = new Audio("./audio/shoot.opus");
//helper Function
function widthRatioConverter(size = 0) {
    //takes the size of the width an converts it to 16:9 ratio for board.
    return (size / 16) * 9;
}
class Game {
    constructor() {
        this.lifesElm = document.getElementById("lifes");
        this.boardElm = document.getElementById("board");
        this.scoreElm = document.querySelector("#score p");
        this.score = 0;
        this.obstacles = [];
        this.player = null;
        this.enemy = null;
        this.gameTimer = null;
    }
    startGame() {
        this.createBasicElements();
        this.setEventListeners();
        gameMusic.play();
        this.startGameLogik();
    }
    createBasicElements() {
        this.boardElm.innerHTML = "";
        this.player = new Player(15, [0, 0], 3);
        this.boardElm.appendChild(this.player.playerElm);
        this.enemy = new Enemy(20, [100, 50]);
        this.boardElm.appendChild(this.enemy.enemyElm);
        this.displayLifes(this.player);
        this.updateScoreDisplay();
    }
    updateScoreDisplay() {
        const paragraph = (this.scoreElm.innerText = `Score: ${this.score}/3`);
    }
    displayLifes(creature) {
        this.lifesElm.innerHTML = "";
        for (let i = 1; i <= creature.lifes; i++) {
            const oneLife = document.createElement("div");
            this.lifesElm.appendChild(oneLife);
        }
    }
    setEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp") {
                this.player.moveUp();
            } else if (event.key === "ArrowDown") {
                this.player.moveDown();
            }
        });
    }
    startGameLogik() {
        let timeCounter = 0;
        this.gameTimer = setInterval(() => {
            timeCounter++;
            if (timeCounter % 17 === 0) {
                this.enemy.move(3);
                this.obstacles.forEach((obstacle) => {
                    //right now all obstacle types move at the same speed
                    obstacle.move();
                    // Collision
                    if (obstacle.detectCollision(this.player)) {
                        //Collison of bad obstacle reduces players life
                        if (obstacle.type === "killer-package") {
                            this.player.lifes--;
                            this.displayLifes(this.player);
                            hit.play();
                        }
                        if (obstacle.type === "co-worker") {
                            this.score++;
                            this.updateScoreDisplay();
                            scoreUpSound.play();
                        }
                        obstacle.delete(this.obstacles);
                        if (this.score >= 3) {
                            this.stopGame("winner");
                        }
                        if (this.player.lifes <= 0) {
                            this.stopGame("looser");
                            evil_laugh.play();
                        }
                    }
                    if (obstacle.outOfGame()) {
                        obstacle.delete(this.obstacles);
                    }
                });
            }
            // Enemy trying to shoot obstacles every 0.1 seconds
            // a obstacle array is passed as different arrays could be
            //implemented in the future to have different behaviour.
            if (timeCounter % 100 === 0) {
                this.enemy.shoot(this.obstacles);
            }
            // create co-worker every ? seconds

            if (timeCounter % 1000 === 0) {
                const coWorker = new Obstacle(
                    15,
                    10,
                    [120, Math.floor(Math.random() * 85)],
                    "co-worker"
                );
                console.log(coWorker);
                this.obstacles.push(coWorker);
            }
            if (timeCounter > 9007199254740990) {
                timeCounter = 0;
            }
        }, 1);
    }
    stopGame(winOrLoose) {
        gameMusic.pause();
        clearInterval(this.gameTimer);
        const childNodes = this.boardElm.childNodes;
        childNodes.forEach((node) => node.remove());
        this.obstacles = [];
        this.boardElm.innerHTML = "";
        if (winOrLoose === "looser") {
            const gameOverH1 = document.createElement("h1");
            gameOverH1.innerText = "Game Over";
            const gameOverImg = document.createElement("div");
            gameOverImg.id = "game-over-img";
            gameOverImg.classList.add("end-of-game-img");

            this.boardElm.appendChild(gameOverH1);
            this.boardElm.appendChild(gameOverImg);
            evil_laugh.play();
        } else if (winOrLoose === "winner") {
            const winnerH1 = document.createElement("h1");
            winnerH1.innerText = "BAM, the warehouse has been unionized!";
            const winnerImg = document.createElement("div");
            winnerImg.id = "winner-img";
            winnerImg.classList.add("end-of-game-img");
            this.boardElm.appendChild(winnerH1);
            this.boardElm.appendChild(winnerImg);
            saccoVanzetti.play();
        }
    }
}

class Player {
    //expects size as Integer and position as array [x,y]
    //both values are in percentage relating to the board div
    constructor(size, position, lifes = 3) {
        this.lifes = lifes;
        this.height = size;
        this.width = widthRatioConverter(size);
        this.posX = position[0];
        this.posY = position[1];
        this.createElement();
    }
    createElement() {
        // Creates DOM Element and sets id, size and position on board.
        this.playerElm = document.createElement("div");
        this.playerElm.id = "player";
        this.playerElm.style.height = this.height + "%";
        this.playerElm.style.width = this.width + "%";
        this.playerElm.style.bottom = this.posY + "%";
        this.playerElm.style.left = this.posX + "%";
    }
    moveUp() {
        this.posY += 10;
        if (this.posY + this.height > 100) {
            this.posY = 100 - this.height;
        }
        this.playerElm.style.bottom = this.posY + "%";
    }
    moveDown() {
        this.posY -= 5;
        if (this.posY < 0) {
            this.posY = 0;
        }
        this.playerElm.style.bottom = this.posY + "%";
    }
}
class Enemy {
    constructor(size, positionArr) {
        this.height = size;
        this.width = widthRatioConverter(size);
        this.posX = positionArr[0] - this.width;
        this.posY = positionArr[1];
        this.movingDirection = "up";
        this.createElm();
    }
    createElm() {
        this.enemyElm = document.createElement("div");
        this.enemyElm.id = "enemy";
        this.enemyElm.style.height = this.height + "%";
        this.enemyElm.style.width = this.width + "%";
        this.enemyElm.style.bottom = this.posY + "%";
        this.enemyElm.style.left = this.posX + "%";
    }
    move(speed = 1) {
        if (this.movingDirection === "up") {
            if (this.posY >= 100) {
                this.movingDirection = "down";
            } else {
                this.posY += speed;
            }
        } else if (this.movingDirection === "down") {
            if (this.posY <= 0 - this.height) {
                this.movingDirection = "up";
            } else {
                this.posY -= speed;
            }
        }

        this.enemyElm.style.bottom = this.posY + "%";
    }
    shoot(obstacleArr) {
        if (Math.random() > 0.4) {
            //calculate the start position of the obstacle which is directly
            //left to the enemy. The Y axis is inherited form enemy.

            const obstacle = new Obstacle(
                10,
                10,
                [this.posX, this.posY],
                "killer-package"
            );
            obstacleArr.push(obstacle);
            shootSound.pause();
            shootSound.currentTime = 0;
            shootSound.play();
        }
    }
}

class Obstacle {
    constructor(
        length = 20,
        width = 20,
        positionArr = [0, 0],
        obstacleType = ""
    ) {
        this.height = length;
        this.width = widthRatioConverter(width);
        [this.posX, this.posY] = positionArr;
        this.type = obstacleType;
        this.obstacleElm = null;
        this.createObstacleElm();
        this.appendObstacleElmToDom();
    }
    createObstacleElm() {
        this.obstacleElm = document.createElement("div");
        if (this.type === "killer-package") {
            this.obstacleElm.id = "killer-package";
        }
        if (this.type === "co-worker") {
            this.obstacleElm.id = "co-worker";
        }
        this.obstacleElm.classList += "obstacle";
        this.obstacleElm.style.height = this.height + "%";
        this.obstacleElm.style.width = this.width + "%";
        this.obstacleElm.style.bottom = this.posY + "%";
        this.obstacleElm.style.left = this.posX + "%";
    }
    appendObstacleElmToDom() {
        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.obstacleElm);
    }
    move(speed = 2) {
        this.posX -= speed;
        this.obstacleElm.style.left = this.posX + "%";
    }
    detectCollision(otherElement) {
        if (
            otherElement.posX < this.posX + this.width &&
            otherElement.posX + otherElement.width > this.posX &&
            otherElement.posY < this.posY + this.height &&
            otherElement.height + otherElement.posY > this.posY
        ) {
            return true;
        }
        return false;
    }
    delete(obstacleArr) {
        this.obstacleElm.remove();
        obstacleArr.splice(obstacleArr.indexOf(this), 1);
    }
    outOfGame() {
        return this.posX < -30;
    }
}

let game = null;
const startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", () => {
    if (game) {
        game.stopGame();
    }
    evil_laugh.pause;
    evil_laugh.currentTime = 0;
    saccoVanzetti.pause();
    saccoVanzetti.currentTime = 0;
    game = new Game();
    game.startGame();
});
