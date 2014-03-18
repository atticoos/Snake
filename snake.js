(function(){
	
	var canvas = document.getElementById("snake");
	var ctx = canvas.getContext("2d");
	
	
	
	var Game = {
		snake: false,
		timeInterval: 500,
		timeDelta: 30,
		timeThreshold: 50,
		blocks: [],
		graph: [],
		direction: {
			x: 0,
			y: 0
		},
		
		updateScreen: function(){
			var self = this;
			self.snake.move();
			
			
			var removeBlockIdx = false;
			for (var i=0; i<self.blocks.length; i++){
				var node = self.snake.nodes[0];
				var block = self.blocks[i];
				
				if (node.x >= block.x && node.x <= block.x+5 && node.y >= block.y && node.y <= block.y + 5){
					self.snake.grow();
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
				ctx.fillRect(node.x, node.y, 5, 5);
			}
			ctx.fillStyle = "#ffff00";
			for (var i=0; i<self.blocks.length; i++){
				var node = self.blocks[i];
				ctx.fillRect(node.x, node.y, 5, 5);
			}
		},
		inputs: function(){
			var self = this;
			document.onkeydown = function(evt){
				evt = evt || window.event;
				
				if (evt.keyCode == 32){
					self.snake.grow();
					return;
				}
				
				var currentDirection = self.snake.direction;
				
				self.direction.y = 0;
				self.direction.x = 0;
				
				
				
				if (evt.keyCode == 38){
					self.direction.y = -5;
					evt.preventDefault();
				} else if (evt.keyCode == 40){
					self.direction.y = 5;
					evt.preventDefault();
				} else if (evt.keyCode == 37){
					self.direction.x = -5;
					evt.preventDefault();
				} else if (evt.keyCode == 39){
					self.direction.x = 5;
					evt.preventDefault();
				}
				
			}
			
		},
		generateBlock: function(){
			var block = new Node();
			var x_slots = Math.floor(canvas.width / 5) -1;
			var y_slots = Math.floor(canvas.height / 5) -1;
			
			var x = Math.floor(Math.random() * x_slots) + 1;
			var y = Math.floor(Math.random() * y_slots) + 1;
			x *= 5;
			y *= 5;
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
		
		initialize : function(){
			this.snake = new Snake();
			
			this.test();
			return;
			this.inputs();
			this.generateBlock();
			this.updateScreen();
		}	
	
	};
	
	
	var Snake = function(){
		var self = this;
		this.nodes = [];
		
		
		this.move = function(){
			var node = self.nodes[0];
			node.move(node.x + Game.direction.x, node.y + Game.direction.y);
			
			
			for (var i=1; i<self.nodes.length; i++){
				self.nodes[i].move();
			}
			
		};
		
		this.grow = function(){
			var lastNode = this.nodes[this.nodes.length-1];
			var node = new Node(lastNode);
			this.nodes.push(node);
			return;
			
			/*
			var offset = {
				x: Game.direction.x > 0 ? 1 : Game.direction.x < 0 ? -1 : 0,
				y: Game.direction.y > 0 ? 1 : Game.direction.y < 0 ? -1 : 0
			}
			*/
			var lastNode = this.nodes[this.nodes.length-1];
			var node = new Node(lastNode.prevX, lastNode.prevY);
			node.prev = lastNode;
			this.nodes[this.nodes.length-1].next = node;
			this.nodes.push(node);
		}
		
		var init = function(){
			var node = new Node();
			node.x = 50;
			node.y = 50;
			self.nodes.push(node);
		}
		
		init();
	};
	
	var Node = function(lastNode){
		this.prev = false;
		this.next = false;
		this.x;
		this.y;
		this.prevX;
		this.prevY;
		
		if (lastNode){
			this.next = lastNode;
			this.x = lastNode.x;
			this.y = lastNode.y;
			lastNode.prev = this;
		}
		
		
		this.move = function (x,y){
			//this.prevX = this.x;
			//this.prevY = this.y;
			//this.x = x;
			//this.y = y;
			this.prevX = this.x;
			this.prevY = this.y;
			if (x && y){
				this.x = x;
				this.y = y;
				return;
			}
			
			/*
			var offset = {
				x: Game.direction.x > 0 ? 1 : Game.direction.x < 0 ? -1 : 0,
				y: Game.direction.y > 0 ? 1 : Game.direction.y < 0 ? -1 : 0
			}
			*/
			
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
	
})();