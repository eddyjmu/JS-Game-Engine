var fps = 50, mouseClickX = 0, mouseClickY = 0, mousePosX = 0, mousePosY = 0, selected=null, oldSelected=null;
var entities = []; var events = []; var collisionEvents = []; var mouseEvents = []; var motionBehaviors = [];
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
		checkCollisions();
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
function entity(name,type,height,width,color,posX,posY,speedX,speedY,targetX,targetY){
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
function flightMode1(entity){
	entity.speedX = 2.5*(entity.targetX - entity.posX)/gamespace.canvas.width;
	entity.speedY = 2.5*(entity.targetY - entity.posY)/gamespace.canvas.width;
}
function flightMode2(entity){
	diffX = entity.targetX - entity.posX;
	diffY = entity.targetY - entity.posY;
	entity.speedX = -Math.cos(Math.atan(diffY/diffX));
	entity.speedY = -Math.sin(Math.atan(diffY/diffX));
}
function overlap(entity1,entity2){
	//console.log('working');
	if(entity1.type==entity2.type){
		return false;
	}
	radius1 = entity1.width/2;
	radius2 = entity2.width/2;
	distance = Math.sqrt(Math.pow(entity1.posX-entity2.posX,2)+Math.pow(entity1.posY-entity2.posY,2));
	if(distance<=radius1+radius2){
		return true;
	} else {
		return false;
	}
}
function checkCollisions(){
	for(i=0;i<entities.length;i++){
		for(j=0;j<entities.length;j++){
			if(overlap(entities[i],entities[j])){
				for(n=0;n<collisionEvents.length;n++){
					collisionEvents[n](entities[i],entities[j]);
				}
			}
		}
	}
}
function collisionEvent(event){
	collisionEvents.push(event);
}
gamestate = new gamestate();
gamestate.start();




// this is where the game engine ends and the components that make up the game are added.
var playableColor = 'rgba(0,110,110,1)';
var playableHighlighted = 'rgba(0,150,150,1)';
var playableDark = 'rgba(0,70,70,1)';
var cloudColor = 'rgba(130,130,130,0.5)';
var enemyColor = 'rgba(140,0,50,1)';
new mouseListener();
new entity('playable1','pc',50,50,playableColor,400,400,0,0,400,400);
new entity('playable2','pc',50,50,playableColor,350,350,0,0,350,350);
new entity('enemy1','npc',50,50,enemyColor,100,100,0,0,100,100);
new entity('enemy2','npc',50,50,enemyColor,150,150,0,0,150,150);
new entity('cloud','env',100,100,cloudColor,250,250,0,0,250,250);
new entity('cloud','env',100,100,cloudColor,200,300,0,0,200,300);
new entity('cloud','env',100,100,cloudColor,300,200,0,0,300,200);
new motionBehavior(function(){
	for(i=0;i<entities.length;i++){
		if((entities[i].type=='pc')||(entities[i].type=='npc')){
			flightMode1(entities[i]);
		} else if(entities[i].type=='mun') {
			flightMode2(entities[i]);
		}
		entities[i].posX += entities[i].speedX;
		entities[i].posY += entities[i].speedY;
	}
});
new collisionEvent(function(entity1,entity2){
	if((entity1.type=='npc')&&(entity2.type=='mun')){
		console.log('boom');
	}
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
	// selection events
	if(oldSelected!=null){
		if(entities[oldSelected].type=='pc'){
			if(selected==null){
				// case where selecting nullspace
				entities[oldSelected].color = playableColor;
				entities[oldSelected].targetX = mouseClickX;
				entities[oldSelected].targetY = mouseClickY;
			} else {
				if(entities[selected].type=='env'){
					// case where selecting 'env'
					entities[oldSelected].color = playableColor;
					entities[oldSelected].targetX = mouseClickX;
					entities[oldSelected].targetY = mouseClickY;
				} else if(entities[selected].type=='pc'){
					// case where selecting another 'pc'
					if(selected!=oldSelected){
						entities[oldSelected].color = playableColor;
					}
				} else if(entities[selected].type=='npc'){
					// case where selecting 'npc'
					new entity('cannonfire','mun',10,10,'yellow',entities[oldSelected].posX,entities[oldSelected].posY,0,0,entities[selected].posX,entities[selected].posY);
					selected=oldSelected;
				}
			}
		}
	}
});
