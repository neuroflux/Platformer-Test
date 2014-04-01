var desiredFPS = 100.0
var elapsed = 0
var frametime = 1000.0 / desiredFPS
var last = new Date();

var Game = {
	C: null, //canvas
	CTX: null, //context
	Data: null,
	
	Status: { //status text (such as character speech)
		x:12, //status x
		y:48, //status y
		text:"" //status text
	},
	
	Coins: [], //this scenes coins
	O: [], //this scenes objects
	People: [], //this scenes people
	Exits: [], //this scenes exits
	FG: [],
	Items: [],
	
	P: {
		x: 16, //x pos
		y: 364, //y pos
		vx: 0, //velocity x
		vy: 0, //velocity y
		w: 32, //width
		h: 56, //height
		s: 0.1, //speed
		j: 1.15, //jump speed
		r: 0.1, //run modifier
		f: 0.92, //friction
		g: 0.01, //gravity
		
		mid: null, //for perspective
		Frame: 0, //current animation frame
		FrameCount: 7, //total number of frames
		FrameSize: 32, //width of each animation frame
		Dir: "r", //which way are you facing 0 = right, 1 = left
		
		Inventory: [], //what are you holding
		
		Score: 0, //player score
		
		img: new Image(), //new player image spritesheet
		src: "img/player-right.png",
		
		jumping: false, //are the jumping?
		grounded: false, //are they on the ground?
		opening: false, //are they opening a door?
		
		CheckPos: function(dir) { //check the position of the player 
			switch(dir) {
				case 0: //left
					if (Game.P.vx > -Game.P.s) {
						return true;
					}
					break;
				case 1: //right
					if (Game.P.vx < Game.P.s) {    
						return true;                 
					}
					break;
				case 2: //up
					return true;
					break;
				case 3: //down
					break;
				default:
					break;
			}
			return false;
		}
	},
	
	Filters: { //turn on screen filters (i.e. black and white
		BnW: false, //black and white
		SinCity: false, //threshold sincity style
		Blur: false, //gaussian blur (VERY slow)
		ColourMap: false, //filtered colour
			ToneVals: {r:128,g:128,b:128} //filtered colour map
	},
	
	Vars: { //global variables and timers
		Bg: new Image(),
		GameLoop: null,
		KeyPress: null,
		CoinImage: new Image(),
		Keys: [],
		Shadow: 1.0,
		PeopleMoveTimer: null,
		Time: {
			dark: "rgba(0,0,0,1.0)",
			light: "rgba(255,255,255,1.0)",
			darkcomposite: "multiply",
			lightcomposite: "overlay",
			status: "night"
		}
	},
	
	Sounds: {
		Loaded: [],
		jumpsrc: "snd/jump1.mp3"
	},
	
	LoadCount: 0,
	PreloadImages: [
		"img/coin.png","img/door.png","img/girder.png","img/l1-s1-night.png","img/l1-s1-day.png","img/npc.png","img/player-left.png","img/player-right.png","img/shroom.png","img/tree.png","img/bag.png"
	],
	Preloaded: [],
	Functions: { //main body of functions
		Preload: function() { //initialise the game
			for(var i = 0; i < Game.PreloadImages.length; i++){ //traverse images
				var img = new Image();
				img.src = Game.PreloadImages[i];
				Game.Preloaded.push(img);
				Game.Preloaded[Game.Preloaded.length-1].onload = function(){
					Game.LoadCount++;
					if (Game.Preloaded.length === Game.PreloadImages.length) {
						setTimeout(function() {
							Game.Functions.Init();
						}, 500);
						return false;
					}
				}
			}
		},
		Init: function() {
			Game.C = document.getElementById("display"); //set canvas
			Game.CTX = Game.C.getContext("2d"); //set context
			
			Game.Vars.CoinImage.src = "img/coin.png"; //set coin image
			Game.Functions.Events(); //initalise the events for keyboard
			LevelOne.Init(); //initialise level one
			//main();
			Game.Functions.GameLoop(); //start the game loop
		},
		Update: function() { //update logicd
			if (Game.P.y > Game.C.height) {
				clearTimeout(Game.Vars.GameLoop);
				Game.Status.x = 310;
				Game.Status.y = 240;
				Game.Status.text = "You died...";
			}
			if (Game.Vars.Keys[38] || Game.Vars.Keys[32] || Game.Vars.Keys[87]) { // up arrow or space
				if(!Game.P.jumping && Game.P.grounded){ //if you are on the ground
					
					//Game.Sounds.Loaded.push(new Audio());
					//Game.Sounds.Loaded[Game.Sounds.Loaded.length-1].src = "snd/jump1.mp3";
					//Game.Sounds.Loaded[Game.Sounds.Loaded.length-1].play();
					
					Game.P.jumping = true; //jump
					Game.P.grounded = false; //off the ground
					Game.P.vy = -Game.P.j; //boing!
				}
			}
			if (Game.Vars.Keys[39] || Game.Vars.Keys[68]) { // right arrow
				if (Game.Vars.Keys[16]) {
					Game.P.s = Game.P.s + Game.P.r;
				} else {
					Game.P.s = 0.1;
				}
				if (Game.P.vx < Game.P.s) { 
					Game.P.Dir = "r"; //looking right
					Game.P.vx++; //increase the velocity
					if (!Game.P.jumping && Game.P.grounded) {
					
						//Game.Sounds.Loaded.push(new Audio());
						//Game.Sounds.Loaded[Game.Sounds.Loaded.length-1].src = "snd/steps1.mp3";
						//Game.Sounds.Loaded[Game.Sounds.Loaded.length-1].play();
						
						Game.P.Frame++; //increase the animation frame
						if (Game.P.Frame >= Game.P.FrameCount) { Game.P.Frame = 0; } //frame reset
					}
				}
			}
			if (Game.Vars.Keys[37] || Game.Vars.Keys[65]) { // left arrow 
				if (Game.Vars.Keys[16]) {
					Game.P.s = Game.P.s + Game.P.r;
				} else {
					Game.P.s = 0.1;
				}
				if (Game.P.vx > -Game.P.s) {
					Game.P.Dir = "l"; //looking left
					Game.P.vx--; //decrease the velocity
					if (!Game.P.jumping && Game.P.grounded) {
					
						//Game.Sounds.Loaded.push(new Audio());
						//Game.Sounds.Loaded[Game.Sounds.Loaded.length-1].src = "snd/steps1.mp3";
						//Game.Sounds.Loaded[Game.Sounds.Loaded.length-1].play();
					
						Game.P.Frame--; //decrease the animation frame
						if (Game.P.Frame <= 0) { Game.P.Frame = Game.P.FrameCount; } //frame reset
					}
				}
			}
			Game.P.mid = (Game.P.x / 20) - (Game.C.width - 640); //foreground movement
			Game.P.vx *= Game.P.f;
			Game.P.vy += Game.P.g;
			Game.P.grounded = false; //ensure you're grounded again
			Game.P.opening = false;
			
			for (var i = 0; i < Game.O.length; i++) { //loops through objects
				var dir = Game.Functions.ColCheck(Game.P, Game.O[i]);
				if (dir === "l" || dir === "r") { //if you're left of right of the object then stop!
					Game.P.vx = 0;
					Game.P.jumping = false;
				} else if (dir === "b") { //if you're on top of the object then stand on it!
					Game.P.grounded = true;
					Game.P.jumping = false;
				} else if (dir === "t") { //if you're under the object then bonk your head!
					Game.Status.y = Game.P.y - 24;
					Game.Status.x = Game.P.x;
					Game.Status.text = "Ow!"; //speaking to them
					
					//Game.Sounds.Loaded.push(new Audio());
					//Game.Sounds.Loaded[Game.Sounds.Loaded.length-1].src = "snd/ow1.mp3";
					//Game.Sounds.Loaded[Game.Sounds.Loaded.length-1].play();
					
					Game.P.vy *= -1;
				} else {
					setTimeout(function() {
						Game.Status.text = ""; //turn off status text
					}, 1000);
				}
			}
			for (var c = 0; c < Game.Coins.length; c++) {//loops through coins
				var coindir = Game.Functions.ColCheck(Game.P, Game.Coins[c]); //get collision direction
				if (coindir && Game.Coins[c]) {
					Game.Status.y = Game.Coins[c].y - 24;
					Game.Status.x = Game.Coins[c].x - 48;
					Game.Status.text = "Ping!"; //speaking to them
					Game.Coins.splice(c,1); //remove coin
					Game.P.Score += 10; //score!
				} else {
					setTimeout(function() {
						Game.Status.text = ""; //turn off status text
					}, 1000);
				}
			}
			for (var it = 0; it < Game.Items.length; it++) {//loops through coins
				var itemdir = Game.Functions.ColCheck(Game.P, Game.Items[it]); //get collision direction
				if (itemdir && Game.Items[it]) {
					Game.Status.y = Game.Items[it].y - 24;
					Game.Status.x = Game.Items[it].x - 48;
					Game.Status.text = "Oh, A bag!"; //speaking to them
					if (Game.Vars.Keys[13]) { //you pressed enter!
						Game.Status.text = "Yoink..."; //speaking to them
						Game.P.Inventory.push(Game.Items[it]);
						Game.Items.splice(it,1); //remove item
					}
				} else {
					setTimeout(function() {
						Game.Status.text = ""; //turn off status text
					}, 1000);
				}
			}
			for (var p = 0; p < Game.People.length; p++) { //loops through people
				var peopledir = Game.Functions.ColCheck(Game.P, Game.People[p]); //get collision direction
				if (peopledir === "b") { //if you're on top of the person
					Game.Status.y = Game.People[p].y - 24;
					Game.Status.x = Game.People[p].x - 48;
					Game.Status.text = Game.People[p].land; //landed on them
					Game.P.vy = 0;
					Game.P.grounded = true;
					Game.P.jumping = false;
				} else if (peopledir && peopledir == Game.P.Dir) { //otherwise...
					Game.Status.y = Game.People[p].y - 24;
					Game.Status.x = Game.People[p].x - 48;
					var isDone = false;
					for (var ti = 0; ti < Game.P.Inventory.length; ti++) {
						if (Game.P.Inventory[ti].name == Game.People[p].mission) {
							isDone = true;
						}
					}
					if (isDone) {
						Game.Status.text = Game.People[p].success; //speaking to them
						Game.P.Score += Game.People[p].money;
						Game.P.Inventory = [];
						Game.Vars.PeopleMoveTimer = setInterval(function() {
							if (p < Game.People.length) {
								if (Game.People[p].x > Game.C.width) {
									Game.People.splice(p,1);
									clearInterval(Game.Vars.PeopleMoveTimer);
									Game.Vars.PeopleMoveTimer = null;
									isDone = false;
								} else {
									Game.People[p].x++;
								}
							} else {
								clearInterval(Game.Vars.PeopleMoveTimer);
								Game.Vars.PeopleMoveTimer = null;
								isDone = false;
							}
						}, 50);
						return false;
					} else {
						Game.Status.text = Game.People[p].speak; //speaking to them
					}
				} else {
					setTimeout(function() {
						Game.Status.text = ""; //turn off status text
					}, 1000);
				}
			}
			
			for (var e = 0; e < Game.Exits.length; e++) { //loops through exits
				var exitdir = Game.Functions.ColCheck(Game.P, Game.Exits[e]); //get collision direction
				if (exitdir === "l" || exitdir === "r") { //if you are to the right or left of the object
					Game.Status.y = Game.Exits[e].y - 24;
					Game.Status.x = Game.Exits[e].x - 48;
					Game.Status.text = "Press 'enter' to exit"; //offer to exit
					if (Game.Vars.Keys[13]) { //you pressed enter!
						if (!Game.P.opening) {
							Game.P.opening = true; //opening door
							Game.Status.text = "Opening door...";
							
							if (Game.P.Dir == exitdir) {
								if (Game.Exits[e].exitPos !== 0) {
									Game.P.x = Game.Exits[e].exitPos;
								}
								Game.Exits[e].To();
							}
						}
					}
				} else if (exitdir === "b") {
					Game.P.vy = 0;
					Game.P.grounded = true;
					Game.P.jumping = false;
				}
			}
			if (Game.P.grounded){ //if you're grounded
				 Game.P.vy = 0; //no velocity!
			}
			Game.P.x += Game.P.vx; //update x position
			Game.P.y += Game.P.vy; //update y position
			
			Game.Functions.Draw(); //draw scene!
		},
		Draw: function() { //draw the scene
			//Game.CTX.clearRect(0,0,Game.C.width,Game.C.height); //clear everything (to be redone for speed)
			Game.CTX.clearRect((Game.P.x - 20),(Game.P.y-20),72,104); //clear local to player
			
			Game.Functions.Rect(1,1,Game.C.width-2,Game.C.height-2, "rgba(0,0,0,1.0)"); //black border
			Game.Functions.Rect(2,2,Game.C.width-4,Game.C.height-4, "rgba(255,255,255,1.0)"); //white interior
						
			Game.CTX.drawImage(Game.Vars.Bg,-40 - (Game.P.mid - (Game.P.mid*2)),0); //draw scene background
						
			for (var e = 0; e < Game.Exits.length; e++) { //exits loop
				Game.Exits[e].img.src = Game.Exits[e].src; //image source
				Game.CTX.drawImage(Game.Exits[e].img, Game.Exits[e].x, Game.Exits[e].y); //draw exits
			}
			
			for (var i = 0; i < Game.Coins.length; i++) { //coins loop
				Game.CTX.drawImage(Game.Vars.CoinImage, Game.Coins[i].x, Game.Coins[i].y); //draw coin
			}
			
			for (var it = 0; it < Game.Items.length; it++) { //items loop
				Game.Items[it].img.src = Game.Items[it].src; //image source
				Game.CTX.drawImage(Game.Items[it].img, Game.Items[it].x, Game.Items[it].y); //draw items
			}
			
			for (var p = 0; p < Game.People.length; p++) { //characters loop
				Game.People[p].img.src = Game.People[p].src; //image source
				Game.CTX.drawImage(Game.People[p].img, Game.People[p].x, Game.People[p].y); //draw character
			}
			
			
			for (var i = 0; i < Game.O.length; i++) { //object loop
				if (Game.O[i].src !== "") { //if there is an image
					Game.O[i].img.src = Game.O[i].src; //image source
					Game.CTX.drawImage(Game.O[i].img, Game.O[i].x, Game.O[i].y); //draw object
				} else {
					Game.Functions.Rect(Game.O[i].x, Game.O[i].y, Game.O[i].w, Game.O[i].h, Game.O[i].c); //draw rectangle
				}
			}
			
			Game.Functions.DrawPlayer(Game.P.x, Game.P.y); //draw the player!
			
			for (var f = 0; f < Game.FG.length; f++) { //foreground loop
				Game.FG[f].img.src = Game.FG[f].src; //image source
				Game.CTX.drawImage(Game.FG[f].img, Game.FG[f].x - Game.P.mid, Game.FG[f].y); //draw foreground
			}
			
			//gradient
			var grd = Game.CTX.createRadialGradient(Game.P.x, Game.P.y, 10, 240, 480, 540); //sky gradient
			grd.addColorStop(0, Game.Vars.Time.light); //gradient trans
			grd.addColorStop(1, Game.Vars.Time.dark); //gradient trans
			
			if (window.navigator.userAgent.indexOf("Chrome") > -1) {
				Game.CTX.globalCompositeOperation = Game.Vars.Time.darkcomposite;
				Game.Functions.Rect(0, 0, Game.C.width, Game.C.height, grd); //DARK
				Game.Functions.Rect(0, 0, Game.C.width, Game.C.height, grd); //DARKER
				Game.CTX.globalCompositeOperation = Game.Vars.Time.lightcomposite;
				Game.Functions.Rect(0, 0, Game.C.width, Game.C.height, grd); //LIGHTER
				Game.CTX.globalCompositeOperation = "source-over";
			}
			
			Game.Functions.HUD(); //overlay the HUD of score and status text etc
			
			if (Game.Filters.BnW) { //check for Black n White filter
				var imgData = Game.CTX.getImageData(0, 0, Game.C.width, Game.C.height);
				var pixels  = imgData.data;
				for (var i = 0, n = pixels.length; i < n; i += 4) {
					var grayscale = pixels[i] * .3 + pixels[i+1] * .59 + pixels[i+2] * .11;
					pixels[i  ] = grayscale; pixels[i+1] = grayscale; pixels[i+2] = grayscale;
				}
				Game.CTX.putImageData(imgData, 0, 0);
			} else if (Game.Filters.SinCity) { //check for SinCity filter
				var imgData = Game.CTX.getImageData(0, 0, Game.C.width, Game.C.height);
				var d = imgData.data;
				for (var i=0; i<d.length; i+=4) {
					var r = d[i];
					var g = d[i+1];
					var b = d[i+2];
					var v = (0.2126*r + 0.7152*g + 0.0722*b >= 80) ? 255 : 0;
					d[i] = d[i+1] = d[i+2] = v
				}
				Game.CTX.putImageData(imgData, 0, 0);
			} else if (Game.Filters.Blur) { //check for Gaussian Blur filter
				var imgd = Game.CTX.getImageData(0, 0, Game.C.width, Game.C.height);
				var data = imgd.data;
				for (br = 0; br < 1.2; br += 1) {
					for (var i = 0, n = data.length; i < n; i += 4) {
						iMW = 4 * Game.C.width;
						iSumOpacity = iSumRed = iSumGreen = iSumBlue = 0;
						iCnt = 0;
						aCloseData = [
							i - iMW - 4, i - iMW, i - iMW + 4, // top pixels
							i - 4, i + 4, // middle pixels
							i + iMW - 4, i + iMW, i + iMW + 4 // bottom pixels
						];
						for (e = 0; e < aCloseData.length; e += 1) {
							if (aCloseData[e] >= 0 && aCloseData[e] <= data.length - 3) {
								iSumOpacity += data[aCloseData[e]];
								iSumRed += data[aCloseData[e] + 1];
								iSumGreen += data[aCloseData[e] + 2];
								iSumBlue += data[aCloseData[e] + 3];
								iCnt += 1;
							}
						}
						data[i] = (iSumOpacity / iCnt)*0.99+0;
						data[i+1] = (iSumRed / iCnt)*0.99+0;
						data[i+2] = (iSumGreen / iCnt)*0.99+0;
						data[i+3] = (iSumBlue / iCnt);
					}
				}
				Game.CTX.putImageData(imgd, 0, 0);
			} else if (Game.Filters.ColourMap) { //check for ColourMap filter
				Game.CTX.fillStyle = "rgba("+Game.Filters.ToneVals.r+","+Game.Filters.ToneVals.g+","+Game.Filters.ToneVals.b+",1.0)";
				Game.CTX.globalCompositeOperation = "darker";
				Game.CTX.fillRect(0,0,Game.C.width,Game.C.height);
				Game.CTX.globalCompositeOperation = "source-over";
			}	
			Game.Functions.GameLoop(); //loop over
		},
		GameLoop: function() { //initialise game loop
			//fps
			var now = new Date();
			var delta = now.getTime() - last.getTime();
			last = now;
			elapsed += delta;
			Game.Vars.GameLoop = setTimeout(function() { 
				requestAnimFrame(Game.Functions.Update, Game.C); 
				
				//var imageData = Game.CTX.getImageData(0,0,640,480);
				//typedArray = imageData.data;
				
				elapsed = 0;
			}, 1);
		},
		HUD: function() { //HUD overlay
			Game.CTX.fillStyle = "rgba(255,255,255,1.0)";
			Game.CTX.font = 'italic 13pt Comic sans MS';
			Game.CTX.fillText("Score: " + Game.P.Score, 12, 24);
			Game.CTX.shadowOffsetX = 4; Game.CTX.shadowOffsetY = 4; Game.CTX.shadowBlur = 5; Game.CTX.shadowColor = "rgba(0,0,0,0.65)";
			Game.CTX.fillText(Game.Status.text, Game.Status.x, Game.Status.y);
			Game.CTX.shadowOffsetX = 0; Game.CTX.shadowOffsetY = 0; Game.CTX.shadowBlur = 0; Game.CTX.shadowColor = "rgba(0,0,0,0.65)";
		},
		DrawPlayer: function(x,y) { //player drawing
			Game.P.img.src = Game.P.src;
			if (Game.P.Dir === "r") { //looking right
				/** CHANGE TO RIGHT HAND IMAGE **/
				Game.P.img.src = "img/player-right.png";
			} else { //looking left
				/** CHANGE TO LEFT HAND IMAGE **/
				Game.P.img.src = "img/player-left.png";
			}
			Game.CTX.drawImage(Game.P.img, Game.P.Frame * Game.P.FrameSize, 0, Game.P.w, Game.P.h, x, y, Game.P.w, Game.P.h);
			
			for (var items = 0; items < Game.P.Inventory.length; items++) {
				Game.CTX.drawImage(Game.P.Inventory[items].img, x, y-28, Game.P.Inventory[items].w, Game.P.Inventory[items].h);
			}

		},
		TimeTimer: null,
		Time: function(time) {
			if (time === "day") {
				Game.Vars.Time.darkcomposite = "multiply";
				Game.Vars.Time.lightcomposite = "overlay";
				Game.Vars.Time.dark = "rgba(200,200,230,1.0)";
				Game.Vars.Time.light = "rgba(255,255,255,0.5)";
				Game.Vars.Time.status = "day";
			} else if (time === "night") {
				Game.Vars.Time.darkcomposite = "multiply";
				Game.Vars.Time.lightcomposite = "overlay";
				Game.Vars.Time.dark = "rgba(0,0,0,1.0)";
				Game.Vars.Time.light = "rgba(255,255,255,1.0)";
				Game.Vars.Time.status = "night";
			}
			Game.Vars.Bg.src = "img/l1-s1-" + Game.Vars.Time.status + ".png";
		},
		ColCheck: function(shapeA,shapeB,ignore) { //collision checks
			if (!ignore) {
				var vX = (shapeA.x + (shapeA.w / 2)) - (shapeB.x + (shapeB.w / 2)),
					vY = (shapeA.y + (shapeA.h / 2)) - (shapeB.y + (shapeB.h / 2)),
					hWidths = (shapeA.w / 2) + (shapeB.w / 2),
					hHeights = (shapeA.h / 2) + (shapeB.h / 2),
					colDir = null;
					
				if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
				var oX = hWidths - Math.abs(vX),
					oY = hHeights - Math.abs(vY);
					
					if (oX >= oY) {
						if (vY > 0) {
							colDir = "t";
							shapeA.y += oY;
						} else {
							colDir = "b";
							shapeA.y -= oY;
						}
					} else {
						if (vX > 0) {
							colDir = "l";
							shapeA.x += oX;
						} else {
							colDir = "r";
							shapeA.x -= oX;
						}
					}
				}
				return colDir;
			}
			console.log(1);
		},
		Rect: function(x,y,w,h,c) { //draw rectangle
			if (!c) {
				c = "rgba(0,0,0,1.0)";
			}
			Game.CTX.fillStyle = c;
			Game.CTX.fillRect(x,y,w,h);			
		},
		Events: function() { //set up events
			Game.Vars.KeyPress = document.addEventListener("keydown", function(e) { //keydown
				Game.Vars.Keys[e.keyCode] = true;
			});
			Game.Vars.KeyPress = document.addEventListener("keyup", function(e) { //keyup
				Game.Vars.Keys[e.keyCode] = false;
			});
		}
	}
};

window.requestAnimFrame = (function(){ //standard Animation Frame Request (x-Browser)
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
	function (callback, element){
		fpsLoop = window.setTimeout(callback, 1000 / 60);
	};
}());

window.onload = function() {
	//Game.Functions.Init(); //LETS GO!
	Game.Functions.Preload(); //LETS GO!
}