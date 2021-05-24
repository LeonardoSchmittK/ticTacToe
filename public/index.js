const xPointsElement = document.querySelector(".game--xPoints");
const oPointsElement = document.querySelector(".game--oPoints");
const squares = [...document.querySelectorAll(".sqr")];
const winnerResult = document.querySelector(".game--winner");
const gameTitle = document.querySelector(".game--title");
const gameBoardElement = document.querySelector(".board");

const players = ["X", "O"];

let actualPlayer;
let round = -1;
let plays = 0;
let initialPlayer = players[0];
let initialPlayerPoints = 0;

let xPoints = sessionStorage.xPoints
   ? sessionStorage.xPoints
   : sessionStorage.setItem("xPoints", initialPlayerPoints);

let oPoints = sessionStorage.oPoints
   ? sessionStorage.oPoints
   : sessionStorage.setItem("oPoints", initialPlayerPoints);

appendText(gameTitle, `Player: ${initialPlayer}`);
displayOPoints();
displayXPoints();
emptySquares();

function emptySquares() {
   squares.forEach((square) => (square.innerHTML = " "));
}

function removeDuplicatesFromArray(arr) {
   const newArr = [];

   for (arrItem in arr) newArr.push([...new Set(arr[arrItem])]);

   return newArr;
}

function sortItemsCrescent(arr) {
   return arr.sort((a, b) => a.length - b.length);
}

function chunkArrayInGroups(arr, size) {
   var newArr = [];

   for (var i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
   }
   return newArr;
}

function appendHTML(el, html) {
   el.innerHTML = html;
}
function appendText(el, text) {
   el.textContent = text;
}

function handlePointerEvents(el, handler) {
   el.style.pointerEvents = handler;
}

function countRound(type) {
   return type === "next" ? round++ : round--;
}

function countPlays(type) {
   return type === "increment" ? plays++ : plays--;
}

function changePlayer(el) {
   countRound("next");
   countPlays("increment");
   actualPlayer = players[round];

   if (round === players.length - 1) round = -1;

   appendText(gameTitle, `Player: ${players[round + 1]}`);
   appendText(el, actualPlayer);
   handlePointerEvents(el, "none");

   plays >= 3 && checkFinalGame(el);
}

function checkFinalGame(el) {
   let gameElementsContent = [];

   for (let i = 1; i <= 9; ++i) {
      let square = document.querySelector(`.sqr-${i}`).textContent;
      gameElementsContent.push(square ? square : " ");
   }

   let boardGame = chunkArrayInGroups(gameElementsContent, 3);

   const [diagonals, rows, columns] = [
      getDiagonals(boardGame),
      getRows(boardGame),
      getColumns(boardGame),
   ];

   const allBoardPlacements = [...diagonals, ...rows, ...columns];

   const removeDuplicates = sortItemsCrescent(
      removeDuplicatesFromArray(allBoardPlacements)
   );

   let winner =
      removeDuplicates[0].length === 1 ? removeDuplicates[0][0] : " ";
   if (
      removeDuplicates[0][0] === " " &&
      removeDuplicates[1].length === 1 &&
      removeDuplicates[1][1] !== " "
   ) {
      winner = removeDuplicates[1][0];
   }

   checkWinner(winner);
   checkTie();
}

function getColumns(boardGame) {
   return [
      [boardGame[0][0], boardGame[1][0], boardGame[2][0]],
      [boardGame[0][1], boardGame[1][1], boardGame[2][1]],
      [boardGame[0][2], boardGame[1][2], boardGame[2][2]],
   ];
}

function getRows(boardGame) {
   const rows = [];
   for (let i = 0; i < boardGame.length; ++i) {
      rows.push(boardGame[i]);
   }
   return rows;
}

function getDiagonals(boardGame) {
   return [
      [boardGame[0][0], boardGame[1][1], boardGame[2][2]],
      [boardGame[0][2], boardGame[1][1], boardGame[2][0]],
   ];
}

function checkTie() {
   const isNotTie = !squares.some((i) => i.innerHTML === " ");

   isNotTie && finishGame("tie");
}

function checkWinner(winner) {
   return winner !== " "
      ? finishGame("winner", winner)
      : appendText(winnerResult, " ");
}

function displayWinner(winner) {
   const innerHTMLWinner = `${winner} won </br> <button class='game--restartButton' onclick='restartGame()'> Restart </button>`;
   appendHTML(winnerResult, innerHTMLWinner);
}

function increasePoints(winner) {
   let storagedNamePoints = `${winner.toLowerCase()}Points`;

   sessionStorage[storagedNamePoints] =
      Number(sessionStorage[storagedNamePoints]) + 1;
}

function displayOPoints() {
   const points = sessionStorage.oPoints;
   const template = `O: ${points}`;
   appendHTML(oPointsElement, template);
}

function displayXPoints() {
   const points = sessionStorage.xPoints;
   const template = `X: ${points}`;
   appendHTML(xPointsElement, template);
}

function tieGame() {
   const innerHTMLTie = `Tie <button class="game--restartButton" onclick='restartGame()'>Restart</button>`;
   appendHTML(winnerResult, innerHTMLTie);
   addClass(gameBoardElement, "tie");
}

function restartGame() {
   appendText(winnerResult, " ");
   animateBoardColor({});

   squares.forEach((square) => {
      handlePointerEvents(square, "auto");
      enableAllSquares();
      gameBoardElement.className = "board";
      appendText(square, " ");
   });
}

const animationConfig = {
   gradientPercentage: 30,
   boardAnimationDuration: 10,
};

function animateBoardColor({
   gradientPercentage: percentage = 30,
   boardAnimationDuration: duration = 10,
}) {
   let animate = setInterval(() => {
      percentage = percentage + 1;

      gameBoardElement.style.background = `radial-gradient(#808080 ${percentage}%,#fff 20%)`;

      percentage >= 100 && clearInterval(animate);
   }, duration);
}

this.onload = () => animateBoardColor(animationConfig);

function disabledAllSquares() {
   squares.forEach((square) => {
      square.disabled = true;
   });
}

function enableAllSquares() {
   squares.forEach((square) => {
      square.disabled = false;
   });
}

function addClass(el, classToAdd) {
   el.classList.add(classToAdd);
}

function executeWinner(player) {
   displayWinner(player);
   increasePoints(player);
   addClass(gameBoardElement, "finished");

   player === "X" ? displayXPoints() : displayOPoints();
}

function executeDefaultFinishingBehavior() {
   disabledAllSquares();
}

function finishGame(type, player) {
   executeDefaultFinishingBehavior();
   switch (type) {
      case "winner":
         executeWinner(player);
         break;

      case "tie":
         tieGame();
         break;

      default:
         break;
   }
}
