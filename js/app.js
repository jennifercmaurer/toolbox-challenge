"use strict"; //so I don't create any unwanted variables

var matches = 0;
var remainingPictures = 8;
var missedMatches = 0;
var firstImage;
var first = true;
var elapsedSeconds = 0;
var startTime;

$(document).ready(function() { //creates array of ALL tiles
	setUpBoard();
	playGame();

	$('#submit').click(function() { //click start new game
		newGame();
		$('#winner').animate({
			height: "0px"
		}, 1000, function() {
			$('#winner').hide();
		});
	});
});

function newGame() {
	resetGame();
	setUpBoard();
	playGame();
}

//create and return gameboard
function setUpBoard() {
	var tiles = [];//create empty array
	
	var idx;
	//called push method; push new object that we've created on the fly; 
	//inside curly braces defined all attributes that we want to use; 
	//concatenate idx and jpg
	for (idx = 1; idx <= 32; ++idx) {
		tiles.push({
			tileNum: idx,
			src: 'img/tile' + idx + '.jpg',
			flipped: false, //not flipped
			matched: false //not a match
		});
	}

	//shuffle
	var tilePairs = shuffle(tiles);

	//put all used tiles in gameboard in rows
	var gameBoard = $('#game-board'); //css selector for grabbing an id
	var row = $(document.createElement('div'));
	var img;
	var elemIndex = 0;
	_.forEach(tilePairs, function(tile, elemIndex) {//iterate over tilePairs array that we created
		if (elemIndex > 0 && 0 == (elemIndex % 4)) {
			gameBoard.append(row);
			row = $(document.createElement('div'));
		} //put four tiles in a row

		img = $(document.createElement('img')); //gives us a new element in memory;
		img.attr({
			src: 'img/tile-back.png',
			alt: 'image of tile ' + tile.tileNum
		}); //make img the back of card
		img.data('tile', tile);
		row.append(img);
	});
	gameBoard.append(row);
	return gameBoard;
}

function shuffle(tiles) {
	//shuffle
	var shuffledTiles = _.shuffle(tiles);//returns a new array of shuffled values
	var selectedTiles = shuffledTiles.slice(0, 8);
	
	//create another array
	var tilePairs = [];
	_.forEach(selectedTiles, function(tile) {
		tilePairs.push(_.clone(tile)); //copy each tile
		tilePairs.push(_.clone(tile)); //2 of each tile
	});//iterate over selected tiles; clone object twice and put both clones into tiles pair aray

	return tilePairs = _.shuffle(tilePairs); //use same array to shuffle tilePairs array itself
}

/*
first flip: if you flip one, save it, change img, flipped=true, first=false
next flip: if you flip one when first=false and img matches first, matched=true
if matched=true, flipped=permanent true, disable click, matches++, remaining--
*/

function playGame() {
	$('#game-board img').click(function() { //when you click a pic
		var img = $(this); //save img clicked
		var tile = img.data('tile'); //save tile clicked
		//already flipped
		if (tile.flipped == true) {
			return;
		}
		//first flip
		if (first == true) { //if it's the first flip
			if (missedMatches == 0) { //start timer after 1st tile's clicked
				timer();
			}
			flipTile(tile, img); //flip first tile
			firstImage = img; //save img as currentImage
			first = false; //no longer first flip
		//second flip
		} else { //if it's the 2nd flip
			flipTile(tile, img); //flip tile
			if (img.data('tile').src == firstImage.data('tile').src) { //IF IT'S A MATCH TO FIRST
				tile.matched = true; //change matched to true
				firstImage.data('tile').matched = true; //matched on first tile true
				first = true; //no longer first turn
				matches++;
				remainingPictures--;
				$('#matches').text('' + matches);
				$('#remaining').text('' + remainingPictures);
			}
			else { //if not a match
				first = true;
				missedMatches++;
				$('#missed').text('' + missedMatches);
				var original = firstImage;
				setTimeout(function() {
					flipTile(tile, img);
					flipTile(original.data('tile'), original);
				}, 1000);
			}
		}
		if (matches == 8) {
			$('#winner').show().animate({
				left: "+=50",
				height: "100px"
			}, 1000, function() {});
		}
	});
}

function flipTile(tile, img) {
	img.fadeOut(100, function() { //speed at which it flips
		if (!tile.flipped) { //if not flipped yet
			img.attr('src', tile.src);
		} 
		else {
			img.attr('src', 'img/tile-back.png');  //switch to back
		}
		tile.flipped = !tile.flipped;
			img.fadeIn(100);
	}); //after fadeOut
	//on click of gameboard images
}

function resetGame() { //reset all stats
	matches = 0;
	remainingPictures = 8;
	missedMatches = 0;
	firstImage;
	first = true;
	elapsedSeconds = 0;
	startTime;
	$('#game-board').empty();
	$('#matches').text('' + matches);
	$('#missed').text('' + missedMatches);
	$('#remaining').text('' + remainingPictures);
	$('#elapsed-seconds').text(0);
	startTime = _.now(); //start time
}

function timer() {
	startTime = _.now(); //start time
	var timer = window.setInterval(function(){
		var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
		$('#elapsed-seconds').text('' + elapsedSeconds); //BETTER CODE
		if (elapsedSeconds >= startTime || matches == 8) {
			window.clearInterval(timer);
		}
	}, 1000);
}