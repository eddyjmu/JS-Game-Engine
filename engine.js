var loopNumber=0, fps = 50, mouseClickX = 0, mouseClickY = 0, mousePosX = 0, mousePosY = 0, gravity=0;
var entities = []; var events = []; var collisionEvents = []; var mouseEvents = []; var keyEvents = []; var motionBehaviors = []; var selectedEntities = [];
function gamespace(){
	this.canvas = document.getElementById('gamespace');
	this.initialize = function(){
		this.canvas.width = 800;
		this.canvas.height = 600;
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
		entity = entities[i];
		ctx.drawImage(entity.image,entity.positions.x-(entity.dimensions.x/2), entity.positions.y-(entity.dimensions.y/2), entity.dimensions.x, entity.dimensions.y);
	}
}
function entity(name,type,imagesrc,mass,dimensionsArray,positionArray,speedArray,statusArray,gravity){
	image = new Image();
	image.src = imagesrc;
	var newEntity = {
		'name':name,
		'type':type,
		'image':image,
		'mass':mass,
		'dimensions':dimensionsArray,
		'positions':positionArray,
		'speeds':speedArray,
		'statuses':statusArray,
		'gravity':gravity,
	};
	entities.push(newEntity);
}
function log_info(info){
	console.log(info);
}
function whatIsSelected(){
	for(i=0;i<entities.length;i++){
		if(mouseClickX<(entities[i].positions.x+(entities[i].dimensions.x/2))){
			if(mouseClickY<(entities[i].positions.y+(entities[i].dimensions.y/2))){
				if(mouseClickX>(entities[i].positions.x-(entities[i].dimensions.x/2))){
					if(mouseClickY>(entities[i].positions.y-(entities[i].dimensions.y/2))){
						console.log(entities[i].name+" '"+entities[i].type+"' "+"has been selected");
						return i;
					}
				}
			}	
		}
	}
	console.log('nothing selected');
	return null;/*
				
		
		
		return false
		entity = entities[i];
		var radius = entity.dimensions.x/2;
		var mouseClickDistance = Math.sqrt(Math.pow(mouseClickX-entity.positions.x,2)+Math.pow(mouseClickY-entity.positions.y,2));
		if((mouseClickDistance<radius)){
			console.log(entity.name+" '"+entity.type+"' "+"has been selected");
			return i;
		}
	}
	console.log('nothing selected');
	return null;*/
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
		for(i=0;i<mouseEvents.length;i++){
			mouseEvents[i](whatIsSelected());
		}
	},false);
	/*gamespace.canvas.addEventListener('mousemove',function(e){
		mousePosX = e.x;
		mousePosY = e.x;
		mousePosX -= gamespace.canvas.offsetLeft;
		mousePosY -= gamespace.canvas.offsetTop;
	});*/
}
function keyEvent(event){
	keyEvents.push(event);
}
function keyListener(){
	document.addEventListener('keydown',function(e){
		//if(e.which==null){
			//key = String.fromCharCode(e.keyCode);
			key = e.keyCode;
		/*} else if((e.which!=0)&&(e.charCode!=0)) {
			//key = String.fromCharCode(e.which);
			key = e.which;
		} else {
			key = null;
		}*/
		//console.log(key);
		for(i=0;i<keyEvents.length;i++){
			keyEvents[i](key);
		}
	},false);
}
/*function flightMode1(entity){
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
function bounce(entity1,entity2,restitution){
	// working - FUZZY BOUNCE
	xDistance = entities[entity2].positions.x - entities[entity1].positions.x;
	yDistance = entities[entity2].positions.y - entities[entity1].positions.y;
	angle = Math.tan(xDistance/yDistance);
	totalSpeedX = entities[entity1].speeds.x + entities[entity2].speeds.x;
	totalSpeedY = entities[entity1].speeds.y + entities[entity2].speeds.y;
	totalMass = entities[entity1].mass + entities[entity2].mass;
	entities[entity1].speeds.x = entities[entity1].speeds.x - (entities[entity1].mass/totalMass)*totalSpeedX;
	entities[entity1].speeds.y = entities[entity1].speeds.y - (entities[entity1].mass/totalMass)*totalSpeedY;
	entities[entity2].speeds.x = entities[entity2].speeds.x + (entities[entity2].mass/totalMass)*totalSpeedX;
	entities[entity2].speeds.y = entities[entity2].speeds.y + (entities[entity2].mass/totalMass)*totalSpeedY;
}
function simpleBounceWall(i,j,res){
	if(entities[i].positions.x<entities[j].positions.x){
		entities[i].positions.x = entities[j].positions.x - (entities[j].dimensions.x/2);
	} else {		
		entities[i].positions.x = entities[j].positions.x + (entities[j].dimensions.x/2);
	}
	entities[i].speeds.x = - res*entities[i].speeds.x;
}
function simpleBounceFloor(i,j,res){
	if(entities[i].positions.y<entities[j].positions.y){
		entities[i].positions.y = entities[j].positions.y - (entities[j].dimensions.y/2);
	} else {		
		entities[i].positions.y = entities[j].positions.y + (entities[j].dimensions.y/2);
	}
	entities[i].speeds.y = - res*entities[i].speeds.y;
}
/*function hasStatus(entity,status){
	flag=false;
	//find if status is null
	for(i=0;i<entity.statuses.length;i++){
		if(entity.statuses[i]==status){
			return true;
		}
	}
	return false;
}*/
function gravityComponent(amount){
	events.push(function(){
		for(i=0;i<entities.length;i++){
			if(entities[i].gravity==true){
				entities[i].speeds.y = amount + entities[i].speeds.y;
			}
		}
	});
	
}
function removeEntity(entity){
	entities.splice(entity,1);
}
function overlap(entity1,entity2){
	margin = 0.15;
	try {
		if(entity1==entity2){
			return false;
		}
		if(entities[entity1].positions.x<(entities[entity2].positions.x+(entities[entity2].dimensions.x/2))){
			if(entities[entity1].positions.y<(entities[entity2].positions.y+(entities[entity2].dimensions.y/2))){
				if(entities[entity1].positions.x>(entities[entity2].positions.x-(entities[entity2].dimensions.x/2))){
					if(entities[entity1].positions.y>(entities[entity2].positions.y-(entities[entity2].dimensions.y/2))){
						//console.log(entities[entity1].name+" is overlapping "+entities[entity2].name);
						return true;
					}
				}
			}	
		}
		return false
		/*





		radius1 = entities[entity1].dimensions.x/2;
		radius2 = entities[entity2].dimensions.x/2;
		distance = findDistance(entity1,entity2);
		if(distance<=(radius1+radius2-(margin*(radius1+radius2)))){
			console.log(entities[entity1].name+" is overlapping "+entities[entity2].name);
			return true;
		} else {
			return false;
		}*/
	} catch(e) {
		//console.log(e.message);
	}
}
function checkCollisions(){	
	for(i=0;i<entities.length;i++){
		for(j=0;j<entities.length;j++){
			for(n=0;n<collisionEvents.length;n++){
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
		entities[i].statuses=null;
	}
}
function findDistance(i,j){
	return Math.sqrt(Math.pow(entities[i].positions.x-entities[j].positions.x,2)+Math.pow(entities[i].positions.y-entities[j].positions.y,2));
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
