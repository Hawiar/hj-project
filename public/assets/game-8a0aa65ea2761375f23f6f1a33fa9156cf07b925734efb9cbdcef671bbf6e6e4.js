var bombs;
var columns; //vertical
var row; //horizontal
var difficulty;
var numOfClicks = 0; //number of clicks
var softCells; //cells that don't have a bomb
var allSpaces = []; //full game board
var score = 0;
var winner = 0;
var hintsUsed = 0;
var tSwift = [];
var startTime, curTime, timerID;
var time;
var skin;
var is_flag = false;

var player = {
  points: score,
  wins: winner,
}

//Creates the initial board
function create(rows, columns, bombs, difficulty) {
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
	  	board += "<td><div class='closed "+skin+"' id='"+j+","+i+"' onclick='clickedOn(this.id)' onmousedown='mouseDown(event, this.id);'></div><\/td>";
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
  finder("win").style.display = "none";
  finder("lose").style.display = "none";
  finder("custom").style.display = "none";
  finder("skins").style.display = "none";
}

//Whenever a spot is clicked call this function.
function clickedOn(position) {

	// used to tell if it's a click or a hold. If it's a hold dont
	// count it as a left click, count it as a right click.
	// used to account for mobile.
	$(window).mousedown(function(e) {
    clearTimeout(this.downTimer);
    this.downTimer = setTimeout(function() {
    		is_flag = true;

        if(flagged.className == "closed " + skin + " flag") {
		  		flagged.classList.remove("flag");
		  		flagged.classList.add("question");
		  	}
		  	else if(flagged.className == "closed " + skin + " question") {
		  		flagged.classList.remove("question");
		  		flagged.innerHTML = "";
		  	}
		  	else {
			  	flagged.classList.add("flag");
			  } 
    }, 1000);
	}).mouseup(function(e) {
    clearTimeout(this.downTimer);
	});

	// if is_flag is true that means it's a hold, not a click.
	if (is_flag == false) {
		numOfClicks++;
		//stores the position of the clicked spot in a array list [x,y].
		p = position;
		pos = p.split(",");

		if (numOfClicks == 1) {
			aroundTown(pos);
		}

		//if the spot is a mine you lose.
		else if (allSpaces[pos[0]][pos[1]] && finder(pos).innerHTML != "F" ) {
	    lose();
		}

		//if it's not a mine or the first click, open the square
		else {
			clickedSquare = finder(pos);

			if(clickedSquare.className == "closed " + skin + " flag") {
				return;
			}

			if (clickedSquare.className != "open " + skin) {
				softCells--;
			}

			clickedSquare.className = "open " + skin;
			clickedSquare.innerHTML = checkMines(pos[0],pos[1]);

		  if (softCells == 0) {
		    win();
		  }

		  if (checkMines(pos[0],pos[1]) == "") {
		  	tSwift.push([pos[0],pos[1]]);
		  	blankOpen();
		  }
		}
	}
	else {
		is_flag = false;
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

				document.getElementById(posit).className = "open " + skin;
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
						square.className = "open " + skin;
						square.innerHTML = checkMines(position[0],position[1]);
						softCells--;

						if(softCells == 0) {
							win();
						}

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
	if (numOfClicks > 0) {
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

	  document.getElementById(highlight).className = "hint closed " + skin;
	}


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
			//$(this).addClass("mine");
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
    var time_points = Math.floor(999 - finder("time").innerHTML);

    score = score - penalty;

    if (time_points > 0) {
    	score = score + time_points;
    }

    finder("current_score").innerHTML = score;
  }
}

function lose() {
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
	loseSound();
  winner = 0;
  $.post('/stats', player);
}

function win() {
	//uncover all the mines and add dark overlay
	finder("overlay").style.display = "block";
	finder("win").style.display = "block";

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
  winSound();
  player.wins = 1;
  player.points = score;
  $.post('/stats', player);
}

// default board layout
function starting() {
  create(9, 9, 16, 'easy');
}

function custom() {
  //uncover all the mines and add dark overlay
	finder("overlay").style.display = "block";
	finder("custom").style.display = "block";
}

function skins() {
  //uncover all the mines and add dark overlay
	finder("overlay").style.display = "block";
	finder("skins").style.display = "block";
}

function setskin(pattern) {
	skin = pattern;
	starting();
	finder("skins").style.display = "none";

}

function createCustom() {
	custWidth = finder("width").value;
	custHeight = finder("height").value;
	custMines = (custWidth * custHeight) / 5;
	if (7 < custWidth && custWidth < 31 && 7 < custHeight && custHeight < 25 ) {
		create(custHeight, custWidth, custMines , 'custom');
	}
}

function loseSound() { //html5 audio element
	switch(difficulty) {
      case 'easy':
        var audio = document.getElementById('bomb');
        break;
      case 'medium':
        var audio = document.getElementById('evil_laugh');
        break;
      case 'hard':
        var audio = document.getElementById('kid_laugh');
        break;
      case 'custom':
      	var audio = document.getElementById('bomb');
      	break;
    }

  audio.play();
}

function winSound() { //html5 audio element
  var audio = document.getElementById('clapping');
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
}

function updateTimer() {
	curTime = new Date();
	time = curTime.getTime() - startTime.getTime();
	var time2 = Math.round(time / 10);

	if (roundNum(2, (time2 / 100)) < 1000) {
		finder("time").innerHTML = roundNum(2, (time2 / 100));
	}
	else {
		finder("time").innerHTML = 999;
	}
}

function stopTimer() {
	clearInterval(timerID);
	updateTimer();
}

function roundNum(digits, number) {
 var power = Math.pow(10, digits);
 var rounded = "" + Math.round(number * power);
 while (rounded.length < digits + 1) {
  rounded = "0" + rounded;
 }
 var len = rounded.length;
 return rounded.substr(0,len - digits) + "." + rounded.substr(len - digits, digits);
}

// detects when mouse is right-clicked
function mouseDown(e, id) {
  flagged = document.getElementById(id);

  e = e || window.event;

  if (e.which == 3) {
  	if(flagged.className == "closed " + skin + " flag") {
  		flagged.classList.remove("flag");
  		flagged.classList.add("question");
  		// flagged.innerHTML = "?";
  	}
  	else if(flagged.className == "closed " + skin + " question") {
  		flagged.classList.remove("question");
  		flagged.innerHTML = "";
  	}
  	else {
	  	flagged.classList.add("flag");
	  	// flagged.innerHTML = "F";
	  }
  }
}

// closes the skins panel
function closingTime() {
	finder("overlay").style.display = "none";
	finder("skins").style.display = "none";
}

// we dont want right-click to pull up the menu when you're playing the game
document.oncontextmenu = function() {
    return false;
}

// form for custom doesn't actually submit anything, just need to get the values
$('#form').submit(function () {
	return false;
}); 
