(function($){
	
	var canvas = document.getElementById("snake");
	var ctx = canvas.getContext("2d");
	
	
	
	var Game = {
		snake: false,
		timeInterval: 500,
		timeDelta: 30,
		timeThreshold: 50,
		blocks: [],
		graph: [],
		score: 1,
		scoreModifier: 1,
		direction: {
			x: 0,
			y: 0
		},
		startTime: 0,
		gameState: {
			'playing' : false,
			'complete' : false
		},
		
		
		increaseScore: function(){
			self.score += (1 * self.scoreModifier);
		},
		updateTime: function(){
			var min = 0, sec = 0, self = this;
			
			if (self.startTime){
				var now = new Date();
				var diff = (now - self.startTime);
	
				var min = Math.floor(((diff/1000)/60));
				var sec = Math.floor((diff/1000));
			}
			var minFormatted = "0" + min;
			minFormatted = minFormatted.substring(minFormatted.length - 2);
			var secFormatted = "0" + sec;
			secFormatted = secFormatted.substring(secFormatted.length - 2);
			
			$("#timer").text(minFormatted + ":" + secFormatted);
		},
		detectBoundaryCollision: function(){
			var self = this,
				boundaryX = Math.floor(canvas.width / 7) + 1,
				boundaryY = Math.floor(canvas.height / 7) + 1;
			if (self.snake.nodes[0].x >= boundaryX || self.snake.nodes[0].x < 0){
				alert("Collision");
				self.gameState.complete = true;
			} else if (self.snake.nodes[0].y >= boundaryY || self.snake.nodes[0].y < 0){
				alert("Collision");
				self.gameState.complete = true;
			}
		},
		updateScreen: function(){
			var self = this;
			self.snake.move();
			self.detectBoundaryCollision();
			
			var removeBlockIdx = false;
			for (var i=0; i<self.blocks.length; i++){
				var node = self.snake.nodes[0];
				var block = self.blocks[i];
				
				if (node.x == block.x && node.y == block.y){
					self.snake.grow();
					self.score++;
					removeBlockIdx = i;
				}
				
			}
			if (removeBlockIdx !== false){
				self.blocks.splice(removeBlockIdx, 1);
				if (self.timeInterval >= self.timeThreshold){
					self.timeInterval -= self.timeDelta;
				}
				self.generateBlock();
			}
			self.renderScreen();
			setTimeout(function(){ self.updateScreen(); }, self.timeInterval);
		},
		renderScreen: function(){
			var self = this;
			ctx.clearRect(0,0, canvas.width, canvas.height);
			ctx.fillStyle = "#FFF";
			for (var i=0; i<self.snake.nodes.length; i++){
				var node = self.snake.nodes[i];
				ctx.fillRect((node.x*7)+1, (node.y*7)+1, 5, 5);
			}
			ctx.fillStyle = "#ffff00";
			for (var i=0; i<self.blocks.length; i++){
				var node = self.blocks[i];
				ctx.fillRect((node.x*7)+1, (node.y*7)+1, 5, 5);
			}
			
			$("#score").text(self.score);
			self.updateTime();
		},
		inputs: function(){
			var self = this;
			document.onkeydown = function(evt){
				evt = evt || window.event;
				
				if (evt.keyCode == 38){
					// UP
					evt.preventDefault();
					if (self.direction.y == 1) return;
					self.direction.x = 0;
					self.direction.y = -1;
				} else if (evt.keyCode == 40){
					// DOWN
					evt.preventDefault();
					if (self.direction.y == -1) return;
					self.direction.x = 0;
					self.direction.y = 1;
				} else if (evt.keyCode == 37){
					// LEFT
					evt.preventDefault();
					if (self.direction.x == 1) return;
					self.direction.x = -1;
					self.direction.y = 0;
				} else if (evt.keyCode == 39){
					// RIGHT
					evt.preventDefault();
					if (self.direction.x == -1) return;
					self.direction.x = 1;
					self.direction.y = 0;
				} else {
					return;
				}
				
				if (!self.gameState.playing && !self.gameState.complete){
					self.startGame();
				}
				
			}
			
		},
		generateBlock: function(){
			var block = new Node();
			var x_slots = Math.floor(canvas.width / 7);
			var y_slots = Math.floor(canvas.height / 7);
			
			var x = Math.floor(Math.random() * x_slots) + 1;
			var y = Math.floor(Math.random() * y_slots) + 1;
			console.log("New block", {x: x, y:y});
			block.x = x;
			block.y = y;
			this.blocks.push(block);
		},
		
		test: function(){
			var x_slots = Math.floor(canvas.width / 7) ;
			var y_slots = Math.floor(canvas.height / 7);
			
			ctx.fillStyle = "#ffffff";
			for (var i=0; i<x_slots; i++){
				for (var j=0; j<y_slots; j++){
					ctx.fillRect((i * 7)+1, (j * 7)+1, 5, 5);
				}
			}
			
		},
		
		startGame: function(){
			this.startTime = new Date();
			this.gameState.playing = true;
		},	
		initialize : function(){
			this.snake = new Snake(this);
			this.inputs();
			this.generateBlock();
			this.updateScreen();
			
		}	
	
	};
	
	
	var Snake = function(game){
		var self = this;
		var game = game;
		this.nodes = [];
		
		
		
		this.move = function(){
			var node = self.nodes[0];
			node.move(node.x + Game.direction.x, node.y + Game.direction.y);
			
			
			
			
			for (var i=1; i<self.nodes.length; i++){
				self.nodes[i].move();
				if (node.x == self.nodes[i].x && node.y == self.nodes[i].y){
					alert("Collision");
				}
			}
			
		};
		
		this.grow = function(){
			var lastNode = this.nodes[this.nodes.length-1];
			var node = new Node(lastNode, game.direction);
			this.nodes.push(node);
		}
		
		var init = function(){
			var node = new Node();
			node.x = Math.floor((Math.floor(canvas.width / 7)-1) / 2);
			node.y = Math.floor((Math.floor(canvas.height / 7)-1) / 2);
			self.nodes.push(node);
		}
		
		init();
	};
	
	var Node = function(lastNode, direction){
		this.prev = false;
		this.next = false;
		this.x;
		this.y;
		this.prevX;
		this.prevY;
		
		if (lastNode){
			this.next = lastNode;
			
			var growthDirection = {x:0,y:0};
			if (this.next.next){
				this.x = this.next.x - (this.next.next.x - this.next.x);
				this.y = this.next.y - (this.next.next.y - this.next.y);
			} else {
				this.x = this.next.x - direction.x;
				this.y = this.next.y - direction.y;
			}
			
			/*
			if(lastNode.next){
				if (lastNode.next.x == lastNode.x){
					// increase Y
					this.x = lastNode.y - direction.y;
				} else if (lastNode.next.y == lastNode.y){
					// increase X
					this.y = lastNode.x - direction.x;
				}
				
			} else {
				this.x = lastNode.x - direction.x;
				this.y = lastNode.y - direction.y;	
			}
			*/
			lastNode.prev = this;
		}
		
		
		this.move = function (x,y){
			this.prevX = this.x;
			this.prevY = this.y;
			if (x && y){
				this.x = x;
				this.y = y;
				return;
			}
			
			var prevNode = this.next;
			this.x = prevNode.prevX;
			this.y = prevNode.prevY;
			return;
			if (prevNode.x != this.x){
				this.x = prevNode.x - 6;
			} else if (prevNode.y != this.y){
				this.y = prevNode.y - 6;
			}
		}
	};
	
	
	Game.initialize();
	
})(jQuery);