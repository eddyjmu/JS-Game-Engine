<canvas id="gamespace" style="background-color:rgba(66,147,92,1)"></canvas>
<script type="text/javascript" src="engine.js"></script>
<script>
	// mass, momentum, velocity, collision test
	// aka a game of pool
	maxSpeed = 10;
	friction = 0.1;
	gravity = 0.5
	//new mouseListener();
	new keyListener();
	new gravityComponent(0.5);
	new motionBehavior(function(entity){
			speedMag = pythagoreanC(entity.speeds.x,entity.speeds.y);
			entity.speeds.x = entity.speeds.x - friction*entity.speeds.x;
			entity.positions.x += entity.speeds.x;
			entity.positions.y += entity.speeds.y;
	});
	tableColor="rgba(66,147,92,1)";
	new entity('bg','bg','http://vignette4.wikia.nocookie.net/gravityfalls/images/d/dc/Gravity_falls_forest.jpg/revision/latest?cb=20131229093003',0,{'x':1000,'y':600},{'x':400,'y':300},{'x':0,'y':0},{},false);
	new entity('player1','character','patrick_right.png',1.25,{'x':125,'y':199},{'x':200,'y':250},{'x':0,'y':0},{},true);
	new entity('computer','character','http://vignette4.wikia.nocookie.net/animaniacs/images/e/ec/Dot_.png/revision/latest?cb=20140212150817',1,{'x':100,'y':200},{'x':600,'y':250},{'x':0,'y':0},{},true);	
	new entity('floor','floor','clear.png',1,{'x':800,'y':50},{'x':400,'y':500},{'x':0,'y':0},{},false);
	new entity('wallleft','wall','clear.png',1,{'x':50,'y':600},{'x':0,'y':300},{'x':0,'y':0},{},false);
	new entity('wallright','wall','clear.png',1,{'x':50,'y':600},{'x':800,'y':300},{'x':0,'y':0},{},false);
	new entity('ceiling','floor','clear.png',1,{'x':800,'y':50},{'x':400,'y':0},{'x':0,'y':0},{},false);
	/*new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='ball')&&(entities[entity2].type=='ball')){
			bounce(entity1,entity2,1);				
		}
	});*/
	new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='character')&&(entities[entity2].type=='wall')){
			simpleBounceWall(entity1,entity2,0);
		}
	});
	new collisionEvent(function(entity1,entity2){
		if((entities[entity1].type=='character')&&(entities[entity2].type=='floor')){
			simpleBounceFloor(entity1,entity2,0);
		}
	});
	new event(function(entity){
		if(entity.name=='player1'){
			if(entity.speeds.x>=0){
				if(entity.positions.y<450){
					changeImage(entity,'patrick_jump_right.png');
				} else {
					changeImage(entity,'patrick_right.png');
				}
			} else {
				if(entity.positions.y<450){
					changeImage(entity,'patrick_jump_left.png');
				} else {
					changeImage(entity,'patrick_left.png');
				}
			}
		}
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
		if((key=='32')||(key=='38')){
			entities[1].speeds.y = -15;
		}
	});
	new keyEvent(function(key){
		if(key=='40'){
			entities[1].speeds.y = 15;
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
