class Game {
    constructor() {
        this.boardElm = null;
        this.player = null;
        this.enemy = null;
        this.obstacles = [];
    }
    startGame() {
        this.createBasicElements();
        this.setEventListeners();
        this.startGameLogik();
    }
    createBasicElements() {
        this.boardElm = document.getElementById("board");
        this.boardElm.id = "board";
        this.player = new Player(20, [0, 0]);
        this.boardElm.appendChild(this.player.playerElm);
        this.enemy = new Enemy(20, [0, 50]);
        this.boardElm.appendChild(this.enemy.enemyElm);
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
        setInterval(() => {
            timeCounter++;
            if (timeCounter % 17 === 0) {
                this.enemy.move();
            }
            if (timeCounter > 9007199254740990) {
                timeCounter = 0;
            }
        }, 1);
    }
}

class Player {
    //expects size as Integer and position as array [x,y]
    //both values are in percentage relating to the board div
    constructor(size, position) {
        this.size = size;
        this.posX = position[0];
        this.posY = position[1];
        this.createElement();
    }
    createElement() {
        // Creates DOM Element and sets id, size and position on board.
        this.playerElm = document.createElement("div");
        this.playerElm.id = "player";
        this.playerElm.style.height = this.size + "%";
        this.playerElm.style.width = (this.size / 16) * 9 + "%";
        this.playerElm.style.bottom = this.posY + "%";
        this.playerElm.style.left = this.posX + "%";
    }
    moveUp() {
        this.posY += 20;
        if (this.posY + this.size > 100) {
            this.posY = 100 - this.size;
        }
        console.log(this.playerElm.style.bottom);
        this.playerElm.style.bottom = this.posY + "%";
    }
    moveDown() {
        this.posY -= 20;
        if (this.posY < 0) {
            this.posY = 0;
        }
        this.playerElm.style.bottom = this.posY + "%";
    }
}
class Enemy {
    constructor(size, positionArr) {
        this.size = size;
        this.posX = (positionArr[0] / 16) * 9;
        this.posY = positionArr[1];
        this.movingDirection = "up";
        this.createElm();
    }
    createElm() {
        this.enemyElm = document.createElement("div");
        this.enemyElm.id = "enemy";
        this.enemyElm.style.height = this.size + "%";
        this.enemyElm.style.width = (this.size / 16) * 9 + "%";
        this.enemyElm.style.bottom = this.posY + "%";
        this.enemyElm.style.right = this.posX + "%";
    }
    move() {
        if (this.movingDirection === "up") {
            if (this.posY >= 100 - this.size) {
                this.movingDirection = "down";
                console.log("change direction");
            } else {
                this.posY++;
            }
        } else if (this.movingDirection === "down") {
            if (this.posY <= 0) {
                this.movingDirection = "up";
            } else {
                this.posY--;
            }
        }

        this.enemyElm.style.bottom = this.posY + "%";
    }
}

const myGame = new Game();
myGame.startGame();
