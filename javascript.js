const start = document.querySelector(".start-button");
const reset = document.querySelector(".reset-button");

// player factory function
const createPlayer = (name, marker) => {
    return {name, marker};
}

// this is the game board module
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]; // 9 empty arrays for 9 squares
    const squares = document.querySelectorAll(".square-grid");

    // render the gameboard and add an evenlistener
    const renderBoard = () => {
        for (let i = 0; i < 9; i++) {
            squares[i].textContent = board[i];
        }
        // add eventlister to each box
        squares.forEach((square) => {
            square.addEventListener("click", displayController.playGame);
        })
    }
    
    // initialize the X and O in the gameBoard
    const updateBoard = (i, value) => {
        board[i] = value;
        renderBoard();
    }

    // returns board so it cannot be modified
    const getGameBoard = () => board;

    return { renderBoard, updateBoard, getGameBoard };
})();

// this is the display controller module
const displayController = (() => {
    let players = [];
    let currentPlayer;
    let gameOver;

    const start = () => {
        currentPlayer = 0;
        gameOver = false;
        gameBoard.renderBoard();
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O"),
        ]

        if (players == "") {
            return;
        } 
    }

    const playGame = (event) => {
        if (gameOver) {
            return;
        }

        // check if the array index clicked is correct
        let index = event.target.id;
        console.log(index); 

        if (gameBoard.getGameBoard()[index] !== "")
            return;
        gameBoard.updateBoard(index, players[currentPlayer].marker);

        // check for winners and ties
        if (checkWinner(gameBoard.getGameBoard(), players[currentPlayer].marker)) {
            gameOver = true;
            renderMessage(`${players[currentPlayer].name} won!`)
        } else if (checkTie(gameBoard.getGameBoard())) {
            gameOver = true;
            renderMessage(`It's a Tie!`)
        }

        // switch players
        currentPlayer = currentPlayer === 0 ? 1 : 0;
    }

    const renderMessage = (message) => {
        document.querySelector(".display-winner").innerHTML = message;
    }

    // resets entire board
    const restart = () => {
        for (let i = 0; i < 9; i++) {
            gameBoard.updateBoard(i, "");
        }
        gameBoard.renderBoard();
        gameOver = false;
        document.querySelector(".display-winner").innerHTML = "";
    }

    return { start, playGame, renderMessage, restart };
})();

// function to check winner
function checkWinner(board) {
    const winningCombinations  = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // check if the current combination is a win or not
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true
        }
    }
    return false
}

// function to check ties
function checkTie(board) {
    return board.every(cell => cell !== "");
}

// DOM for buttons
start.addEventListener("click", () => {
    const gameBoard = document.querySelector(".gameboard");
    gameBoard.classList.remove("hide");

    displayController.start();
});

reset.addEventListener("click", () => {
    displayController.restart();
});