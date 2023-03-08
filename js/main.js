// audio files
const evil_laugh = new Audio("./../audio/evil-laugh.opus");
//helper Function
function widthRatioConverter(size = 0) {
    //takes the size of the width an converts it to 16:9 ratio for board.
    return (size / 16) * 9;
}
class Game {
    constructor() {
        this.gameControlElm = null;
        this.boardElm = null;
        this.player = null;
        this.enemy = null;
        this.obstacles = [];
        this.gameTimer = null;
    }
    startGame() {
        this.createBasicElements();
        this.setEventListeners();
        this.startGameLogik();
    }
    createBasicElements() {
        this.lifesElm = document.getElementById("lifes");
        this.boardElm = document.getElementById("board");
        this.boardElm.innerHTML = "";
        this.player = new Player(15, [0, 0], 3);
        this.boardElm.appendChild(this.player.playerElm);
        this.enemy = new Enemy(20, [100, 50]);
        this.boardElm.appendChild(this.enemy.enemyElm);
        this.displayLifes(this.player);
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
                    obstacle.move();
                    if (obstacle.detectCollision(this.player)) {
                        this.player.lifes--;
                        this.displayLifes(this.player);
                        obstacle.delete(this.obstacles);
                        console.log(`Lifes left: ${this.player.lifes}`);
                        if (this.player.lifes <= 0) {
                            this.stopGame();
                            evil_laugh.play();
                        }
                    }
                    if (obstacle.outOfGame()) {
                        obstacle.delete(this.obstacles);
                    }
                });
            }
            if (timeCounter % 100 === 0) {
                this.enemy.shoot(this.obstacles);
            }
            if (timeCounter > 9007199254740990) {
                timeCounter = 0;
            }
        }, 1);
    }
    stopGame() {
        clearInterval(this.gameTimer);
        const childNodes = this.boardElm.childNodes;
        childNodes.forEach((node) => node.remove());
        this.obstacles = [];
        this.boardElm.innerHTML = "";
        const gameOverH1 = document.createElement("h1");
        gameOverH1.innerText = "Game Over";
        const gameOverImg = document.createElement("div");
        gameOverImg.id = "game-over-img";
        this.boardElm.appendChild(gameOverH1);
        this.boardElm.appendChild(gameOverImg);
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
            const obstaclePositionX = this.posX - this.width;
            const obstacle = new Obstacle(
                10,
                [obstaclePositionX, this.posY],
                "killer-package"
            );
            obstacleArr.push(obstacle);
        }
    }
}

class Obstacle {
    constructor(size = 20, positionArr = [0, 0], obstacleType = "") {
        this.height = size;
        this.width = widthRatioConverter(size);
        [this.posX, this.posY] = positionArr;
        this.type = obstacleType;
        this.obstacleElm = null;
        this.createObstacleElm();
        this.appendObstacleElmToDom();
    }
    createObstacleElm() {
        this.obstacleElm = document.createElement("div");
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
    move() {
        this.posX = this.posX - 2;
        this.obstacleElm.style.left = this.posX + "%";
    }
    detectCollision(otherElement) {
        if (
            otherElement.posX < this.posX + this.width &&
            otherElement.posX + otherElement.width > this.posX &&
            otherElement.posY < this.posY + this.height &&
            otherElement.posY + otherElement.width > this.posY
        ) {
            return true;
        }
        return false;
    }
    delete(obstacleArr) {
        this.obstacleElm.remove();
        obstacleArr.shift();
    }
    outOfGame() {
        return this.posX < 0;
    }
}

let game = null;
const startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", () => {
    if (game) {
        game.stopGame();
    }
    evil_laugh.pause();
    evil_laugh.currentTime = 0;
    game = new Game();
    game.startGame();
});
