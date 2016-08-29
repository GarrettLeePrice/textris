function Board() {
  this.rows = [];
  this.currentPiece = this.getNewPiece();
  this.buildBoard();
  this.lines = 0;
};

Board.prototype.buildBoard = function() {
  for (i = 0; i < 20; i++) {
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
  for (i = 0; i < 10; i++) {
    newRow.push("O");
  }
  this.rows.unshift(newRow);
  this.displayBoard();
  this.lines++;
  // console.log(this.lines);
};

Board.prototype.findFullRows = function() {
  for (i = 0; i < 20; i++) {
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
    this.removeRow(i);
  }
};

Board.prototype.lowerCurrentPiece = function() {
  if (this.isBottomClear()) {
    this.clearCurrentPieceLocation();
    this.currentPiece.location[0]++;
    this.populateCurrentPiece();
  } else {
    this.checkLoseCondition();
    this.findFullRows();
    this.currentPiece = this.getNewPiece();
    this.populateCurrentPiece();
  }
};

Board.prototype.isBottomClear = function() {
  for (i = 0; i < this.currentPiece.bottom.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.bottom[i][0] + 1;
    var column = this.currentPiece.location[1] + this.currentPiece.bottom[i][1];
    // console.log(row);
    if (row > 19) {
      return false;
    } else if (this.rows[row][column] !== "O") {
      return false;
    }
  }
  return true;
};

Board.prototype.rightCurrentPiece = function() {
  if (this.isRightClear()) {
    this.clearCurrentPieceLocation();
    this.currentPiece.location[1]++;
    this.populateCurrentPiece();
  }
};

Board.prototype.isRightClear = function() {
  console.log(this.right);
  for (i = 0; i < this.currentPiece.right.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.right[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.right[i][1] + 1;
    // console.log(column);
    if (column > 9) {
      return false;
    } else if (!row < 0 && this.rows[row][column] !== "O") {
      return false;
    }
  }
  return true;
}

Board.prototype.leftCurrentPiece = function() {
  if (this.isLeftClear()) {
    this.clearCurrentPieceLocation();
    this.currentPiece.location[1]--;
    this.populateCurrentPiece();
  }
};

Board.prototype.isLeftClear = function() {
  for (i = 0; i < this.currentPiece.left.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.left[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.left[i][1] - 1;
    if (column < 0) {
      return false;
    } else if (!row < 0 && this.rows[row][column] !== "O") {
      return false;
    }
  }
  return true;
};

Board.prototype.clearCurrentPieceLocation = function() {
  for (i = 0; i < this.currentPiece.occupies.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.occupies[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.occupies[i][1];
    if (row >= 0) {
      this.rows[row][column] = "O";
    }
  }
}

Board.prototype.populateCurrentPiece = function() {
  for (i = 0; i < this.currentPiece.occupies.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.occupies[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.occupies[i][1];
    if (row >= 0) {
      this.rows[row][column] = "&#9632;";
    }
  }
  this.displayBoard();
};

Board.prototype.displayBoard = function() {
  $("body").text("");
  this.rows.forEach(function(row) {
    row.forEach(function(cell) {
      $("body").append(cell + " ");
    })
    $("body").append("<br>");
  })
};

Board.prototype.rotatePiece = function() {
  this.clearCurrentPieceLocation();
  this.currentPiece.rotatePiece(this);
  this.populateCurrentPiece();
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

Board.prototype.confirmClear = function(location, relativeCoordinates, parentObj) {
  /* checks to see if the given coordinates are clear. Currently only works with the edges, not with other blocks */
  for (i = 0; i < relativeCoordinates.length; i++) {
    var row = location[0] + relativeCoordinates[i][0];
    var column = location[1] + relativeCoordinates[i][1];
    console.log(row + " " + column);
    if (column > 9) {
      return false;
    } else if (column < 0) {
      return false;
    } else if (row > 19) {
      return false;
    } else if (! row < 0 && parentObj.rows[row][column] !== "O") {
      return false;
    }
  }
  return true;
};

Board.prototype.resetGame = function() {
  this.rows = [];
  this.currentPiece = this.getNewPiece();
  this.buildBoard();
  this.lines = 0;
};

Board.prototype.checkLoseCondition = function() {
  if (this.currentPiece.location[0] < 1) {
    for (i = 0; i < this.currentPiece.spacesOccupied.length; i++) {
      var row = this.currentPiece.location[0] + this.currentPiece.occupies[i][0];
      // console.log(row);
      if (row < 0) {
        this.resetGame();
      }
    }
  }
};

// Pieces object starts here
function Pieces() {
  this.location = [-1, 4];
  this.occupies = [];
  this.left = [];
  this.right = [];
  this.bottom = [];
  this.pieceType;
  this.possibleSpaces = [[1,-1], [1,0], [1,1], [0,-1], [0,0], [0,1], [-1,-1], [-1,0], [-1,1], [1,2], [-2,0]];
  this.spacesOccupied = [];
};

Pieces.prototype.setBounds = function() {
  /* will set this.left, right, and bottom to be checked elsewhere */
  this.left = [];
  this.right = [];
  this.bottom = [];
  if (this.pieceType === "line") {
    this.setLineBounds();
  } else {
    this.setLeft();
    this.setRight();
    this.setBottom();
  }
};

Pieces.prototype.setLineBounds = function() {
  if (this.spacesOccupied.includes(1)) {
    this.left = [[1,-1]];
    this.right = [[1,2]];
    this.bottom = [[1,-1],[1,0],[1,1],[1,2]];
  } else {
    this.left = [[1,0],[0,0],[-1,0],[-2,0]];
    this.right = [[1,0],[0,0],[-1,0],[-2,0]];
    this.bottom = [[1,0]]
  }
};

Pieces.prototype.setLeft = function() {
  /* Sets the coordinates for the left-most spaces occupied. Searches spaces 1-3 until it finds something, then 4-6, then 7-9 */
  for (i = 1; i < 10;) {
    var j = i + 3;
    for (; i < j; i++) {
      // console.log(i);
      if (this.spacesOccupied.includes(i)) {
        this.left.push(this.possibleSpaces[i-1]);
        i = j;
        break;
      }
    }
  }
};

Pieces.prototype.setRight = function() {
  /* Sets the coordinates for the right-most spaces occupied. Searches spaces 9, 8, 7, until it finds something, then 6, 5, 4, then 3, 2, 1*/
  for (i = 9; i > 0;) {
    var j = i - 3;
    for (; i > j; i--) {
      // console.log(i);
      if (this.spacesOccupied.includes(i)) {
        this.right.push(this.possibleSpaces[i-1]);
        i = j;
        break;
      }
    }
  }
};

Pieces.prototype.setBottom = function() {
  for (i = 1; i < 4; i++) {
    if (this.spacesOccupied.includes(i)) {
      // debugger;
      this.bottom.push(this.possibleSpaces[i - 1]);
    } else if (this.spacesOccupied.includes(i + 3)) {
      this.bottom.push(this.possibleSpaces[i + 2]);
    } else if (this.spacesOccupied.includes(i + 6)) {
      this.bottom.push(this.possibleSpaces[i + 5]);
    }
    // console.log(this.bottom);
  }

};

Pieces.prototype.setOccupies = function() {
  /* takes this.spacesOccupied and converts it to an array of the proper relative coordinates */
  this.occupies = [];
  for (i = 0; i < this.spacesOccupied.length; i++) {
    this.occupies.push(this.possibleSpaces[this.spacesOccupied[i] - 1]);
  }
};

Pieces.prototype.rotatePiece = function(parentObj) {
  /* rotates the pieces clockwise based on their current location in the basic 9-box grid */
  if (this.pieceType === "line") {
    this.rotateLine(parentObj);
    return;
  } else if (this.pieceType === "square") {
    return;
  }
  var newSpacesOccupied = [];
  for (i = 0; i < this.spacesOccupied.length; i++) {
    switch (this.spacesOccupied[i]) {
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
  for (i = 0; i < newSpacesOccupied.length; i++) {
    testSpaces.push(this.possibleSpaces[newSpacesOccupied[i] - 1]);
  }
  if (Board.prototype.confirmClear(this.location, testSpaces, parentObj)) {
    this.spacesOccupied = newSpacesOccupied;
    this.setOccupies();
    this.setBounds();
  }
}

Pieces.prototype.rotateLine = function(parentObj) {
  var newSpacesOccupied = []
  if (this.spacesOccupied.includes(1)) {
    newSpacesOccupied.push(2, 5, 8, 11);
  } else {
    newSpacesOccupied.push(1, 2, 3, 10)
  }
  var testSpaces = [];
  for (i = 0; i < newSpacesOccupied.length; i++) {
    testSpaces.push(this.possibleSpaces[newSpacesOccupied[i] - 1]);
  }
  if (Board.prototype.confirmClear(this.location, testSpaces, parentObj)) {
    this.spacesOccupied = newSpacesOccupied;
    this.setOccupies();
    this.setBounds();
  }
};

Pieces.prototype.setToT = function() {
  this.pieceType = "t";
  this.spacesOccupied.push(1, 2, 3, 5);
  this.setOccupies();
  this.setBounds();
};

Pieces.prototype.setToSquare = function() {
  this.pieceType = "square";
  this.spacesOccupied.push(1, 2, 4, 5);
  this.setOccupies();
  this.setBounds();
};

Pieces.prototype.setToZ = function() {
  this.pieceType = "z";
  this.spacesOccupied.push(2, 3, 4, 5);
  this.setOccupies();
  this.setBounds();
};

Pieces.prototype.setToReverseZ = function() {
  this.pieceType="reverseZ";
  this.spacesOccupied.push(1, 2, 5, 6);
  this.setOccupies();
  this.setBounds();
};

Pieces.prototype.setToL = function() {
  this.pieceType="l";
  this.spacesOccupied.push(1, 2, 3, 6);
  this.setOccupies();
  this.setBounds();
};

Pieces.prototype.setToReverseL = function() {
  this.pieceType = "reverseL";
  this.spacesOccupied.push(1, 2, 3, 4);
  this.setOccupies();
  this.setBounds();
};

Pieces.prototype.setToLine = function() {
  this.pieceType = "line";
  this.spacesOccupied.push(1,2,3,10);
  this.setOccupies();
  this.setBounds();
};

// front end logic starts here
var board = new Board();

$(document).ready(function() {
  board.displayBoard();
  var counter = 500;
  var interval;
  var stop = false;
  var runGame = function() {
    clearInterval(interval);
    board.lowerCurrentPiece();
    if (stop) {
      stop = false;
      return;
    }
    interval = setInterval(runGame, counter);
  }
  function startGame() {
    interval = setInterval(runGame, counter);
  }
  function stopGame() {
    stop = true;
  }

  $(document).keydown(function(event) {
    var key = event.which;
    if (key === 37) {
      board.leftCurrentPiece();
    } else if (key === 39) {
      board.rightCurrentPiece();
    } else if (key === 40) {
      board.lowerCurrentPiece();
    } else if (key === 38) {
      board.rotatePiece();
    }
  });
});
