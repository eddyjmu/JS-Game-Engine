var loopNumber=0, fps = 50, mouseClickX = 0, mouseClickY = 0, mousePosX = 0, mousePosY = 0, selected=null, oldSelected=null;
var entities = []; var events = []; var collisionEvents = []; var mouseEvents = []; var motionBehaviors = []; var collisionBoxes = [];
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
	this.clearstate = function(){
		gamespace.context.clearRect(0,0,gamespace.canvas.width,gamespace.canvas.height);
		clearStatuses();
	}
	this.updatestate = function(){
		checkCollisions();
		runMotionBehavior();
		emptyEventQueue();
		configureLoopNumber();
	};
	this.renderstate = function(){		
		drawEntities();
	};
	this.run = function(){
		//console.log('loop is running');
		gamestate.clearstate();
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
function configureLoopNumber(){
		if(loopNumber==1000){
			loopNumber=1;
		} else {
			loopNumber++;
		}
		//console.log(loopNumber);
}
function event(action){
	events.push(action);
}
function emptyEventQueue(){
	for(i=0;i<events.length;i++){
		events[i]();
	}
}
function runMotionBehavior(){
	for(i=0;i<motionBehaviors.length;i++){
		motionBehaviors[i]();
	}
}
function motionBehavior(behavior){
	motionBehaviors.push(behavior);
}
function drawEntities(){
	// set up entities with status colors and then check for them here.
	var ctx = gamespace.context;
	for(i=0;i<entities.length;i++){
		ctx.fillStyle = entities[i].color;
		var radius = entities[i].width/2;
		ctx.beginPath();
		ctx.arc(entities[i].posX,entities[i].posY,radius,0,2*Math.PI);
		ctx.fill();	
	}
}
function entity(name,type,height,width,color,posX,posY,speedX,speedY,targetX,targetY,status){
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
		'status':status
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
			console.log(entities[i].name+" '"+entities[i].type+"' "+"has been selected");
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
	// instantly at speed, slow to stop
	entities[entity].speedX = 2.5*(entities[entity].targetX - entities[entity].posX)/gamespace.canvas.width;
	entities[entity].speedY = 2.5*(entities[entity].targetY - entities[entity].posY)/gamespace.canvas.width;
}
function flightMode2(entity){
	// instantly at speed, stops on a dime
	diffX = entities[entity].targetX - entities[entity].posX;
	diffY = entities[entity].targetY - entities[entity].posY;
	if((Math.abs(diffX)<2)&&(Math.abs(diffY)<2)){
		entities[entity].speedX = 0;
		entities[entity].speedY = 0;
	} else {
		if(diffX>0){
			entities[entity].speedX = Math.cos(Math.atan(diffY/diffX));
			entities[entity].speedY = Math.sin(Math.atan(diffY/diffX));
		} else {
			entities[entity].speedX = -Math.cos(Math.atan(diffY/diffX));
			entities[entity].speedY = -Math.sin(Math.atan(diffY/diffX));
		}
	}
}
function flightMode3(entity){
	// instantly at speed, no stop
	diffX = entities[entity].targetX - entities[entity].posX;
	diffY = entities[entity].targetY - entities[entity].posY;
	if((Math.abs(diffX)<2)&&(Math.abs(diffY)<2)){
		entities[entity].speedX = 0;
		entities[entity].speedY = 0;
	} else {
		if(diffX>0){
			entities[entity].speedX = Math.cos(Math.atan(diffY/diffX));
			entities[entity].speedY = Math.sin(Math.atan(diffY/diffX));
		} else {
			entities[entity].speedX = -Math.cos(Math.atan(diffY/diffX));
			entities[entity].speedY = -Math.sin(Math.atan(diffY/diffX));
		}
	}
	entities[entity].targetX += diffX;
	entities[entity].targetY += diffY;
}
/*function flightMode4(maxSpeed,entity){
	// accelerate to speed, slow to stop
	diffX = entities[entity].targetX - entities[entity].posX;
	diffY = entities[entity].targetY - entities[entity].posY;
	if((Math.abs(diffX)<2)&&(Math.abs(diffY)<2)){
		entities[entity].speedX = 0;
		entities[entity].speedY = 0;
	} else {
		if(diffX>0){
			entities[entity].speedX = Math.cos(Math.atan(diffY/diffX));
			entities[entity].speedY = Math.sin(Math.atan(diffY/diffX));
		} else {
			entities[entity].speedX = -Math.cos(Math.atan(diffY/diffX));
			entities[entity].speedY = -Math.sin(Math.atan(diffY/diffX));
		}
	}
}*/
function removeEntity(entity){
	entities.splice(entity,1);
}
function overlap(entity1,entity2){
	try {
		if(entities[entity1].type==entities[entity2].type){
			return false;
		}
		radius1 = entities[entity1].width/2;
		radius2 = entities[entity2].width/2;
		distance = findDistance(entity1,entity2);
		if(distance<=(radius1+radius2)){
			//console.log(entities[entity1].name+" is overlapping "+entities[entity2].name);
			return true;
		} else {
			return false;
		}
	} catch(e) {
		//console.log(e.message);
	}
}
function checkCollisions(){
	for(n=0;n<collisionEvents.length;n++){
		for(i=0;i<entities.length;i++){
			for(j=0;j<entities.length;j++){
				if(overlap(i,j)){
					collisionEvents[n](i,j);
				}
			}
		}
	}
}
function collisionEvent(event){
	collisionEvents.push(event);
}
function clearStatuses(){
	for(i=0;i<entities.length;i++){
		entities[i].status=null;
	}
}
function findDistance(i,j){
	return Math.sqrt(Math.pow(entities[i].posX-entities[j].posX,2)+Math.pow(entities[i].posY-entities[j].posY,2));
}
function timedEvent(timeframe,event){
	if(loopNumber%(timeframe)==0){
		event();
	}
}
function randomLocatonOnMap(){
	return Math.floor((Math.random()*gamespace.canvas.width)+1);
}
gamestate = new gamestate();
gamestate.start();
