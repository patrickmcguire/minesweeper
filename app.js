var MinesweeperCtrl = function($scope) {
	this.scope_ = $scope;
	this.lost = false;
	this.init();
}

MinesweeperCtrl.prototype.what = function() {
	return false;
}

MinesweeperCtrl.prototype.doInit = function() {
	this.init(this.displayWidth, this.displayHeight, this.displayNumMines);
}

MinesweeperCtrl.prototype.init = function(width, height, numMines) {
	this.width = width || 8;
	this.height = height || 8;
	this.numMines = numMines || 12;
	this.displayWidth = width || 8;
	this.displayHeight = height || 8;
	this.displayNumMines = numMines || 12;
	
	this.mineMap = []; // bools
	this.neighborMap = []; // numneighbors
	this.visibleMap = [];	 // exposed
	
	var remainingMines = this.numMines;
	var remainingSquares = this.width * this.height;

	for (var i = 0; i < this.height; i++) {
		var row = [];
		for (var j = 0; j < this.width; j++) {
			row.push(0);
		}
		this.neighborMap.push(row.slice(0));
		this.visibleMap.push(row.slice(0));
		this.mineMap.push(row.slice(0));

		for (var j = 0; j < this.width; j++) {
			var chance = remainingMines / remainingSquares;
			if (Math.random() < chance) {
				this.mineMap[i][j] = 1;
				remainingMines -= 1;
			}
			remainingSquares -= 1;
		}
	};

	for (var i = 0; i < this.height; i++) {
		for (var j = 0; j < this.width; j++) {
			var mineSum = 0;
			var neighbs = this.neighbors(i,j);
			for (var k = 0; k < neighbs.length; k++) {
				var neighb = neighbs[k];
				if (this.mineMap[neighb[0]][neighb[1]] == 1) {
					mineSum++;
				}
			}

			if (this.mineMap[i][j] == 1) {
				mineSum = 'X'
			}
			this.neighborMap[i][j] = mineSum;
		}
	}
};

MinesweeperCtrl.prototype.neighbors = function(y,x) {
	var neighbs = []
	for (var y0 = y - 1; y0 <= y + 1; y0++) {
		for (var x0 = x - 1; x0 <= x + 1; x0++) {
			if (x0 >= 0 && x0 < this.width && y0 >= 0 && y0 < this.height) {
				neighbs.push([y0,x0])
			}
		}
	}
	return neighbs;
};

MinesweeperCtrl.prototype.squareClick = function(y,x) {
	this.visibleMap[y][x] = 1;

	if (this.mineMap[y][x] == 1) {
		this.lost = true;
		return;
	}

	if (this.neighborMap[y][x] == 0) {
		var queue = this.neighbors(y,x);
		while (queue.length > 0) {
			var current = queue.shift();
			if (this.visibleMap[current[0]][current[1]] == 0) {
				this.visibleMap[current[0]][current[1]] = 1;
				if (this.neighborMap[current[0]][current[1]] == 0) {
					var newNeighbs = this.neighbors(current[0],current[1]);
					queue = queue.concat(newNeighbs);
				}
			}
		}
	}
}

var app = angular.module('app',[])
								 .controller('MinesweeperCtrl', MinesweeperCtrl);
