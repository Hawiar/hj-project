var bombs;
var bombTotal; //Number of bombs on the board
var columns; //vertical
var row; //horizontal
var difficulty;
var numOfClicks = 0; //number of clicks
var softCells; //cells that don't have a bomb
var allSpaces = []; //full game board
var score = 0;
var winner = 0;
var loser = 0;
var hintsUsed = 0;
var tSwift = [];
var startTime, curTime, timerID;
var time;

var player = {
  points: score,
  wins: winner,
  losses: loser
}

// detects when mouse is right-clicked
function mouseDown(e, id) {
  flagged = document.getElementById(id);

  e = e || window.event;

  if (e.which == 3) {
  	if(flagged.className == "closed flag") {
  		flagged.classList.remove("flag");
  		flagged.classList.add("question");
  		flagged.innerHTML = "?";
  	}
  	else if(flagged.className == "closed question") {
  		flagged.classList.remove("question");
  		flagged.innerHTML = "";
  	}
  	else {
	  	flagged.classList.add("flag");
	  	flagged.innerHTML = "F";
	  }
  }
}

document.oncontextmenu = function() {
    return false;
}

//Creates the initial board
function create(rows, columns, bombs, difficulty) {
	debug("create got called!");
	clearInterval(timerID);
	finder("time").innerHTML = "0";
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
	  	board += "<td><div class='closed' id='"+j+","+i+"' onclick='clickedOn(this.id)' onmousedown='mouseDown(event, this.id);'></div><\/td>";
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
  winner = 0;
  loser = 0;
  hintsUsed = 0;
  finder("overlay").style.display = "none";
}


//Whenever a spot is clicked call this function.
function clickedOn(position) {
	numOfClicks++;
	//stores the position of the clicked spot in a array list [x,y].
	p = position;
	pos = p.split(",");

	if (numOfClicks == 1) {
		aroundTown(pos);
	}

	//if the spot is a mine you lose.
	else if (allSpaces[pos[0]][pos[1]] && finder(pos).innerHTML != "F" ) {
		//window.alert("you lose!!!");
    lose();
	}

	//if it's not a mine or the first click, open the square
	else {
		clickedSquare = finder(pos);

		if(clickedSquare.className == "closed flag") {
			return;
		}

		clickedSquare.className = "open";
		clickedSquare.innerHTML = checkMines(pos[0],pos[1]);
	  softCells--;

	  if (softCells == 0) {
	    win();
	  }

	  if (checkMines(pos[0],pos[1]) == "") {
	  	tSwift.push([pos[0],pos[1]]);
	  	blankOpen();
	  }
	}
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

	for (iP = 0; iP < 18;) {
		x = allPos[iP];
		y = allPos[iP + 1];
		if(document.getElementById(x + "," + y)) {
			document.getElementById(x + "," + y).innerHTML = checkMines(x,y);

			if(checkMines(x,y) == "") {
				tSwift.push([x,y]);
			}
		}
		iP = iP + 2;
	}

	blankOpen();
	startTimer();
}

function blankOpen() {
	while (tSwift.length > 0) {
		position = tSwift[0];
		position[0] = Math.floor(position[0]);
		position[1] = Math.floor(position[1]);


		for (var i = -1; i < 2; i++) {
			position[0] = position[0] + i;

			for (var j = -1; j < 2; j++) {
				position[1] = position[1] + j;

				if (document.getElementById(position)) {
					square = document.getElementById(position);

					if (square.classList.contains("closed") && allSpaces[position[0]][position[1]] == false) {
						square.className = "open";
						square.innerHTML = checkMines(position[0],position[1]);
						softCells--;

						if (checkMines(position[0],position[1]) == "") {
							tSwift.push([position[0],position[1]]);
						}
					}
				}

				position[1] = position[1] - j;
			}

			position[0] = position[0] - i;
		}	
			tSwift.splice(0,1);
	}
}

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
  
  allPossible = [];

  $(".closed").each(function() {
  	position = $(this).attr('id');
  	pos = position.split(",");
		pos[0] = Math.floor(pos[0]);
		pos[1] = Math.floor(pos[1]);

		if (allSpaces[pos[0]][pos[1]] == false) {
			allPossible.push(pos);
		}

  });

  rando = allPossible.length;
  rando = Math.floor((Math.random() * rando));

  highlight = allPossible[rando];

  document.getElementById(highlight).className = "hint closed";
  debug(highlight);


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
			// shows all mines, useful for debugging.
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
    var penalty = (hintsUsed*100);
    score = score - penalty;
  }
}

function lose() {
	debug("lose got called!");
  //uncover all the mines and add dark overlay.
  finder("overlay").style.display = "block";
  finder("lose").style.display = "block";

  $(".closed").each(function() {
		position = $(this).attr('id');
		pos = position.split(",");
		pos[0] = Math.floor(pos[0]);
		pos[1] = Math.floor(pos[1]);

		if(allSpaces[pos[0]][pos[1]]) {
			$(this).addClass("mine");
		}
	});

	stopTimer();
  scorify();
  loser += 1;
  $.post('/stats', player);
}

function win() {
	//uncover all the mines and add dark overlay
	debug("win got called!");
	finder("overlay").style.display = "block";
	finder("lose").style.display = "block";

  $(".closed").each(function() {
		position = $(this).attr('id');
		pos = position.split(",");
		pos[0] = Math.floor(pos[0]);
		pos[1] = Math.floor(pos[1]);

		if(allSpaces[pos[0]][pos[1]]) {
			$(this).addClass("mine");
		}
	});

  stopTimer();
  scorify();
  winner += 1;
  $.post('/stats', player);
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


// timer functions
function startTimer() {
	startTime = new Date();
	timerID = setInterval(updateTimer, 10);
	debug("start got called!");
}

function updateTimer() {
	debug("update got called!");
	curTime = new Date();
	time = curTime.getTime() - startTime.getTime();
	var time2 = Math.round(time / 10);
	finder("time").innerHTML = trim(2, (time2 / 100));
}

function stopTimer() {
	debug("stop got called!");
	clearInterval(timerID);
	updateTimer();
}

function trim(nDigits, number) {
	debug("trim got called!");
 var power = Math.pow(10, nDigits);
 var trimmed = "" + Math.round(number * power);
 while (trimmed.length < nDigits + 1) {
  trimmed = "0" + trimmed;
 }
 var len = trimmed.length;
 return trimmed.substr(0,len - nDigits) + "." + trimmed.substr(len - nDigits, nDigits);
}
 
