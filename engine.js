var fps = 50, mouseClickX = 0, mouseClickY = 0, mousePosX = 0, mousePosY = 0, selected=null, oldSelected=null;
var entities = []; var events = []; var mouseEvents = []; var motionBehaviors = [];
function gamespace(){
	this.canvas = document.getElementById('gamespace');
	this.initialize = function(){
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas,document.body.childNodes[0]);
	};
}
function gamestate(){
	this.updatestate = function(){
		runmotionBehavior();
		emptyEventQueue();
	};
	this.renderstate = function(){
		gamespace.context.clearRect(0,0,gamespace.canvas.width,gamespace.canvas.height);
		drawEntities();
	};
	this.run = function(){
		//console.log('loop is running');
		gamestate.updatestate();
		gamestate.renderstate();
	};
	this.start = function(){
		gamespace = new gamespace();
		gamespace.initialize();
		this.interval = setInterval(this.run,1000/fps);	
	};
	this.stop = function(){
		clearInterval(this.interval);
	};
}
function event(action){
	events.push(action);
}
function emptyEventQueue(){
	for(i=0;i<events.length;i++){
		events[i]();
	}
}
function runmotionBehavior(){
	for(i=0;i<motionBehaviors.length;i++){
		motionBehaviors[i]();
	}
}
function motionBehavior(behavior){
	motionBehaviors.push(behavior);
}
function drawEntities(){
	var ctx = gamespace.context;
	for(i=0;i<entities.length;i++){
		ctx.fillStyle = entities[i].color;
		var radius = entities[i].width/2;
		ctx.beginPath();
		ctx.arc(entities[i].posX,entities[i].posY,radius,0,2*Math.PI);
		ctx.fill();	
	}
}
function entity(name,type,height,width,color,posX,posY,speedX,speedY,targetX,targetY,collision){
	var newEntity = {
		'name':name,
		'type':type,
		'height':height,
		'width':width,
		'color':color,
		'posX':posX,
		'posY':posY,
		'speedX':speedX,
		'speedY':speedY,
		'targetX':targetX,
		'targetY':targetY,
		'collision':collision,
	};
	entities.push(newEntity);
}
function log_info(info){
	console.log(info);
}
function whatIsSelected(){
	for(i=0;i<entities.length;i++){
		var radius = entities[i].width/2;
		var mouseClickDistance = Math.sqrt(Math.pow(mouseClickX-entities[i].posX,2)+Math.pow(mouseClickY-entities[i].posY,2));
		if((mouseClickDistance<radius)){
			console.log(entities[i].name+" has been selected");
			return i;
		}
	}
	console.log('nothing selected');
	return null;
}
function mouseEvent(event){
	mouseEvents.push(event);
}
function mouseListener(){
	gamespace.canvas.addEventListener('mousedown',function(e){
		mouseClickX = e.x;
		mouseClickY = e.y;
		mouseClickX -= gamespace.canvas.offsetLeft;
		mouseClickY -= gamespace.canvas.offsetTop;
		//console.log(mouseClickX+','+mouseClickY);
		oldSelected = selected;
		selected = whatIsSelected();
		for(i=0;i<mouseEvents.length;i++){
			mouseEvents[i]();
		}
	},false);
	/*gamespace.canvas.addEventListener('mousemove',function(e){
		mousePosX = e.x;
		mousePosY = e.x;
		mousePosX -= gamespace.canvas.offsetLeft;
		mousePosY -= gamespace.canvas.offsetTop;
	});*/
}
function keyPressListener(action){

}
gamestate = new gamestate();
gamestate.start();




// this is where the game engine ends and the components that make up the game are added.
var playableColor = 'rgba(0,110,110,1)';
var playableHighlighted = 'rgba(0,150,150,1)';
var cloudColor = 'rgba(130,130,130,0.5)';
var enemyColor = 'rgba(140,0,50,1)';
new mouseListener();
new entity('playable1','pc',50,50,playableColor,400,400,0,0,400,400,true);
new entity('playable2','pc',50,50,playableColor,350,350,0,0,350,350,true);
new entity('enemy1','npc',50,50,enemyColor,100,100,0,0,100,100,true);
new entity('enemy2','npc',50,50,enemyColor,150,150,0,0,150,150,true);
new entity('cloud','env',100,100,cloudColor,250,250,0,0,250,250,true);
new entity('cloud','env',100,100,cloudColor,200,300,0,0,200,300,true);
new entity('cloud','env',100,100,cloudColor,300,200,0,0,300,200,true);
function hurryUpAndWait(){
	for(i=0;i<entities.length;i++){
		//if((entities[i].type=='pc')||(entities[i].type=='npc')){
			entities[i].speedX = 2.5*(entities[i].targetX - entities[i].posX)/gamespace.canvas.width;
			entities[i].speedY = 2.5*(entities[i].targetY - entities[i].posY)/gamespace.canvas.height;
		//} else {

		//}
		entities[i].posX += entities[i].speedX;
		entities[i].posY += entities[i].speedY;
	}
}
/*function slowAndSteady(){
	roomForError = 2;
	for(i=0;i<entities.length;i++){

		if((entities[i].posX-entities[i].targetX)>roomForError){
			entities[i].speedX = 0;
		} else {
			entities[i].speedX = 0;
		}
		if((entities[i].posY-entities[i].targetY)>roomForError){
			entities[i].speedY = 0;
		} else {
			entities[i].speedY = 0;
		}
		entities[i].posX += entities[i].speedX;
		entities[i].posY += entities[i].speedY;
	}
}*/
new motionBehavior(function(){
	hurryUpAndWait();
});
new mouseEvent(function(){
	// case where selecting 'pc' entity for the first time
	if(selected!=null){
		if((selected!=oldSelected)&&(entities[selected].type=='pc')){		
			entities[selected].color=playableHighlighted;
		}
	}
});
new mouseEvent(function(){
	// case where selecting nullspace or another entity after selecting 'pc' entity
	if(oldSelected!=null){
		if(entities[oldSelected].type=='pc'){
			if((selected==null)||(entities[selected].type=='env')){
				entities[oldSelected].color = playableColor;
				entities[oldSelected].targetX = mouseClickX;
				entities[oldSelected].targetY = mouseClickY;
			} else if(entities[selected].type=='npc'){
				// here there be weapon fire
				new entity('cannonfire','env',10,10,'yellow',entities[oldSelected].posX,entities[oldSelected].posY,0,0,entities[selected].posX,entities[selected].posY,true);
				selected=oldSelected;
			}
		}
	}
});
