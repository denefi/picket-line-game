class Game {
    constructor() {
        this.player = null;
        this.enemy = null;
        this.obstacles = [];
        this.boardElm = document.getElementById("board");
        this.boardElm.id = "board";
    }
    startGame() {
        this.createBasicElements();
        this.setEventListeners();
        this.startGameLogik();
    }
    createBasicElements() {
        this.player = new Player(20, [0, 0]);
        this.boardElm.appendChild(this.player.playerElm);
        this.enemy = new Enemy();
    }
    setEventListeners() {
        document.addEventListener("keydown", event => {
            if(event.key === "ArrowUp") {
                this.player.moveUp();
            }
            else if (event.key === "ArrowDown") {
                this.player.moveDown();
            }
            
        });
    }
    startGameLogik() {}

}

class Player {
    //expects size as Integer and position as array [x,y]
    //both values are in percentage relating to the board div
    constructor(size, position) {
        this.size = size;
        this.posX = position[0];
        this.posY = position[1];
        this.createDiv();
    }
    createDiv() {
        // Creates DOM Element and sets id, size and position on board. 
        this.playerElm = document.createElement("div");
        this.playerElm.id = "player";
        this.playerElm.style.height = this.size + "%";
        this.playerElm.style.width = this.size / 16 * 9 + "%";
        this.playerElm.style.bottom = this.posY + "%";
        this.playerElm.style.left = this.posX + "%";
    }
    moveUp() {
        this.posY += 20;
        if (this.posY + this.size > 100) {
            this.posY = 100 - this.size;
        }
        console.log(this.playerElm.style.bottom)
        this.playerElm.style.bottom = this.posY + "%";
    }
    moveDown() {
        this.posY -= 20;
        if (this.posY  < 0) {
            this.posY = 0;
        }
        this.playerElm.style.bottom = this.posY + "%";
    }
}
class Enemy {}

const myGame = new Game();
myGame.startGame();