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
  this.down = false;
};

Board.prototype.trackLevel = function() {
  this.level = Math.floor(this.lines / 10);
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
  if (lines === 4 && this.trackTetris) {
    this.score += 1200
  } else if (lines === 4) {
    this.score += 800;
    this.trackTetris = true;
  } else {
    this.score += (lines * 100);
    this.trackTetris = false;
  }
  this.trackLevel();
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
  } else {
    this.checkLoseCondition();
    this.populateCurrentPiece();
    this.findFullRows();
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.getNewPiece();
    this.populateCurrentPiece();
    this.down = false;
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

$(document).ready(function() {
  var left = false;
  var right = false;
  var timePassed = 0;
  var then = Date.now();
  var counter = 600;
  var interval;
  var stop = true;
  var mainCanvas = document.getElementById("gameCanvas");
  var mainContext = mainCanvas.getContext("2d");
  var pieceCanvas = document.getElementById("nextPieceCanvas");
  var pieceContext = pieceCanvas.getContext("2d");
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
  var runGame = function() {
    clearInterval(interval);

    if (board.loss === true) {
      stop = true;
    }
    $(".linesRemoved").text(board.lines);
    $(".score").text(board.score);
    $(".level").text(board.level);
    if (board.down) {
      counter = 40;
    } else {
      var timeSubtraction = 600;
      for (i = 1; i < board.level; i++) {
        if (i < 9) {
          timeSubtraction = timeSubtraction - 60;
        } else {
          timeSubtraction = timeSubtraction - (timeSubtraction * .15);
        }
      }
      counter = timeSubtraction;
    }

    processGame();
    if (board.loss === true) {
      stopGame();
      return;
    }
    if (stop) {
      return;
    }
    board.lowerCurrentPiece();
    interval = setInterval(runGame, counter);
  }

  function startGame() {
    if (stop === true) {
      stop = false;
      interval = setInterval(runGame, counter);
    }
  }
  function stopGame() {
    stop = true;
  }

  setInterval(processGame, 30);

  function processGame() {
    var now = Date.now();
    timePassed += now - then;
    then = now;
    board.drawCanvas(mainContext, mainCanvas);
    board.drawPieceCanvas(pieceContext, pieceCanvas);
    if (left && timePassed > 250) {
      board.leftCurrentPiece();
      timePassed = 0;
    }
    if (right && timePassed > 250) {
      board.rightCurrentPiece();
      timePassed = 0;
    }
  }

  $(document).keydown(function(event) {
    var key = event.which;
    console.log(key);
    if (key === 13) {
      board.paused = !board.paused;
      return;
    }
    if (stop || board.loss || board.paused) {
      return;
    }
    if (key === 37) {
      left = true;
      timePassed = 0;
      board.leftCurrentPiece();
    } else if (key === 39) {
      right = true;
      timePassed = 0;
      board.rightCurrentPiece();
    } else if (key === 40) {
      if (!this.down) {
        board.lowerCurrentPiece();
      }
      board.down = true;
    } else if (key === 38 || key === 83) {
      board.rotatePiece();
    } else if (key === 65) {
      board.reverseRotate();
    }
  });

  $(document).keyup(function(event) {
    var key = event.which;
    if (key === 37) {
      left = false;
    } else if (key === 39) {
      right = false;
    } else if (key === 40) {
      board.down = false;
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

  var audio = new Audio('Audio/tetris.mp3');
  $("#button1").click(function(){
    startGame();
    audio.play();
    audio.loop = true;
  });
  $("#button2").click(function(){
    stopGame();
    board.resetGame();
    audio.pause();
  });
});
