var detail = 2;//3;
var ngon = 3; //cross-section n-gon
var nodesize = 4;
var edgethickness = 0.2;//0.4;
var edgesegments = 1; //10;
var cam_speed = 0.1;
var cam_loc= 5;

var starry = 0.5;

var nodecolor = 0x005500;
var linkcolor = 0xf0f0ff;//0xff357a;//0x880066;
//var colors = [0xff0000,0xff0000 ];


var axisHelper = new THREE.AxisHelper( 10 );
scene.add( axisHelper );

// var nodes_loc = loader.readMatrix('assets/network/nodes-Jianxi1.txt',' ');
// var edge_list = loader.readMatrix('assets/network/edgelist-Jianxi1.txt',' ');
// var weights = loader.readMatrix('assets/network/weights-Jianxi.txt',' ');

// var nodes_loc = loader.readMatrix('assets/network/nodes1.txt',' ');
// var edge_list = loader.readMatrix('assets/network/edgelist1.txt',' ');

//var conflicts = loader.readMatrix('assets/network/conflicts.txt',' ');

// var nodes_loc = loader.readMatrix('assets/network/nodes2.txt',' ');
// var edge_list = loader.readMatrix('assets/network/edgelist2.txt',' ');
// var conflicts = loader.readMatrix('assets/network/conflicts-compact2.txt',' ');

// var nodes_loc = loader.readMatrix('assets/network/nodes-sim-rand2.txt',' ');
// var edge_list = loader.readMatrix('assets/network/edgelist-sim-rand2.txt',' ');
// var conflicts = loader.readMatrix('assets/network/conflicts-compact-sim-rand2.txt',' ');

// var nodes_loc = loader.readMatrix('assets/network/nodes-sim-rand.txt',' ');
// var edge_list = loader.readMatrix('assets/network/edgelist-sim-rand.txt',' ');
// var conflicts = loader.readMatrix('assets/network/conflicts-compact-sim-rand.txt',' ');

var nodes_loc = loader.readMatrix('assets/network/nodes-stress2.txt',' ');
var edge_list = loader.readMatrix('assets/network/edges-stress2.txt',' ');


// var colors  = misc.getConflictColors(conflicts);
var colors=[]; for (i in edge_list){colors.push(linkcolor);}
var degrees = network.get_degrees(edge_list);
var nodes   = network.get_nodes(nodes_loc, center = false );// , sizes = degrees);
var edges   = network.get_edges(edge_list, segments = edgesegments, colors );



//misc.makeParabola();

var nodeMeshes = [];
for (i in nodes){
  nodeMeshes.push(nodes[i].node);
}


var eventlogger = document.getElementById('logger');


misc.clickNode();



// nodes may update cam location, so
camera.position.z = cam_loc;





var closedSpline = new THREE.ClosedSplineCurve3( [
					new THREE.Vector3( -60, -100,  60 ),
					new THREE.Vector3( -60,   20,  60 ),
					new THREE.Vector3( -60,  120,  60 ),
					new THREE.Vector3(  60,   20, -60 ),
					new THREE.Vector3(  60, -100, -60 )
				] );

// var points = [
// 					new THREE.Vector3( -60, -100,  60 ),
// 					//new THREE.Vector3( -60,   20,  60 ),
// 					//new THREE.Vector3( -60,  120,  60 ),
// 					new THREE.Vector3(  60,   20, -60 )
// 					];
// var randomSpline =  new THREE.CatmullRomCurve3(points);
// var extrudeSettings = {
// 	steps			: 1,
// 	bevelEnabled	: false,
// 	extrudePath		: randomSpline //closedSpline
// };


// var pts = [], count = 3;

// for ( var i = 0; i < count; i ++ ) {

// 	var l = 20;

// 	var a = 2 * i / count * Math.PI;

// 	pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );

// }

// var pts1 = [], count = 50;

// for ( var i = 0; i < count; i ++ ) {

// 	var l = 20;

// 	var a = 2 * i / count * Math.PI;
	
// 	var r = l*(1 + 0.3 * Math.cos( 5 * a ));

// 	pts1.push( new THREE.Vector2 ( Math.cos( a ) * r, Math.sin( a ) * r ) );

// }

// var shape = new THREE.Shape( pts1 );

// var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

// var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );

// var mesh = new THREE.Mesh( geometry, material );

// scene.add( mesh );

for (i in scene.children){
  if (i<3){
    continue;
  }
  if (scene.children[i].geometry.type != "BoxGeometry"){
    continue;
  }
  var p = scene.children[i].position;
  var abs = Math.abs;
  if (abs(p.x)+abs(p.y)+abs(p.z) <.1){
    console.log("removed", i);
    scene.remove(scene.children[i]);
  }
}


// support

// geometry = new THREE.CylinderGeometry(
//       radiusTop=18,
//       radiusBottom = 18,
//       height = .4,
//       radiusSegments = 12);
geometry = new THREE.BoxGeometry(105,1,105);
material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
plate = new THREE.Mesh( geometry, material );
scene.add(plate);


render();


