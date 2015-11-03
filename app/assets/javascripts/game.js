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
	
	if (numOfClicks == 1) {
		aroundTown(pos);
	}
	else {
	document.getElementById(pos).className = "open";
	}
}

function aroundTown(position) {
	pos = position;
	pos[0] = Math.floor(pos[0]) - 1;
	pos[1] = Math.floor(pos[1]) ;
	posit = pos;

	for (var i = 0; i <= 2; i++) {
		posit[0] = posit[0] + i;
		if (i == 2) {
			posit[0] = posit[0] - 1;
		}

	  for (var j = 0; j <= 2; j++) {
	  	posit[1] = posit[1] + 1;
	    if (j==1) {
	  		posit[1] = posit[1] -3;
	  	}

	  	if(document.getElementById(posit)) {
	 			document.getElementById(posit).className = "open";
	 		}
	  }

	}

	populate(bombs);
}

function starting() { //Default board layout
  create(16, 16, 40);
}

function clear() { //clears the board
}

function populate(bombs) { //setup bombs across the board
	left = bombs;
	$(".closed").each(function() {
		position = $(this).attr('id')
		pos = position.split(",");
		pos[0] = Math.floor(pos[0]);
		pos[1] = Math.floor(pos[1]);

		if(Math.random() < 0.01 && left > 0) {
			left--;
			allSpaces[pos[0]][pos[1]] = true;
			$(this).addClass("mine");
		}
	});

	if(left > 0) {
		populate(left);
	}
}

function finder(string) {
 return document.getElementById(string);
}
