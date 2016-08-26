var Board = function() {
  this.rows = [];
  this.currentPiece = this.getNewPiece();
  this.blocks = [];
  this.buildBoard();
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

Board.prototype.lowerCurrentPiece = function() {
  if (this.isBottomClear()) {
    this.clearCurrentPieceLocation();
    this.currentPiece.location[0]++;
    this.populateCurrentPiece();
  }
};

Board.prototype.isBottomClear = function() {
  for (i = 0; i < this.currentPiece.bottom.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.bottom[i][0] + 1;
    var column = this.currentPiece.location[1] + this.currentPiece.bottom[i][1];
    console.log(row);
    if (row > 19) {
      return false;
    }
  }
  return true;
}

Board.prototype.rightCurrentPiece = function() {
  if (this.isRightClear()) {
    this.clearCurrentPieceLocation();
    this.currentPiece.location[1]++;
    this.populateCurrentPiece();
  }
};

Board.prototype.isRightClear = function() {
  for (i = 0; i < this.currentPiece.right.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.right[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.right[i][1] + 1;
    console.log(column);
    if (column > 9) {
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
    }
  }
  return true;
};

Board.prototype.clearCurrentPieceLocation = function() {
  for (i = 0; i < this.currentPiece.occupies.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.occupies[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.occupies[i][1];
    this.rows[row][column] = "O";
  }
}

Board.prototype.populateCurrentPiece = function() {
  for (i = 0; i < this.currentPiece.occupies.length; i++) {
    var row = this.currentPiece.location[0] + this.currentPiece.occupies[i][0];
    var column = this.currentPiece.location[1] + this.currentPiece.occupies[i][1];
    this.rows[row][column] = "H";
  }
  this.displayBoard();
};

Board.prototype.displayBoard = function() {
  $("body").text("");
  this.rows.forEach(function(row) {
    row.forEach(function(cell) {
      $("body").append(cell);
    })
    $("body").append("<br>");
  })
};

Board.prototype.rotatePiece = function() {
  this.clearCurrentPieceLocation();
  this.currentPiece.rotatePiece();
  this.populateCurrentPiece();
};

Board.prototype.getNewPiece = function() {
  var newPiece = new Pieces();
  newPiece.setToT();
  return newPiece;
};

// Pieces object starts here
var Pieces = function() {
  this.location = [4, 4];
  this.occupies = [];
  this.left = [];
  this.right = [];
  this.bottom = [];
  this.pieceType;
  this.possibleSpaces = [[1,-1], [1,0], [1,1], [0,-1], [0,0], [0,1], [-1,-1], [-1,0], [-1,1]];
  this.spacesOccupied = [];
};

Pieces.prototype.setToT = function() {
  this.pieceType = "t";
  this.spacesOccupied.push(1, 2, 3, 5);
  this.setOccupies();
  this.setBounds();
};

Pieces.prototype.setBounds = function() {
  this.setRight();
  /* will set this.left, right, and bottom to be checked elsewhere */

}

Pieces.prototype.setLeft = function() {
  /* Sets the coordinates for the left-most spaces occupied. Searches spaces 1-3 until it finds something, then 4-6, then 7-9 */
  for (i = 1; i < 10;) {
    var j = i + 3;
    for (; i < j; i++) {
      console.log(i);
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
      console.log(i);
      if (this.spacesOccupied.includes(i)) {
        this.left.push(this.possibleSpaces[i-1]);
        i = j;
        break;
      }
    }
  }
};

Pieces.prototype.setOccupies = function() {
  /* takes this.spacesOccupied and converts it to an array of the proper relative coordinates */
  this.occupies = [];
  for (i = 0; i < this.spacesOccupied.length; i++) {
    this.occupies.push(this.possibleSpaces[this.spacesOccupied[i] - 1]);
  }
};

Pieces.prototype.rotatePiece = function() {
  /* rotates the pieces clockwise based on their current location in the basic 9-box grid */
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
  this.spacesOccupied = newSpacesOccupied;
  this.setOccupies();
}

Pieces.prototype.setToSquare = function() {
  this.pieceType = "square";
  this.occupies = [[0,0], [0,1], [1,0], [1,1]];
  this.left = [[0,0],[1,0]];
  this.right = [[0,1],[1,1]];
  this.bottom = [[1,0],[1,1]];
};

Pieces.prototype.setToLine = function() {
  this.pieceType = "line";
  this.occupies = [[0,0], [1,0], [2,0], [3,0]];
  this.left = [[0,0], [1,0], [2,0], [3,0]];
  this.right = [[0,0], [1,0], [2,0], [3,0]];
  this.bottom = [[3,0]];
}

var board = new Board();

// front end logic starts here
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
