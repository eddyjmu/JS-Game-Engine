<canvas id="gamespace" style="background-color:rgba(66,147,92,1)"></canvas>
<script type="text/javascript" src="engine.js"></script>
<script>
	// mass, momentum, velocity, collision test
	// aka a game of pool
	maxSpeed = 10;
	friction = 0.1;
	new mouseListener();
	new keyListener();
	new gravityComponent(0.5);
	new motionBehavior(function(){
		for(i=0;i<entities.length;i++){
			/*if(entities[i].type=="ball"){
				flightMode1(i);
			}*/
			speedMag = Math.sqrt(Math.pow(entities[i].speeds.x,2)+Math.pow(entities[i].speeds.y,2));
			/*if(speedMag<0.1){
				friction=friction*2;
			}*/
			entities[i].speeds.x = entities[i].speeds.x - friction*entities[i].speeds.x;
			//entities[i].speeds.y = entities[i].speeds.y - friction*entities[i].speeds.y;
			entities[i].positions.x += entities[i].speeds.x;
			entities[i].positions.y += entities[i].speeds.y;
			//speedMag = Math.sqrt(Math.pow(entities[i].speeds.x,2)+Math.pow(entities[i].speeds.y,2));
			//console.log(speedMag);
		}
	});
	tableColor="rgba(66,147,92,1)";
	new entity('bg','bg','http://vignette4.wikia.nocookie.net/gravityfalls/images/d/dc/Gravity_falls_forest.jpg/revision/latest?cb=20131229093003',0,{'x':800,'y':600},{'x':400,'y':300},{'x':0,'y':0},{},false);
	new entity('cueball','ball','http://img11.deviantart.net/db33/i/2015/186/0/f/patrick_star_season_1_by_megarainbowdash2000-d9015sk.png',1.25,{'x':125,'y':200},{'x':250,'y':250},{'x':0,'y':0},{},true);	
	//new entity('otherball','ball','circle.png',1,{'x':50,'y':50},{'x':300,'y':250},{'x':0,'y':0},{},true);	
	new entity('floor','floor','clear.png',1,{'x':800,'y':50},{'x':400,'y':500},{'x':0,'y':0},{},false);
	new entity('wallleft','wall','clear.png',1,{'x':50,'y':600},{'x':0,'y':300},{'x':0,'y':0},{},false);
	new entity('wallright','wall','clear.png',1,{'x':50,'y':600},{'x':800,'y':300},{'x':0,'y':0},{},false);
	new entity('ceiling','floor','clear.png',1,{'x':800,'y':50},{'x':400,'y':0},{'x':0,'y':0},{},false);
	new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='ball')&&(entities[entity2].type=='ball')){
			bounce(entity1,entity2,1);				
		}
	});
	new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='ball')&&(entities[entity2].type=='wall')){
			simpleBounceWall(entity1,entity2,0);
		}
	});
	new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='ball')&&(entities[entity2].type=='floor')){
			simpleBounceFloor(entity1,entity2,0);
		}
	});
	new event(function(){
		//console.log(findDistance(0,1));
	});
	/*new mouseEvent(function(selected){
		//selectedEntities.push(selected);
		distance = Math.sqrt(Math.pow(mouseClickX-entities[0].positions.x,2)+Math.pow(mouseClickY-entities[0].positions.y,2));
		//console.log(distance);
		distanceMag = distance/gamespace.canvas.width;
		//xDirection = (mouseClickX-entities[0].positions.x)/Math.abs(mouseClickX-entities[0].positions.x);
		//yDirection = (mouseClickY-entities[0].positions.y)/Math.abs(mouseClickY-entities[0].positions.y);
		if((mouseClickX-entities[0].positions.x)>0){
			xDirection = -Math.cos(Math.atan((mouseClickY-entities[0].positions.y)/(mouseClickX-entities[0].positions.x)));
			yDirection = -Math.sin(Math.atan((mouseClickY-entities[0].positions.y)/(mouseClickX-entities[0].positions.x)));
		} else {
			xDirection = Math.cos(Math.atan((mouseClickY-entities[0].positions.y)/(mouseClickX-entities[0].positions.x)));
			yDirection = Math.sin(Math.atan((mouseClickY-entities[0].positions.y)/(mouseClickX-entities[0].positions.x)));
		}
		//console.log(xDirection+","+yDirection);
		entities[0].speeds.x = xDirection*maxSpeed*distanceMag;
		entities[0].speeds.y = yDirection*maxSpeed*distanceMag;
	});*/
	new keyEvent(function(key){
		// problem here with the jump not always being completed due to no stashing of events
		console.log(key);
		if(key=='32'){
			entities[1].speeds.y = -15;
		}
	});
	new keyEvent(function(key){
		if(key=='39'){
			entities[1].speeds.x = 10;
		}
	});
	new keyEvent(function(key){
		if(key=='37'){
			entities[1].speeds.x = -10;
		}
	});
</script>
