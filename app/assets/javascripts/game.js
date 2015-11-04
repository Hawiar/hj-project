var bombs;
var bombTotal; //Number of bombs on the board
var columns; //vertical
var rows; //horizontal
var numOfClicks = 0; //number of clicks
var softCells; //cells that don't have a bomb
var allSpaces = []; //full game board

function create(rows, columns, bombs) {
	this.rows = rows;
	this.columns = columns;
	this.bombs = bombs;
	numOfClicks = 0;

	softCells = (rows*columns)-(bombs);

	board = "<table>";
	for (var i = 0; i < rows; i++) {
	  board += "<tr>";
	  allSpaces[i] = [];
	  for (var j = 0; j < columns; j++) {
	  	board += "<td><div class='closed' id='"+j+","+i+"' onclick='made(this.id)'></div><\/td>";
	  	allSpaces[i][j] = false;
	  }
	  board += "<\/tr>";
	}
	board += "<\/table>";
	finder("board").innerHTML = board;
}

//Whenever a spot is clicked call this function.
function made(position) {
	numOfClicks++;
	//stores the position of the clicked spot in a array list [x,y].
	p = position;
	pos = p.split(",");
	debug(pos);
	if (numOfClicks == 1) {
		aroundTown(pos);
	}
	else if (allSpaces[pos[0]][pos[1]]) {
		window.alert("you lose!!!");
	}
	else {
	document.getElementById(pos).className = "open";
	document.getElementById(pos).innerHTML = checkMines(pos[0],pos[1]);
	}
}

function aroundTown(position) {
	allPos = [];
	pos = position;
	pos[0] = Math.floor(pos[0]);
	pos[1] = Math.floor(pos[1]);
	posit = pos;

	// opens up the square clicked and the 8 squares surrounding it.
	for (var i = -1; i < 2; i++) {
		posit[0] = posit[0] + i;

		for (var j = -1; j < 2; j++) {
			posit[1] = posit[1] + j;

			if(document.getElementById(posit)) {
				document.getElementById(posit).className = "open";
				allPos += posit;
				allPos += ",";
			}

			posit[1] = posit[1] - j;
		}

		posit[0] = posit[0] - i;
	}

	// randomly places bombs in the remaining closed squares.
	populate(bombs);

	// put number in each square saying how many mines it's touching.
	for (i = 0; i < 36;) {
		x = allPos[i];
		y = allPos[i + 2];
		if(document.getElementById(x + "," + y)) {
			document.getElementById(x + "," + y).innerHTML = checkMines(x,y);
		}
		i = i + 4;
	}
}

function starting() { //Default board layout
  create(16, 16, 40);
}

function clear() { //clears the board
}

// check around position for mines
function checkMines(x,y) {
	numMines = 0;
	allPos2 = [];
	pos2 = [x,y];
	debug("pos2: " + pos2);
	pos2[0] = Math.floor(pos2[0]);
	pos2[1] = Math.floor(pos2[1]);
	posit2 = pos2;

	// checks the square clicked and 8 surround squares for mines.
	for (var i = -1; i < 2; i++) {
		posit2[0] = posit2[0] + i;

		for (var j = -1; j < 2; j++) {
			posit2[1] = posit2[1] + j;

			if(document.getElementById(posit2) && allSpaces[pos2[0]][pos2[1]])  {
				numMines++;
			}

			posit2[1] = posit2[1] - j;
		}

		posit2[0] = posit2[0] - i;
	}

	return numMines;
}

function populate(bombs) { //setup bombs across the board
	left = bombs;

	$(".closed").each(function() {
		position = $(this).attr('id');
		pos = position.split(",");
		pos[0] = Math.floor(pos[0]);
		pos[1] = Math.floor(pos[1]);

		if(Math.random() < 0.02 && left > 0 && allSpaces[pos[0]][pos[1]] == false) {
			left--;
			allSpaces[pos[0]][pos[1]] = true;
			$(this).addClass("mine");
		}
	});

	if(left > 0) {
		populate(left);
	}
}

function debug(bug) {
	console.log(bug);
}

function finder(string) {
 return document.getElementById(string);
}
