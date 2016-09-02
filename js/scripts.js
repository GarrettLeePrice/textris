function Board() {
  this.rows = [];
  this.currentPiece = this.getNewPiece();
  this.nextPiece = this.getNewPiece();
  this.buildBoard();
  this.lines = 0;
  this.loss = false;
  this.score = 0;
  this.level = 0;
  this.trackTetris = false;
  this.paused = false;
  this.start = false;
  this.frames = 48;
  this.downPressed = false;
  this.bonusPoints = 0;
};

Board.prototype.trackLevel = function() {
  this.level = Math.floor(this.lines / 10);
  switch (this.level) {
    case 0:
      this.frames = 48;
      break;
    case 1:
      this.frames = 43;
      break;
    case 2:
      this.frames = 38;
      break;
    case 3:
      this.frames = 33;
      break;
    case 4:
      this.frames = 28;
      break;
    case 5:
      this.frames = 23;
      break;
    case 6:
      this.frames = 18;
      break;
    case 7:
      this.frames = 13;
      break;
    case 8:
      this.frames = 8;
      break;
    case 9:
      this.frames = 6;
      break;
    case 10:
    case 11:
    case 12:
      this.frames = 5;
      break;
    case 13:
    case 14:
    case 15:
      this.frames = 4
      break;
    case 16:
    case 17:
    case 18:
      this.frames = 3;
      break;
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
      this.frames = 2;
      break;
    case 29:
      this.frames = 1;
  }
  console.log(this.level);
  console.log(this.frames);
};

Board.prototype.buildBoard = function() {
  for (var i = 0; i < 24; i++) {
    var row = [];
    for(j = 0; j < 10; j++) {
      row.push("O");
    }
    this.rows.push(row);
  }
};

Board.prototype.removeRow = function(row) {
  this.rows.splice(row, 1);
  var newRow = [];
  for (var i = 0; i < 10; i++) {
    newRow.push("O");
  }
  this.rows.unshift(newRow);
  this.lines++;
};

Board.prototype.findFullRows = function() {
  var linesToClear = 0;
  for (var i = 0; i < 24; i++) {
    var test = true;
    for (j = 0; j < 10; j++) {
      if (this.rows[i][j] === "O") {
        var test = false;
        break;
      }
    }
    if (!test) {
      continue;
    }
    linesToClear++;
    this.removeRow(i);
  }
  if (linesToClear !== 0) {
    this.addToScore(linesToClear);
  }
};

Board.prototype.addToScore = function(lines) {
  this.trackLevel();
  if (lines === 1) {
    this.score += 40 * (this.level + 1);
  } else if (lines === 2) {
    this.score += 100 * (this.level + 1);
  } else if (lines === 3) {
    this.score += 300 * (this.level + 1);
  } else if (lines === 4) {
    this.score += 1200 * (this.level +1);
  }
}

Board.prototype.lowerCurrentPiece = function() {
  if (this.paused) {
    return;
  }
  var newLocation = [this.currentPiece.location[0] + 1, this.currentPiece.location[1]]
  if (this.checkSpace(newLocation)) {
    this.clearCurrentPieceLocation();
    this.currentPiece.location = newLocation;
    this.populateCurrentPiece();
    if (this.downPressed) {
      this.bonusPoints++;
    } else {
      this.bonusPoints = 0;
    }
  } else {
    this.checkLoseCondition();
    this.populateCurrentPiece();
    this.findFullRows();
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.getNewPiece();
    this.populateCurrentPiece();
    this.score += this.bonusPoints;
    this.bonusPoints = 0;
  }
};

Board.prototype.rightCurrentPiece = function() {
  var newLocation = [this.currentPiece.location[0], this.currentPiece.location[1] + 1];
  if (this.checkSpace(newLocation)) {
    this.clearCurrentPieceLocation();
    this.currentPiece.location = newLocation;
    this.populateCurrentPiece();
  }
};

Board.prototype.leftCurrentPiece = function() {
  var newLocation = [this.currentPiece.location[0], this.currentPiece.location[1] - 1];
  if (this.checkSpace(newLocation)) {
    this.clearCurrentPieceLocation();
    this.currentPiece.location = newLocation;
    this.populateCurrentPiece();
  }
};

Board.prototype.clearCurrentPieceLocation = function() {
  for (var i = 0; i < this.currentPiece.occupies.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.occupies[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.occupies[i][1];
    if (row >= 0) {
      this.rows[row][column] = "O";
    }
  }
}

Board.prototype.partOfCurrentPiece = function(location) {
  var currentSpaces = [];
  for (var i = 0; i < this.currentPiece.occupies.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.occupies[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.occupies[i][1];
    currentSpaces.push([row, column]);
  }
  for (var i = 0; i < currentSpaces.length; i++) {
    if (currentSpaces[i][0] === location[0] && currentSpaces[i][1] === location[1]) {
      return true;
    }
  }
  return false;
};

Board.prototype.checkSpace = function(newLocation) {
  for (var i = 0; i < this.currentPiece.occupies.length; i++) {
    var row = newLocation[0] + this.currentPiece.occupies[i][0];
    var column = newLocation[1] + this.currentPiece.occupies[i][1];
    if (row >= 24 || column >= 10 || column < 0) {
      return false;
    }
    // debugger;
    if (this.rows[row][column] !== "O") {
      if (!this.partOfCurrentPiece([row, column])) {
        return false;
      }
    }
  }
  return true;
};

Board.prototype.populateCurrentPiece = function() {
  for (var i = 0; i < this.currentPiece.occupies.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.occupies[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.occupies[i][1];
    if (row >= 0) {
      this.rows[row][column] = this.currentPiece.color;
    }
  }
};

Board.prototype.rotatePiece = function() {
  if (this.currentPiece.pieceType === "line") {
    this.rotateLine();
    return;
  } else if (this.currentPiece.pieceType === "square") {
    return;
  }
  var newSpacesOccupied = [];
  for (var i = 0; i < this.currentPiece.spacesOccupied.length; i++) {
    switch (this.currentPiece.spacesOccupied[i]) {
      case 1:
        newSpacesOccupied.push(7)
        break;
      case 2:
        newSpacesOccupied.push(4);
        break;
      case 3:
        newSpacesOccupied.push(1)
        break;
      case 4:
        newSpacesOccupied.push(8)
        break;
      case 5:
        newSpacesOccupied.push(5)
        break;
      case 6:
        newSpacesOccupied.push(2)
        break;
      case 7:
        newSpacesOccupied.push(9)
        break;
      case 8:
        newSpacesOccupied.push(6)
        break;
      case 9:
        newSpacesOccupied.push(3)
        break;
    }
  }
  var testSpaces = [];
  for (var i = 0; i < newSpacesOccupied.length; i++) {
    var space = newSpacesOccupied[i]-1;
    var row = this.currentPiece.location[0] + this.currentPiece.possibleSpaces[space][0];
    var column = this.currentPiece.location[1] + this.currentPiece.possibleSpaces[space][1];
    testSpaces.push([row, column]);
  }
  if (this.checkRotateSpace(testSpaces)) {
    this.clearCurrentPieceLocation();
    this.currentPiece.spacesOccupied = newSpacesOccupied;
    this.currentPiece.setOccupies();
    this.populateCurrentPiece();
  }
};

Board.prototype.rotateLine = function() {
  var newSpacesOccupied = []
  if (this.currentPiece.spacesOccupied.includes(1)) {
    newSpacesOccupied.push(2, 5, 8, 11);
  } else {
    newSpacesOccupied.push(1, 2, 3, 10)
  }
  var testSpaces = [];
  for (var i = 0; i < newSpacesOccupied.length; i++) {
    var space = newSpacesOccupied[i]-1;
    var row = this.currentPiece.location[0] + this.currentPiece.possibleSpaces[space][0];
    var column = this.currentPiece.location[1] + this.currentPiece.possibleSpaces[space][1];
    testSpaces.push([row, column]);
  }
  if (this.checkRotateSpace(testSpaces)) {
    this.clearCurrentPieceLocation();
    this.currentPiece.spacesOccupied = newSpacesOccupied;
    this.currentPiece.setOccupies();
    this.populateCurrentPiece();
  }
};

Board.prototype.reverseRotate = function() {
  if (this.currentPiece.pieceType === "line") {
    this.rotateLine();
    return;
  } else if (this.currentPiece.pieceType === "square") {
    return;
  }
  var newSpacesOccupied = [];
  for (var i = 0; i < this.currentPiece.spacesOccupied.length; i++) {
    switch (this.currentPiece.spacesOccupied[i]) {
      case 1:
        newSpacesOccupied.push(3)
        break;
      case 2:
        newSpacesOccupied.push(6);
        break;
      case 3:
        newSpacesOccupied.push(9)
        break;
      case 4:
        newSpacesOccupied.push(2)
        break;
      case 5:
        newSpacesOccupied.push(5)
        break;
      case 6:
        newSpacesOccupied.push(8)
        break;
      case 7:
        newSpacesOccupied.push(1)
        break;
      case 8:
        newSpacesOccupied.push(4)
        break;
      case 9:
        newSpacesOccupied.push(7)
        break;
    }
  }
  var testSpaces = [];
  for (var i = 0; i < newSpacesOccupied.length; i++) {
    var space = newSpacesOccupied[i]-1;
    var row = this.currentPiece.location[0] + this.currentPiece.possibleSpaces[space][0];
    var column = this.currentPiece.location[1] + this.currentPiece.possibleSpaces[space][1];
    testSpaces.push([row, column]);
  }
  if (this.checkRotateSpace(testSpaces)) {
    this.clearCurrentPieceLocation();
    this.currentPiece.spacesOccupied = newSpacesOccupied;
    this.currentPiece.setOccupies();
    this.populateCurrentPiece();
  }
};

Board.prototype.checkRotateSpace = function(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    if (this.rows[coordinates[i][0]][coordinates[i][1]] !== "O") {
      if (!this.partOfCurrentPiece(coordinates[i])) {
        return false;
      }
    }
  }
  return true;
};

Board.prototype.getNewPiece = function() {
  var newPiece = new Pieces();
  var rando = Math.ceil(Math.random() * 7);
  switch (rando) {
    case 1:
      newPiece.setToT();
      break;
    case 2:
      newPiece.setToSquare();
      break;
    case 3:
      newPiece.setToL();
      break;
    case 4:
      newPiece.setToReverseL();
      break;
    case 5:
      newPiece.setToZ();
      break;
    case 6:
      newPiece.setToReverseZ();
      break;
    case 7:
      newPiece.setToLine();
      break;
  }
  return newPiece;
};

Board.prototype.resetGame = function() {
  this.rows = [];
  this.currentPiece = this.getNewPiece();
  this.nextPiece = this.getNewPiece();
  this.buildBoard();
  this.lines = 0;
  this.loss = false;
  this.score = 0;
  this.level = 0;
  this.loss = false;
};

Board.prototype.checkLoseCondition = function() {
  for (var i = 0; i < this.rows[3].length; i++) {
    if (this.rows[3][i] !== "O") {
      this.loss = true;
      audio.pause();
      audio2.play();
    }
  }
};

// Pieces object starts here
function Pieces() {
  this.location = [2, 4];
  this.occupies = [];
  this.pieceType;
  this.possibleSpaces = [[1,-1], [1,0], [1,1], [0,-1], [0,0], [0,1], [-1,-1], [-1,0], [-1,1], [1,2], [-2,0]];
  this.spacesOccupied = [];
  this.color;
};

Pieces.prototype.setOccupies = function() {
  /* takes this.spacesOccupied and converts it to an array of the proper relative coordinates */
  this.occupies = [];
  for (var i = 0; i < this.spacesOccupied.length; i++) {
    this.occupies.push(this.possibleSpaces[this.spacesOccupied[i] - 1]);
  }
};

Pieces.prototype.setToT = function() {
  this.pieceType = "t";
  this.spacesOccupied.push(2, 4, 5, 6);
  this.setOccupies();
  this.color = "blue";
};

Pieces.prototype.setToSquare = function() {
  this.pieceType = "square";
  this.spacesOccupied.push(1, 2, 4, 5);
  this.setOccupies();
  this.color = "red";
};

Pieces.prototype.setToZ = function() {
  this.pieceType = "z";
  this.spacesOccupied.push(1, 2, 5, 6);
  this.setOccupies();
  this.color = "yellow";
};

Pieces.prototype.setToReverseZ = function() {
  this.pieceType="reverseZ";
  this.spacesOccupied.push(2, 3, 4, 5);
  this.setOccupies();
  this.color = "orange";
};

Pieces.prototype.setToL = function() {
  this.pieceType="l";
  this.spacesOccupied.push(1, 4, 5, 6);
  this.setOccupies();
  this.color = "green";
};

Pieces.prototype.setToReverseL = function() {
  this.pieceType = "reverseL";
  this.spacesOccupied.push(3, 4, 5, 6);
  this.setOccupies();
  this.color = "purple";
};

Pieces.prototype.setToLine = function() {
  this.pieceType = "line";
  this.spacesOccupied.push(1,2,3,10);
  this.setOccupies();
  this.color = "magenta";
};

// front end logic starts here
Board.prototype.drawCanvas = function(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  if (this.loss) {
    var loseImage = new Image();
    loseImage.src = "img/youLose.jpg";
    loseImage.width = canvas.width;
    context.drawImage(loseImage, 0, 0);
    context.stroke();
    context.closePath();
    return;
  } else if (this.paused) {
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("Paused", 0, 50);
    context.fillStyle = "black";
    context.stroke()
    context.closePath();
    audio2.pause();
    return;
  }

  var squareWidth = canvas.width / 10;
  var currentRow = 0;
  var currentColumn = 0;
  // context.rect(currentColumn, currentRow, squareWidth, squareWidth);

  for (var i = 4; i < 24; i++) {
    for (j = 0; j < 10; j++) {
      if (this.rows[i][j] !== "O") {
        context.fillStyle=this.rows[i][j];
        context.fillRect(currentColumn, currentRow, squareWidth, squareWidth);
        context.fillStyle="black";
        context.strokeRect(currentColumn, currentRow, squareWidth, squareWidth);
      }
      currentColumn += squareWidth;
    }
    currentRow += squareWidth;
    currentColumn = 0;
  }
  context.stroke();
  context.closePath();
};

Board.prototype.drawPieceCanvas = function(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (this.loss) {
    return;
  } else if (this.paused) {
    return;
  }
  context.beginPath();
  var squareWidth = canvas.width / 4;
  var currentRow = 0;
  var currentColumn = 0;
  var middle = [squareWidth, squareWidth * 2];
  for (var i = 0; i < this.nextPiece.occupies.length; i++) {
    currentColumn = middle[0] + (this.nextPiece.occupies[i][1] * squareWidth);
    currentRow = middle[1] + (this.nextPiece.occupies[i][0] * squareWidth);
    context.fillStyle = this.nextPiece.color;
    context.fillRect(currentColumn, currentRow, squareWidth, squareWidth);
    context.fillStyle = "black";
    context.strokeRect(currentColumn, currentRow, squareWidth, squareWidth);
  }
  context.stroke();
  context.closePath();

};

var board = new Board();
var audio2 = new Audio('Audio/Mo_Harp.ogg');
var audio = new Audio('Audio/tetris.mp3');

$(document).ready(function() {
  var framesPassed = 0;
  var leftPressed = false;
  var leftHeld = 0;
  var rightPressed = false;
  var rightHeld = 0;
  var downPressed = false;
  var mainCanvas = document.getElementById("gameCanvas");
  var mainContext = mainCanvas.getContext("2d");
  var pieceCanvas = document.getElementById("nextPieceCanvas");
  var pieceContext = pieceCanvas.getContext("2d");
  setInterval(runGame, 1000/60.0988);
  if ($(window).height() < 961) {
    $(".jumbotron").addClass("hidden");
    $("#gameCanvas").attr("width", "250");
    $("#gameCanvas").attr("height", "500");
  } else {
    $(".jumbotron").removeClass("hidden");
    $("#gameCanvas").attr("width", "300");
    $("#gameCanvas").attr("height", "600");
  };
  if ($(window).width()< 961) {
    $("#gameCanvas").attr("width", "250");
    $("#gameCanvas").attr("height", "500");
  } else {
    $("#gameCanvas").attr("width", "300");
    $("#gameCanvas").attr("height", "600");
  };

  function runGame() {
    if (!board.start) {
      return;
    }
    framesPassed++;
    if (leftPressed) {
      leftHeld++;
      if (leftHeld === 16) {
        board.leftCurrentPiece();
        board.drawCanvas(mainContext, mainCanvas);
        leftHeld = 10;
      }
    }
    if (rightPressed) {
      rightHeld++;
      if (rightHeld === 16) {
        board.rightCurrentPiece();
        board.drawCanvas(mainContext, mainCanvas);
        rightHeld = 10;
      }
    }
    if (framesPassed === board.frames || downPressed && framesPassed >= 4) {
      board.lowerCurrentPiece();
      board.drawCanvas(mainContext, mainCanvas);
      framesPassed = 0;
    }
    updateDisplays();
  };

  function updateDisplays() {
    $(".linesRemoved").text(board.lines);
    $(".score").text(board.score);
    $(".level").text(board.level);
    board.drawPieceCanvas(pieceContext, pieceCanvas);
  };

  $(document).keydown(function(event) {
    var key = event.which;
    if (key === 13) {
      board.paused = !board.paused;
      board.drawCanvas(mainContext, mainCanvas);
      return;
    }
    if (board.loss || board.paused) {
      return;
    }
    if (key === 37) {
      if (!leftPressed) {
        board.leftCurrentPiece();
        board.drawCanvas(mainContext, mainCanvas);
      }
      leftPressed = true;
    } else if (key === 39) {
      if (!rightPressed) {
        board.rightCurrentPiece();
        board.drawCanvas(mainContext, mainCanvas);
      }
      rightPressed = true;
    } else if (key === 40) {
      downPressed = true;
      board.downPressed = true;
    } else if (key === 38 || key === 83) {
      board.rotatePiece();
      board.drawCanvas(mainContext, mainCanvas);
    } else if (key === 65) {
      board.reverseRotate();
      board.drawCanvas(mainContext, mainCanvas);
    }
  });

  $(document).keyup(function(event) {
    var key = event.which;
    if (key === 37) {
      leftPressed = false;
      leftHeld = 0;
    } else if (key === 39) {
      rightPressed = false;
      rightHeld = 0;
    } else if (key === 40) {
      downPressed = false;
      board.downPressed = false;
    }
  })

  $(window).resize(function() {
    if ($(window).width()< 961) {
      $(".jumbotron").addClass("hidden");
      $("#gameCanvas").attr("width", "250");
      $("#gameCanvas").attr("height", "500");
    } else {
      $("#gameCanvas").attr("width", "300");
      $("#gameCanvas").attr("height", "600");
    }
  });
  $(window).resize(function() {
    if ($(window).height() < 961) {
      $(".jumbotron").addClass("hidden");
      $("#gameCanvas").attr("width", "250");
      $("#gameCanvas").attr("height", "500");
    } else {
      $(".jumbotron").removeClass("hidden");
      $("#gameCanvas").attr("width", "300");
      $("#gameCanvas").attr("height", "600");
    }
  });


  $("#button1").click(function(){
    board.start = true;
    audio.play();
    audio2.pause();
    audio.loop = true;
  });
  $("#button2").click(function(){
    board = new Board();
    board.drawCanvas(mainContext, mainCanvas);
    audio2.pause();
    audio.pause();
  });
});
