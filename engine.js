var fps = 50, mouseClickX = 0, mouseClickY = 0, mousePosX = 0, mousePosY = 0;
var entities = [];
function gamespace(){
	this.canvas = document.getElementById('gamespace');
	this.initialize = function(){
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas,document.body.childNodes[0]);
	};
	/*this.clear = function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	};*/
}
function gamestate(){
	/*this.acceptinput = function(){
		//checkEntitiesClicked();
	};*/
	this.updatestate = function(){
		moveEntities();
	};
	this.renderstate = function(){
		gamespace.context.clearRect(0,0,gamespace.canvas.width,gamespace.canvas.height);
		drawEntities();
		//gamespace.clear();
		//entities.forEach();
	};
	this.run = function(){
		//gamestate.acceptinput();
		gamestate.updatestate();
		gamestate.renderstate();
		//clearSelections();
	};
	this.start = function(){
		gamespace = new gamespace();
		gamespace.initialize();
		this.interval = setInterval(this.run,1000/fps);
		// finds mouse event for all of canvas
		new mouseClickListener(gamespace.canvas,function(e){
			mouseClickX = e.x;
			mouseClickY = e.y;
			mouseClickX -= gamespace.canvas.offsetLeft;
			mouseClickY -= gamespace.canvas.offsetTop;
			//console.log(mouseClickX+","+mouseClickY);
			checkForSelection();
		});
		// order counts! make background the first entity!
		new entity('bg','rectangle',500,500,'black',250,250,0,0,0,0,false,false,true,false);
		new entity('test_item','circle',50,50,'blue',250,250,0,0,250,250,true,true,false,false);
		new entity('test_item_2','circle',50,50,'purple',100,100,0,0,100,100,false,true,false,false);
	};
	this.stop = function(){
		clearInterval(this.interval);
	};
}
function moveEntities(){
	for(i=0;i<entities.length;i++){
		if(entities[i].selected==true){
			if(entities[i].static==false){
				entities[i].color='green';
			}
		}
	}
}
function checkForSelection(){
	for(i=0;i<entities.length;i++){
		switch(entities[i].shape){
			case 'circle':
				var radius = entities[i].width/2;
				var mouseClickDistance = Math.sqrt(Math.pow(mouseClickX-entities[i].posX,2)+Math.pow(mouseClickY-entities[i].posY,2));
				if((mouseClickDistance<radius)&&(entities[i].clickable==true)){
					entities[i].selected = true;
					console.log(entities[i].name+" has been selected");
				} else if((mouseClickDistance>radius)&&(entities[i].selected==true)){
					entities[i].selected = false;
				} else {
					entities[i].selected = false;
				}
				break;
			default:
				
		}
	}
}
function drawEntities(){
	var ctx = gamespace.context;
	for(i=0;i<entities.length;i++){
		ctx.fillStyle = entities[i].color;
		switch(entities[i].shape){
			case 'circle':
				var radius = entities[i].width/2;
				ctx.beginPath();
				ctx.arc(entities[i].posX,entities[i].posY,radius,0,2*Math.PI);
				ctx.fill();
				break;
			default:
				ctx.fillRect(entities[i].posX-(entities[i].width/2),entities[i].posY-(entities[i].height/2),entities[i].width,entities[i].height);
		}
	}
}
function entity(name,shape,height,width,color,posX,posY,speedX,speedY,targetX,targetY,clickable,collision,static,selected){
	var newEntity = {
		'name':name,
		'shape':shape,
		'height':height,
		'width':width,
		'color':color,
		'posX':posX,
		'posY':posY,
		'speedX':speedX,
		'speedY':speedY,
		'targetX':targetX,
		'targetY':targetY,
		'clickable':clickable,
		'collision':collision,
		'static':static,
		'selected':selected,
	};
	entities.push(newEntity);
}
function log_info(info){
	console.log(info);
}
function mouseClickListener(target,action){
	target.addEventListener('mousedown',action,false);
}
function keyPressListener(action){

}
gamestate = new gamestate();
gamestate.start();
