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

Board.prototype.test = function() {
  this.populateCurrentPiece();
};

Board.prototype.getNewPiece = function() {
  var newPiece = new Pieces();
  newPiece.setToSquare();
  return newPiece;
};

var Pieces = function() {
  this.location = [0, 4];
  this.occupies;
  this.left = [];
  this.right = [];
  this.bottom = [];
};

Pieces.prototype.setToSquare = function() {
  this.occupies = [[0,0], [0,1], [1, 0], [1, 1]];

  this.left = [[0,0],[1,0]];

  this.right = [[0,1],[1,1]];
  this.bottom = [[1,0],[1,1]];
};

var board = new Board();

$(document).keydown(function(event) {
  var key = event.which;
  if (key === 37) {
    board.leftCurrentPiece();
  } else if (key === 39) {
    board.rightCurrentPiece();
  } else if (key === 40) {
    board.lowerCurrentPiece();
  }

});
