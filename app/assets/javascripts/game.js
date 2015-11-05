var bombs;
var bombTotal; //Number of bombs on the board
var columns; //vertical
var row; //horizontal
var difficulty;
var numOfClicks = 0; //number of clicks
var softCells; //cells that don't have a bomb
var allSpaces = []; //full game board
var score = 0;
var hintsUsed = 0;

document.oncontextmenu = function() {
    return false;
}

//Creates the initial board
function create(rows, columns, bombs, difficulty) {
	clears();
	this.row = rows;
	this.columns = columns;
	this.bombs = bombs;
  this.difficulty = difficulty;
	numOfClicks = 0;

	softCells = (row*columns)-(bombs);

	for (var ii = 0; ii < columns; ii++) {
		allSpaces[ii] = [];
	}

	board = "<table>";
	for (var i = 0; i < row; i++) {
	  board += "<tr>";
	  for (var j = 0; j < columns; j++) {
	  	board += "<td><div class='closed' id='"+j+","+i+"' onclick='made(this.id)'></div><\/td>";
	  	allSpaces[j][i] = false;
	  }
	  board += "<\/tr>";
	}
	board += "<\/table>";
	finder("board").innerHTML = board;
}

//Clears the board
function clears() {
	bombs = 0;
	columns = 0;
	row = 0;
	numOfClicks = 0;
	softCells = 0;
	allSpaces = [];
	bombsTotal = 0;
  score = 0;
  hintsUsed = 0;
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
	else if (allSpaces[pos[0]][pos[1]]) {
		//window.alert("you lose!!!");
    lose();
	}
	else {
	document.getElementById(pos).className = "open";
	document.getElementById(pos).innerHTML = checkMines(pos[0],pos[1]);
  softCells--;
  if (softCells == 0) {
    win()
  }
	}

	// if (checkMines(pos[0],pos[1]) == "") {
	// 	debug("hey " + position + " was blank.");
	// 	blankOpen(position);
	// }
}

function aroundTown(position) {
	allPos = [];
	pos = position;
	pos[0] = Math.floor(pos[0]);
	pos[1] = Math.floor(pos[1]);
	posit = pos;

	// opens up the square clicked and the 8 squares surrounding it.
	for (var iAT = -1; iAT < 2; iAT++) {
		posit[0] = posit[0] + iAT;

		for (var jAT = -1; jAT< 2; jAT++) {
			posit[1] = posit[1] + jAT;

			if(document.getElementById(posit)) {

				document.getElementById(posit).className = "open";
				allPos += posit;
        allPos += ",";
        softCells--;
			}

			posit[1] = posit[1] - jAT;
		}

		posit[0] = posit[0] - iAT;
	}

	populate(bombs);

	// put number in each square saying how many mines it's touching.
	allPos = allPos.split(",");
	debug(allPos);

	for (iP = 0; iP < 18;) {
		x = allPos[iP];
		y = allPos[iP + 1];
		if(document.getElementById(x + "," + y)) {
			document.getElementById(x + "," + y).innerHTML = checkMines(x,y);
		}
		iP = iP + 2;
	}
}

// function blankOpen(position) {
// 	pos = position;
// 	pos[0] = Math.floor(pos[0]);
// 	pos[1] = Math.floor(pos[1]);
// 	posit = pos;

// 	// opens up the square clicked and the 8 squares surrounding it.
// 	for (var i = -1; i < 2; i++) {
// 		posit[0] = posit[0] + i;

// 		for (var j = -1; j < 2; j++) {
// 			posit[1] = posit[1] + j;

// 			if(document.getElementById(posit)) {
// 				document.getElementById(posit).className = "open";
// 				document.getElementById(posit).innerHTML = checkMines(posit[0],posit[1]);

// 				if(checkMines(posit[0],posit[1]) == "") {
// 					blankOpen([posit[0], posit[1]]);
// 				}
// 			}

// 			posit[1] = posit[1] - j;
// 		}

// 		posit[0] = posit[0] - i;
// 	}
// }

function starting() { //Default board layout
  create(9, 9, 10, 'easy');
}

// check around position for mines
function checkMines(x,y) {
	numMines = 0;
	allPos2 = [];
	pos2 = [x,y];
	pos2[0] = Math.floor(pos2[0]);
	pos2[1] = Math.floor(pos2[1]);
	posit2 = pos2;

	// checks the square clicked and 8 surround squares for mines.
	for (var iCM = -1; iCM < 2; iCM++) {
		posit2[0] = posit2[0] + iCM;

		for (var jCM = -1; jCM < 2; jCM++) {
			posit2[1] = posit2[1] + jCM;

			if(document.getElementById(posit2) && allSpaces[pos2[0]][pos2[1]])  {
				numMines++;
			}

			posit2[1] = posit2[1] - jCM;
		}

		posit2[0] = posit2[0] - iCM;
	}

	if(numMines == 0) {
		return "";	
	}
	else {
		return numMines;
	}
}

function hint() {
  hintsUsed++;
  //count the number of open spaces
  //randomly select one to highlight
}

function populate(bombs) { //setup bombs across the board
	left = bombs;

	$(".closed").each(function() {
		position = $(this).attr('id');
		pos = position.split(",");
		pos[0] = Math.floor(pos[0]);
		pos[1] = Math.floor(pos[1]);

		if(Math.random() < 0.01 && left > 0 && allSpaces[pos[0]][pos[1]] == false) {
			left--;
			allSpaces[pos[0]][pos[1]] = true;
			$(this).addClass("mine");
		}
	});

	if(left > 0) {
		populate(left);
	}
}

function scorify() {
  if (difficulty != "custom") {
    switch(difficulty) {
      case 'easy':
        score += 500;
        break;
      case 'medium':
        score += 1000;
        break;
      case 'hard':
        score += 2000;
        break;
    }
    var penalty = (hintsused*100);
    score = score - penalty;
    //add timer to score
  }
}

function lose() {
  //uncover all the mines
  //stop the timer
  //play bomb sound
}

function win() {
  //stop the timer
  //play win sound
  scorify();
}


function custom() {
  row = parseInt(prompt("Rows:", "Minimum of 5"));
  columns = parseInt(prompt("Columns:", "Minimum of 5"));
  bombs = (row*columns)/5;
  difficulty = "custom"
  create(row, columns, bombs, difficulty);
}

function bombSound() { //html5 audio element
  var audio = document.getElementById('bomb');
  audio.play();
}

function winSound() { //html5 audio element
  var audio = document.getElementById('bomb');
  audio.play();
}
function debug(bug) {
	console.log(bug);
}

function finder(string) {
 return document.getElementById(string);
}
