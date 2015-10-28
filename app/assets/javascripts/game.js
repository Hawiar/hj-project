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

	board = "<table>";
	for (var i = 0; i < rows; i++) {
	  board += "<tr>";
	  for (var j = 0; j < columns; j++) {
	  	board += "<td><div class='spot' id='"+j+","+i+"'></div><\/td>";
	  }
	  board += "<\/tr>";
	}
	board += "<\/table>";
	finder("board").innerHTML = board;
}

function starting() { //Default board layout
  create(70, 50, 50);
}

function clear() { //clears the board
}

function populate() { //setup bombs across the board
}

function finder(string) {
 return document.getElementById(string);
}
