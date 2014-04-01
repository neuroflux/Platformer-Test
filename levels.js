/** EXAMPLE SCENE 

	Init() 				=		is a standard function and should be included in every level structure.
	Game.Vars.Bg		=		is set to the background image of the scene
	Game.People			=		array holding all characters (including their speech and movement) and moveable objects
	Game.Exits			=		array holding all exits from the scene
	Game.Coins			=		array holding all collectable coins
	Game.O				=		anything else that the player cannot move through (trees etc)
	
**/

var LevelOne = {
	Init: function() {
		Game.Vars.Bg.src = "img/l1-s1-" + Game.Vars.Time.status + ".png";
		Game.P.x = 16;
		Game.P.y = 364;
		LevelOne.SceneOne();
	},
	Visited: {
		SceneOne: true,
		SceneTwo: false,
		SceneThree: false
	},
	SceneOne: function() {
		Game.Coins.length = 0;
		Game.O.length = 0;
		Game.People.length = 0;
		Game.FG.length = 0;
		Game.Exits.length = 0;
		Game.Items.length = 0;
		Game.P.opening = false;
		Game.Status.text = "";
		Game.Sounds.Loaded.length = 0;
		
		LevelOne.Visited.SceneOne = true;
		
		if (!LevelOne.Visited.SceneOne) {
			Game.Coins.push({ 
				x:220, y:Game.C.height-120,
				w:32, h:32
			});
			Game.Coins.push({ 
				x:250, y:Game.C.height-120,
				w:32, h:32
			});
			Game.Coins.push({ 
				x:280, y:Game.C.height-120,
				w:32, h:32
			});
		}
		
		Game.FG.push({ //fence
			x:0, y:320,
			w:480, h:170,
			img: new Image(),
			src:"img/fence.png"
		});
		Game.People.push({ //sign
			x:125, y:Game.C.height-136,
			w:64, h:64,
			img:new Image(),
			src:"img/sign.png",
			land:"",
			speak:"'Collect Coins!'"
		});
		Game.People.push({ //sign
			x:385, y:Game.C.height-136,
			w:64, h:64,
			img:new Image(),
			src:"img/sign.png",
			land:"",
			speak:"'Go Through Doors!'"
		});
		setTimeout(function() {
			Game.Exits.push({
				x:580, y:Game.C.height-136,
				w:32, h:32,
				img:new Image(),
				src:"img/door.png",
				To: LevelOne.SceneTwo,
				exitPos: 16
			});
		}, 50);
		Game.O.push({ //left wall
			x:0, y:0,
			w:5, h:Game.C.height-2,
			img: new Image(),
			src: "",
			c: 'black'
		});
		Game.O.push({ //right wall
			x:Game.C.width-5, y:0,
			w:5, h:Game.C.height-2,
			img: new Image(),
			src: "",
			c: 'black'
		});
		Game.O.push({ //ceiling
			x:0, y:0,
			w:Game.C.width, h:5,
			img: new Image(),
			src: "",
			c: 'black'
		});	
		Game.O.push({ //floor
			x:0, y:Game.C.height-72,
			w:Game.C.width, h:1,
			img: new Image(),
			src: "img/floor.png",
			c: ""
		});	
		Game.P.opening = false; //closing doors
	},
	SceneTwo: function() {
		Game.Coins.length = 0;
		Game.O.length = 0;
		Game.People.length = 0;
		Game.FG.length = 0;
		Game.Exits.length = 0;
		Game.Items.length = 0;
		Game.P.x = 16;
		Game.P.y = 364;
		Game.P.opening = false;
		Game.Status.text = "";
		Game.Sounds.Loaded.length = 0;
		
		LevelOne.Visited.SceneTwo = true;
		
		if (!LevelOne.Visited.SceneTwo) {
			Game.Coins.push({ 
				x:220, y:Game.C.height-120,
				w:32, h:32
			});
			Game.Coins.push({ 
				x:250, y:Game.C.height-120,
				w:32, h:32
			});
			Game.Coins.push({ 
				x:280, y:Game.C.height-120,
				w:32, h:32
			});
		}
		
		Game.FG.push({ //fence
			x:0, y:320,
			w:480, h:170,
			img: new Image(),
			src:"img/fence.png"
		});
		Game.FG.push({ //;largetree
			x:200, y:320,
			w:640, h:220,
			img: new Image(),
			src:"img/largetree.png"
		});
		Game.O.push({ //left wall
			x:0, y:0,
			w:5, h:Game.C.height-2,
			img: new Image(),
			src: "",
			c: 'black'
		});
		Game.O.push({ //right wall
			x:Game.C.width-5, y:0,
			w:5, h:Game.C.height-2,
			img: new Image(),
			src: "",
			c: 'black'
		});
		Game.O.push({ //ceiling
			x:0, y:0,
			w:Game.C.width, h:5,
			img: new Image(),
			src: "",
			c: 'black'
		});	
		Game.People.push({ //oldman
			x:325, y:Game.C.height-136,
			w:32, h:64,
			img:new Image(),
			src:"img/npc.png",
			land:"Ouch!",
			speak:"Can you help me find my marbles?",
			mission:"bag", money: 50,
			success:"Oh! thank you very much!"
		});
		Game.O.push({ //girder
			x:16, y:240,
			w:100, h:16,
			img: new Image(),
			src: "img/girder.png",
			c: 'black'
		});	
		Game.O.push({ //floor
			x:0, y:Game.C.height-72,
			w:Game.C.width, h:1,
			img: new Image(),
			src: "img/floor.png",
			c: ""
		});
		setTimeout(function() {
			Game.Exits.push({
				x:0, y:Game.C.height-136,
				w:32, h:32,
				img:new Image(),
				src:"img/door.png",
				To: LevelOne.SceneOne,
				exitPos: 535
			});
			Game.Exits.push({
				x:580, y:Game.C.height-136,
				w:32, h:32,
				img:new Image(),
				src:"img/door.png",
				To: LevelOne.SceneThree,
				exitPos: 16
			});
		}, 50);
		Game.P.opening = false; //closing doors
	},
	SceneThree: function() {
		Game.Coins.length = 0;
		Game.O.length = 0;
		Game.People.length = 0;
		Game.FG.length = 0;
		Game.Exits.length = 0;
		Game.Items.length = 0;
		Game.P.x = 16;
		Game.P.y = 364;
		Game.P.opening = false;
		Game.Status.text = "";
		
		/** COMMENTED OUT TEMPORARILY **
			Game.Functions.Time("day"); //change time
		**/
		
		LevelOne.Visited.SceneThree = true;
		
		Game.O.push({ //left wall
			x:0, y:0,
			w:5, h:Game.C.height-2,
			img: new Image(),
			src: "",
			c: 'black'
		});
		Game.O.push({ //right wall
			x:Game.C.width-5, y:0,
			w:5, h:Game.C.height-2,
			img: new Image(),
			src: "",
			c: 'black'
		});
		Game.O.push({ //ceiling
			x:0, y:0,
			w:Game.C.width, h:5,
			img: new Image(),
			src: "",
			c: 'black'
		});	
		Game.O.push({ //floor
			x:0, y:Game.C.height-72,
			w:Game.C.width, h:1,
			img: new Image(),
			src: "img/floor.png",
			c: ""
		});
		Game.Items.push({ //bag
			x:400, y:Game.C.height-102,
			w:32, h:32,
			name:"bag",
			img: new Image(),
			src: "img/bag.png",
			c: ""
		});
		setTimeout(function() {
			Game.Exits.push({
				x:0, y:Game.C.height-136,
				w:32, h:32,
				img:new Image(),
				src:"img/door.png",
				To: LevelOne.SceneTwo,
				exitPos: 535
			});
		}, 50);
		Game.P.opening = false;
	}
};