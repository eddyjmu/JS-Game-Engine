<canvas id="gamespace" style="background-color:rgba(66,147,92,1)"></canvas>
<script type="text/javascript" src="engine.js"></script>
<script>
	// mass, momentum, velocity, collision test
	// aka a game of pool
	maxSpeed = 10;
	friction = 0.01;
	new mouseListener();
	new gravityComponent(0.05);
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
			entities[i].speeds.y = entities[i].speeds.y - friction*entities[i].speeds.y;
			entities[i].positions.x += entities[i].speeds.x;
			entities[i].positions.y += entities[i].speeds.y;
			//speedMag = Math.sqrt(Math.pow(entities[i].speeds.x,2)+Math.pow(entities[i].speeds.y,2));
			//console.log(speedMag);
		}
	});
	tableColor="rgba(66,147,92,1)";
	new entity('cueball','ball','circle.png',1.25,{'x':50,'y':50},{'x':250,'y':250},{'x':0,'y':0},{},true);	
	new entity('otherball','ball','circle.png',1,{'x':50,'y':50},{'x':300,'y':250},{'x':0,'y':0},{},true);	
	new entity('floor','floor','black.png',1,{'x':500,'y':50},{'x':250,'y':500},{'x':0,'y':0},{},false);
	new entity('wallleft','wall','black.png',1,{'x':50,'y':500},{'x':0,'y':250},{'x':0,'y':0},{},false);
	new entity('wallright','wall','black.png',1,{'x':50,'y':500},{'x':500,'y':250},{'x':0,'y':0},{},false);
	new entity('ceiling','floor','black.png',1,{'x':500,'y':50},{'x':250,'y':0},{'x':0,'y':0},{},false);
	new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='ball')&&(entities[entity2].type=='ball')){
			bounce(entity1,entity2,1);				
		}
	});
	new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='ball')&&(entities[entity2].type=='wall')){
			simpleBounceWall(entity1,0.75);
		}
	});
	new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='ball')&&(entities[entity2].type=='floor')){
			simpleBounceFloor(entity1,0.75);
		}
	});
	new event(function(){
		//console.log(findDistance(0,1));
	});
	new mouseEvent(function(selected){
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
	});
</script>
