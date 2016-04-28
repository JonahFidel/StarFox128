//Mike Dunnegan and Jonah Fidel 
//4/21/16
//starFox 64

//should we make it so that pause pauses the spaceship too? 

//as of right now this will only run properly in Safari. 
var hex = 0xff0000; 
var bbox;
var track = 0;
var endgame; 
var scene; 
var mesh1; 
var scoreMesh; 
var livesMesh;  
var score = 0; 
var camera; 
var vertCount;
//var vertCount; 
var lives = 3; 
var loader = new THREE.JSONLoader();
var clock = new THREE.Clock(); 
//var startPos = -100; 
var activeObstacles = [];

var arrowList = [];
var directionList = [];
var activeObstacles = []; 

var ship; 

var first = 1;

//console.log(activeObstacles); 

// var obstacle; 
// var obstacle2; 

var collisionDetector = function(){
		activeObstacles = this.activeObstacles; 
		// var originPoint = this.ship.position;

		// vertCount = getShipVertices(); 
		// console.log(vertCount); 


		//console.log(ship); 
		
	 //    vertCount = ship.geometry.vertices.length; 

		// console.log(vertCount + 'v'); 

		//getShipVerticies();

		//console.log(ship.position);

		//console.log(ship.position.geometry); 

		//console.log(ship); 
		//var vertexIndex; 

		// for (vertexIndex = 0; vertexIndex < vertCount; vertexIndex++)
		// 	{       
		// 		console.log(vertCount); 

		// 	    // var localVertex = ship.geometry.vertices[vertexIndex].clone();
		// 	    // var globalVertex = ship.matrix.multiplyVector3(localVertex);
		// 	    // var directionVector = globalVertex.subSelf(ship.position);

		// 	    // var ray = new THREE.Ray( ship.position, directionVector.clone().normalize() );
		// 	    // var collisionResults = ray.intersectObjects(activeObstacles);
		// 	    // if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
		// 	    // {
			        
		// 	    	//something
			

		// 		console.log("I'm doing something here"); 
		// 	    // }
}






// acts as a main function
var game = function(){

	var renderer; 
	var terrainGenerator;
	var collosionDetector; 
	var backgroundMesh; 
	var pause = 0;
	var canvas1;  
	var context1;
	var material1; 
	var texture1; 
	var context2; 
	var canvas2; 
	var material2; 
	var texture2; 


	var draw = function(){

		requestAnimationFrame(draw);

		renderer.render(scene, camera);

		handleInput();
		// loop draw function call
		updateCameraAndShipPositionOnZAxis();

		terrainGenerator.generateNextTileIfNeeded(camera.position.z, scene);

		//collDetector(activeObstacles); 

	};

	//handle pause input on keydown 'p'
	document.addEventListener("keydown", function(k){
		var press = k.which || k.keyCode; 

		if (press === 80 && pause == 0) {
			pause = 1;  
			pauseFunc();
		
		}
		else if (press === 80 && pause != 0) {

			 pause = 0;  
			// //text2 = document.createElement('div');
			// document.body.removeChild(text2); 

		}
	}); 


	var createScene = function(){
		//Scene
		scene = new THREE.Scene();
		//ship = new initializeSpaceship(); 
	
		var WIDTH = 960, HEIGHT = 540;

		var VIEW_ANGLE = 70,
		    ASPECT = WIDTH / HEIGHT,
		    NEAR = 0.1,
		    FAR = 10000;

		//Renderer
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(WIDTH, HEIGHT);
		var c = document.getElementById("gameCanvas");
		c.appendChild(renderer.domElement);

		//trying to add a background 
		var texture = THREE.ImageUtils.loadTexture( 'textures/background7.jpg' );
		
		backgroundMesh = new THREE.Mesh(
		    new THREE.PlaneGeometry(20000, 20000, 20000),
		    new THREE.MeshBasicMaterial({
		        map: texture
		    }));

		scene.add(backgroundMesh); 
		backgroundMesh.position.z = -8000; 

		// CAMERA
		camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		scene.add(camera);
		camera.position.z = 30;
		camera.position.y = 20;

		console.log("this works"); 


		var camPos = camera.position.x;
		var camPosZ = camera.position.z; 
		console.log("camPos " + camPos);



		// LIGHT
		// number one -- start light? 
		var light = new THREE.DirectionalLight( 0xffffff );
	    light.position.set( 0, 1, 0).normalize();
	    scene.add(light);
	    //not sure why we need this light, shouldn't ambient light 
	    //up the whole scene?? 

	    //number two -- on the camera 
	     var secondLight = new THREE.DirectionalLight( 0xFF0000 );
	     camera.add(secondLight);

	     //number three -- ambient 
	     var thirdLight = new THREE.AmbientLight(0xaaaaaa);
         scene.add(thirdLight);


	    // TERRAIN GENERATOR
		terrainGenerator = new TerrainGenerator();
		terrainGenerator.generateInitialTiles(scene);

		// SPACESHIP
		// ship = new Spaceship();

		//ship.applyTexture();
		//ship.setInitialPosition();

		// console.log(ship);
		// scene.add(ship);

		// var shipGeom = ship.geometry; 
		// console.log(shipGeom); 
		//console.log(shipGeom.vertices.length); 


		//var bbox = new THREE.BoundingBoxHelper(ship, 0xff0000); 
		//scene.add(bbox.box); 
		//		console.log(bbox); 



		canvas1 = document.createElement('canvas');
		context1 = canvas1.getContext('2d');
		context1.font = "Bold 65px Arial";
		context1.fillStyle = "rgba(255,255,255,0.95)";
	    context1.fillText('Score: ' + score, 0, 50);
	    
		// canvas contents will be used for a texture
		 texture1 = new THREE.Texture(canvas1);
		 texture1.needsUpdate = true;
	      
	     material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
	     material1.transparent = true;

	    scoreMesh = new THREE.Mesh(
	        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
	        material1
	      );

		scoreMesh.position.set(-490, 300, -500);
		scene.add(scoreMesh);
		console.log("scoreMesh added");

				canvas2 = document.createElement('canvas');
		context2 = canvas2.getContext('2d');
		context2.font = "Bold 65px Arial";
		context2.fillStyle = "rgba(255,255,255,0.95)";
	    context2.fillText('Lives: ' + lives, 0, 50);
	    
		// canvas contents will be used for a texture
		 texture2 = new THREE.Texture(canvas2);
		 texture2.needsUpdate = true;
	      
	     material2 = new THREE.MeshBasicMaterial( {map: texture2, side:THREE.DoubleSide } );
	     material2.transparent = true;

	    livesMesh = new THREE.Mesh(
	        new THREE.PlaneGeometry(canvas2.width, canvas2.height),
	        material2
	      );

		livesMesh.position.set(-490, 240, -500);
		scene.add(livesMesh);
		console.log("livesMesh added");

	};

		var handleInput = function(){
			//console.log(activeObstacles);

			//activeObstacles.pop(); 
			// controls.update();
			// stats.update();

			//the && statement is a temporary fix for the fade-to-black 
			//functionality when the user leaves the field of view 
			if (Key.isDown(Key.A) && ship.position.x >= -75) {
				if (ship.position.x == -75){
					//while (ship.position.x == -40){
					//this should be replaced by a UI arrow event pointing the user back towards
					//the in-play area
					console.log("you've gone too far!!"); 
					//arrow = new Three.MeshNormalMaterial
						cameraPositionX = camera.position.x; 
						cameraPositionY = camera.position.y; 
						cameraPositionZ = camera.position.z; 
						canvas1 = document.createElement('canvas');
						context1 = canvas1.getContext('2d');
						context1.font = "Bold 40px Arial";
						context1.fillStyle = "rgba(255,0,0,0.95)";
					    context1.fillText('   >', 0, 50);
					    
						// canvas contents will be used for a texture
						 texture1 = new THREE.Texture(canvas1);
						 texture1.needsUpdate = true;
					      
					     material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
					     material1.transparent = true;

					    mesh1 = new THREE.Mesh(
					        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
					        material1
					      );
					    //console.log("hello"); 
						mesh1.position.set(cameraPositionX, cameraPositionY, cameraPositionZ - 200);
						scene.add(mesh1);
						//console.log("goodbye");
					//}
				}
				ship.position.x -= 1;
				ship.rotation.z += .01;
				// var pos = ship.position.x; 
				// console.log(pos);
				// make the camera move down too?
			}
			if (Key.isDown(Key.D) && ship.position.x <= 75) {
				if (ship.position.x == 75){
					//this should be replaced by a UI arrow event pointing the user back towards
					//the in-play area
					console.log("you've gone too far!!"); 
					cameraPositionX = camera.position.x; 
					cameraPositionY = camera.position.y; 
					cameraPositionZ = camera.position.z; 
					canvas1 = document.createElement('canvas');
					context1 = canvas1.getContext('2d');
					context1.font = "Bold 40px Arial";
					context1.fillStyle = "rgba(255,0,0,0.95)";
				    context1.fillText('<   ', 0, 50);
				    
					// canvas contents will be used for a texture
					 texture1 = new THREE.Texture(canvas1);
					 texture1.needsUpdate = true;
				      
				     material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
				     material1.transparent = true;

				    mesh1 = new THREE.Mesh(
				        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
				        material1
				      );
				    //console.log("hello"); 
					mesh1.position.set(cameraPositionX + 250, cameraPositionY, cameraPositionZ - 200);
					scene.add(mesh1);
					//console.log("goodbye");


				}
				ship.position.x += 1;
				ship.rotation.z -= .01;
			} 
			if (Key.isDown(Key.S) && ship.position.y >= -5) {
				if (ship.position.y == -5){
					//this should be replaced by a UI arrow event pointing the user back towards
					//the in-play area
					console.log("you've gone too far!!"); 
					//arrow = new Three.MeshNormalMaterial
					cameraPositionX = camera.position.x; 
					cameraPositionY = camera.position.y; 
					cameraPositionZ = camera.position.z; 
					canvas1 = document.createElement('canvas');
					context1 = canvas1.getContext('2d');
					context1.font = "Bold 70px Arial";
					context1.fillStyle = "rgba(255,0,0,0.95)";
				    context1.fillText('^', 0, 50);
				    
					// canvas contents will be used for a texture
					 texture1 = new THREE.Texture(canvas1);
					 texture1.needsUpdate = true;
				      
				     material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
				     material1.transparent = true;

				    mesh1 = new THREE.Mesh(
				        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
				        material1
				      );
				    //console.log("hello"); 
					mesh1.position.set(cameraPositionX + 130 , cameraPositionY +50 , cameraPositionZ - 200);
					scene.add(mesh1);
					//console.log("goodbye");
				}
				ship.position.y -= 1;
				ship.rotation.x -= .01;
		   	} 
		   	if (Key.isDown(Key.W) && ship.position.y <= 60) {
				if (ship.position.y == 60){
					//this should be replaced by a UI arrow event pointing the user back towards
					//the in-play area
					console.log("you've gone too far!!");
					cameraPositionX = camera.position.x; 
					cameraPositionY = camera.position.y; 
					cameraPositionZ = camera.position.z; 
					canvas1 = document.createElement('canvas');
					context1 = canvas1.getContext('2d');
					context1.font = "Bold 70px Arial";
					context1.fillStyle = "rgba(255,0,0,0.95)";
				    context1.fillText('v', 0, 50);
				    
					// canvas contents will be used for a texture
					 texture1 = new THREE.Texture(canvas1);
					 texture1.needsUpdate = true;
				      
				     material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
				     material1.transparent = true;

				    mesh1 = new THREE.Mesh(
				        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
				        material1
				      );
				    //console.log("hello"); 
					mesh1.position.set(cameraPositionX + 130 , cameraPositionY + 20 , cameraPositionZ - 200);
					scene.add(mesh1);
					//console.log("goodbye"); 
				}
				ship.position.y += 1;
				ship.rotation.x += .01;
				//var pos = ship.position.y; 
				//console.log(pos); 
				//console.log("hello"); 
			}
		}

	var initializeSpaceship = function(){
	
	loader.load( 'textures/spaceship.json', function (object2) {

		//console.log("ship before " + ship)
	
		var material = new THREE.MeshPhongMaterial({
			color:0xffffff, 
			map: THREE.ImageUtils.loadTexture('textures/metal.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture('textures/sandBumpMap.jpg'),
			bumpScale: 0.9
		});



		ship = new THREE.Mesh(object2, material);

		// demonstrates that it's not the ship that's making the game perform like ass
		//ship = new THREE.Mesh(new THREE.CubeGeometry(), new THREE.MeshNormalMaterial());

		ship.position.y = 36;
		ship.position.z = -100;
		ship.rotation.y =3.14;
		ship.rotation.x = .5;
		ship.scale.set(5,5,5);

		bbox = new THREE.BoundingBoxHelper(object2, hex);
		// console.log(bbox); 
		// console.log(bbox.geometry);  
		// console.log(bbox.geometry.vertices); 
		// console.log(bbox.geometry.vertices.length); 
		//bbox.update(); 
		 

		//THREE.computeBoundingBox(ship); 
		//camera.add(ship);
		//ship.add(camera);
		//scene.add(bbox);  
		
		//bbox.position.set(0, 36, -100); 
		//bbox.position.set(0, 36, -100);
		// console.log(bbox.position);
		//bbox = bbox.scale(2,2,2); 
		ship.add(bbox);  
		camera.add(ship);


		//console.log(bbox.position.x);

		draw(scene);
		//console.log(activeObstacles); 
	});

};


pauseFunc = function() {
	cameraPositionX = camera.position.x; 
	cameraPositionY = camera.position.y; 
	cameraPositionZ = camera.position.z; 
	canvas1 = document.createElement('canvas');
	context1 = canvas1.getContext('2d');
	context1.font = "Bold 40px Arial";
	context1.fillStyle = "rgba(255,255,255,0.95)";
    context1.fillText('Game Paused', 0, 50);
    
	// canvas contents will be used for a texture
	texture1 = new THREE.Texture(canvas1);
	texture1.needsUpdate = true;
      
    material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
    material1.transparent = true;

    mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
        material1
      );
    console.log("hello"); 
	mesh1.position.set(cameraPositionX, cameraPositionY, cameraPositionZ - 200);
	//scene.add(scoreMesh);
	scene.add(mesh1);
	console.log("goodbye");
}

	endGame = function(){
		console.log("There was a collision and you died lol")
		pause = 1; 
		//0 = 1; 
		//break; 
	}

	var updateCameraAndShipPositionOnZAxis = function(){
		//console.log(activeObstacles); 

		//implements pause functionality 
		score +=1; 
		scene.remove(scoreMesh); 
		scene.add(scoreMesh);
		//scene.add(ship); 
		if (pause == 0) {
			camera.position.z -= 1;
			//camera.rotation.y = 90;
			//ship.position.z = ship.position.z;
			backgroundMesh.position.z -= 1;
			scoreMesh.position.z -= 1; 
			livesMesh.position.z -= 1; 
			//bbox.position.z -= 1; 
			//livesMesh.position.z -= 1; 

			
			if (mesh1 != null && ship.position.x < 75 && ship.position.x > -75 && ship.position.y > -5 && ship.position.y < 60)
			{
				console.log("enter");
				scene.remove(mesh1); 
				mesh1 = null; 
			}
			else if (mesh1!= null){
				mesh1.position.z -= 1; 
			} 
			
			//console.log("this works too"); 
			scene.add(backgroundMesh); 
		}	
		else {
			return;
		}
	};

	(function main(){
		createScene();	
		initializeSpaceship();
		draw(scene);
		//collisionDetector();

		//console.log("helloal;ksjdfl"); 
	})();

};

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function ObstacleGenerator(){
	//this.activeObstacles = [];
	this.obstacleGeometries = [new THREE.CylinderGeometry( 0, 30, 100, 4, 4 ), new THREE.CylinderGeometry( 0, 45, 50, 3, 4 )];
	this.obstacleMaterials = [new THREE.MeshPhongMaterial({
						color:0xffffff, 
						map: THREE.ImageUtils.loadTexture( 'textures/pyramid2.jpg'),
						bumpMap: THREE.ImageUtils.loadTexture('textures/sandBumpMap.jpg'),
						bumpScale: 0.9
					}), 
					new THREE.MeshPhongMaterial({
						color:0xffffff, 
						map: THREE.ImageUtils.loadTexture( 'textures/pyramid.jpg'),
					}),
					new THREE.MeshPhongMaterial({
						color:0xffffff, 
						map: THREE.ImageUtils.loadTexture( 'textures/pyramid6.jpg'),
					})]; 

}

ObstacleGenerator.prototype = {
	constructor: ObstacleGenerator,

	generateObstacles: function(zCoordinateOfTile, scene){	 
		obstacle = new THREE.Mesh(this.obstacleGeometries[0], this.obstacleMaterials[track]);

		track++; 
		if (track > 2){
			track = 0; 
		}

		obstacle2 = new THREE.Mesh(this.obstacleGeometries[1], this.obstacleMaterials[track]); 
		//obstacle.position.x = // random between -400 and 0?

		obstacle.position.x = (Math.random() * 200) - 100;
		obstacle2.position.x = (Math.random() * 200) - 100;

		obstacle.position.y = 5;
		obstacle2.position.y = 5;

		obstacle.position.z = -zCoordinateOfTile;
		obstacle2.position.z = -zCoordinateOfTile + 50;


		activeObstacles.push(obstacle);
	    //activeObstacles.shift();

	    activeObstacles.push(obstacle2);
	    //activeObstacles.shift(); 

		scene.add(obstacle) 
		scene.add(obstacle2);
	}
}

function RingGenerator(){
	this.activeRings = [];
	this.ringGeometries = [new THREE.TorusGeometry( 10, 3, 100, 100)];
	this.ringMaterials = [new THREE.MeshNormalMaterial()]
}

RingGenerator.prototype = {
	constructor: RingGenerator , 

	generateRings: function (zCoordinateOfTile, scene){
		if (Math.random() > .2)
		{
			var ringMaterial = new THREE.MeshPhongMaterial(
			{
							color:0xffffff, 
							map: THREE.ImageUtils.loadTexture( 'textures/ice.jpg' ), 
							bumpMap: THREE.ImageUtils.loadTexture('textures/sandBumpMap.jpg'),
							bumpScale: 0.3
						});
		}
		else
		{
			var ringMaterial = new THREE.MeshPhongMaterial(
			{
							color:0xffffff, 
							map: THREE.ImageUtils.loadTexture( 'textures/fire.jpg' ), 
							bumpMap: THREE.ImageUtils.loadTexture('textures/sandBumpMap.jpg'),
							bumpScale: 0.3
						});
		}


		// 'i' will be an index for choosing objects
		var i = 0;
		var ring = new THREE.Mesh(this.ringGeometries[i], ringMaterial);
		//obstacle.position.x = // random between -400 and 0?

		ring.position.x = Math.random() *  65 - 30; 
		ring.position.y = Math.random() * 33 + 20;
		ring.position.z = -zCoordinateOfTile + 25;


		this.activeRings.push(ring);
	    this.activeRings.shift();

		scene.add(ring);
	}
}

function TerrainGenerator(){
	this.zRenderingPosition = 0;
	this.activeTerrain = [];
	this.sizeOfTerrain = 100;
	this.obstacleGenerator = new ObstacleGenerator();
	this.ringGenerator = new RingGenerator(); 

	this.terrainGeometry = new THREE.CubeGeometry(10, 10, 10);
	this.terrainMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('textures/sand.jpg') } );

	this.loader = new THREE.JSONLoader();

}

TerrainGenerator.prototype = {
	constructor: TerrainGenerator,

	getActiveTerrain: function(){
		return this.activeTerrain;
	},

	getObstacleGenerator: function(){
		return this.obstacleGenerator;
	},

	getRingGenerator : function(){
		return this.RingGenerator; 
	}, 

	generateInitialTiles: function(scene){
		//doesn't seem to affect performance, might as well leave it

		this.generateNextTile(scene);
		this.generateNextTile(scene);
		this.generateNextTile(scene);
		this.generateNextTile(scene);
		this.generateNextTile(scene);
		this.generateNextTile(scene);
		this.generateNextTile(scene);
		this.generateNextTile(scene);
	},

	generateNextTileIfNeeded: function(shipPosition, scene){
		//console.log(shipPosition); 

		if (this.nextTileNeeded(shipPosition)){
			this.generateNextTile(scene);
		}
	},

	nextTileNeeded: function(ZpositionOfShip){
		if (ZpositionOfShip % this.sizeOfTerrain == 0){
			return true;
		}
	},

	generateNextTile: function(scene, ship){
		//console.log("check1");
		//zpos = ship.position.z; 
		//console.log(zpos); 
		var START = -200;
		var END = 200;

	    for (var i = START; i <= END; i+=100){

	    	var AT = this.getActiveTerrain();
	    	var zPos = this.zRenderingPosition;

	  		this.loader.load(
				// resource URL
				'textures/ruggedTerrain3.json',

				// Function when resource is loaded
				function (geometry) {


					var material = new THREE.MeshPhongMaterial({
						color:0xffffff, 
						map: THREE.ImageUtils.loadTexture( 'textures/sand.jpg'),
						bumpMap: THREE.ImageUtils.loadTexture('textures/sandBumpMap.jpg'),
						bumpScale: 1.3
					});

					var object1 = new THREE.Mesh(geometry, material);

					object1.position.y = -150;
					object1.position.z = -zPos-400;
					object1.position.x = i-400; // i - a random number between 0 and 200
					object1.position.x = i - (Math.random() * 400) + 100;

					object1.scale.set(100,100,100);

					object1.rotation.y = (Math.floor(Math.random() * 4) + 1) * 90; 

					AT.push(object1);
					AT.shift();

					collisionDetector(); 
					
					scene.add(object1);
				}
			);
	    }
	    this.obstacleGenerator.generateObstacles(this.zRenderingPosition, scene, ship);
	    this.ringGenerator.generateRings(this.zRenderingPosition, scene);
		this.zRenderingPosition += 100;
	}
}


function Spaceship(){
	var model;
	this.loader = new THREE.JSONLoader(); 
}

Spaceship.prototype = {
	constructor: Spaceship,

	getModel: function(){
		return this.model;
	},

	getZPosition: function(){
		return this.model.position.z;
	},

	getXPosition: function(){
		return this.model.position.x;
	},

	getYPosition: function(){
		return this.model.position.y;
	},

	setInitialPosition: function(){
		this.model.position.z = 0;
    	this.model.position.y = 25;
	},
}

// function collDetector(obstacles) {
// 			//console.log(ship); 
// 			var delta = clock.getDelta(); // seconds.
// 			//console.log(delta);
			
// 			// var moveDistance = 200 * delta; // 200 pixels per second
// 			// var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
			
						
// 			// // collision detection:
// 			// //   determines if any of the rays from the cube's origin to each vertex
// 			// //		intersects any face of a mesh in the array of target meshes
// 			// //   for increased collision accuracy, add more vertices to the cube;
// 			// //		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
// 			// //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
// 			var originPoint = ship.position.clone();
// 			//console.log(originPoint); 
// 			//console.log(originPoint);

// 			// clearText();

// 			//var count2 = ship.geometry.vertices.length; 
// 			//console.log(count2 + 'v'); 

			
 			
// 			for (var vertexIndex = 0; vertexIndex < ship.geometry.vertices.length; vertexIndex++)
// 			{	
// 				//console.log(obstacles); 
// 				//activeObstacles = this.activeObstacles;	
// 				var localVertex = ship.geometry.vertices[vertexIndex].clone();
// 				var globalVertex = localVertex.applyMatrix4( ship.matrix );
// 				var directionVector = globalVertex.sub( ship.position );
// 				//console.log(directionVector); 
// 				//activeObstacles = []; 
// 				//var shipVert = ship.geometry.vertices.length; 
// 				//console.log(shipVert); 

// 				var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize(), 0.1, 500);
// 				var collisionResults = [];
// 				collisionResults.push(ray.intersectObjects(obstacles)); 
// 				//console.log(activeObstacles);
// 				if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){ 
// 				 	console.log("collision detected");
// 				 	pauseFunc(); 
// 				 	return; 
// 				 }
// 				 //collisionResults.pop(); 
// 				 // activeObstacles.push(this.activeObstacles); 
// 				//console.log(count2);
// 				console.log(directionVector);
// 	}
// 	for (var item = 0; item < activeObstacles.length; item++) {
// 			var logger = this.activeObstacles[item].position.z; 
// 			//console.log(item, logger);
// 			if (activeObstacles[item].position.z > -100) {
// 				activeObstacles.pop(); 
// 				console.log("pop"); 
// 		}
// 	} 

var getShipVertices = function() {
	//var VC = ship.geometry.vertices.length;
	var hex  = 0xff0000;
	var VC = THREE.BoundingBoxHelper(ship, hex); 
	VC.update(); 
	scene.add(VC);
	var vCount = VC.box.geometry.vertices.length; 
	console.log(vCount + 'v');
}
// //keep list of 12
// // - try iterating through it? 

// }



