class Game {
    constructor() {
        this.player = null;
        this.enemy = null;
        this.obstacles = [];
        this.boardElm = document.getElementById("board");
    }
    startGame() {
        this.player = new Player();
        this.enemy = new Enemy();
        this.setEventListeners();
        this.startGameLogik();
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
    moveUp() {
        console.log("player moves up")
            
    }
    moveDown() {
        console.log("player moves down")
    }
}
class Enemy {}

const myGame = new Game();
myGame.startGame();