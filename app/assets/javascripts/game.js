var bombs;
var bombTotal; //Number of bombs on the board
var columns; //vertical
var rows; //horizontal
var softCells; //cells that don't have a bomb

function create(rows, columns, bombs) {
this.rows = rows;
this.columns = columns;
this.bombs = bombs;

softCells = (rows*columns)-(bombs);

for (var i = 0; i < rows; i++) {
  //
  for (var j = 0; j < columns; j++) {
  }
}}

function default() { //Default board layout
  create(10, 10, 10);
}

function clear() { //clears the board
}

function populate() { //setup bombs across the board
}
