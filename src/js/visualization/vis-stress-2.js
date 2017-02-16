var controls = new function(){
    this.scale = 10;
    this.nodeSize = 0.2;
    //this.nodeColor = '#0000ff';
	  this.nodeColor = '#ede7e4';
    this.edgeDiameter = 1.;
    this.edgeSegments = 50;
    this.edgeOpacity = 1;
    this.nodeDetail = 3;
    this.edgeCross = 8;
    this.edgeStarriness = .0;
    this.edgeColorRandom = false;
    //this.edgeColor = '#ffffff';
	  this.edgeColor = '#0070c0';

    this.background = '#ffffff';
    this.conflicts = 0.2;
    this.th = [];
    this.showStress = false;
    this.stressOpacity = false;
}

var distz;
var ds0 = [];
var mx = 0;

gui.add(controls, 'conflicts', 0.001, 0.5 ).onFinishChange(showConfs);

function showConfs(){
  controls.edgeDiameter = controls.conflicts;
  redrawEdges();
  controls.nodeSize = 1 * controls.conflicts;
  redrawNodes();
  getDistz();
  colorEdges();
}

function getDistz(){
  for(var i in distz){
    ds0[i]=0 ;
    for(var j in distz[i]){ ds0[i] += (distz[i][j] > 1e-30) &&
    (distz[i][j] < controls.edgeDiameter) }
    
  }
  for(i in ds0){ mx = Math.max(mx, ds0[i])}
}


function colorEdges(){
  
  for(var i in edge_list){
    var l = edges[ edge_list[i]];
    //var c = Math.pow(1 - ds0[i]/mx, 4) ;
	var c = Math.pow(1 - ds0[i], 1) ;
	if (c==1){
		l.link.material.color.setRGB(0,0.43922,0.75294)
	} else { l.link.material.color.setRGB(1,0,0)
		
	}

    //l.link.material.color.setRGB(1,.3*c,c);
  }
}
var geo,mat,trig;
function makeSurface(){
  geo = new THREE.Geometry();
  for (var i in nodes){geo.vertices.push(nodes[i].position)}
  mat = new THREE.MeshLambertMaterial( {
      color: 0xff70c0,
      //vertexColors: THREE.FaceColors,
		  side: THREE.DoubleSide,
		  transparent: true,
    });
    tr = network.info.trigs;
    for (i in tr){ u=tr[i]; geo.faces.push(new THREE.Face3(u[0],u[1],u[2]));}
    geo.computeFaceNormals ();
    geo.computeVertexNormals ();
    trig = new THREE.Mesh( geo, mat );
    scene.add(trig);
}

function showStress(){
    if (!controls.showStress){ redrawAll(); }
    else{
        var st = network.info.stress;
        var mx = 0;
        for (var i = 0; i < edge_list.length; i++) {
            mx = Math.max(mx, st.link_p[i]);
            mx = Math.max(mx, st.link_t[i]);
        }
        for (var i in nodes) {
            mx = Math.max(mx, st.node_p[i]);
            mx = Math.max(mx, st.node_t[i]);
        }
        for (var i = 0; i < edge_list.length; i++) {
            e = edges[edge_list[i]];
            e.link.mesh.material.color.setRGB(st.link_p[i] / mx, 0, st.link_t[i] / mx)
            // e.link.mesh.material.opacity = 0.5*(st.link_p[i]+st.link_t[i])/mx;
        }
        for (var i in nodes) {
            nodes[i].material.color.setRGB(st.node_p[i] / mx, 0, st.node_t[i] / mx);
            // nodes[i].material.opacity =  0.5*(st.node_p[i]+st.node_t[i])/mx;
        }
    }
}

function stressOpacity(){
    if (!controls.stressOpacity){ redrawAll(); }
    else{
        var st = network.info.stress;
        var mx = 0;
        for (var i = 0; i < edge_list.length; i++) {
            mx = Math.max(mx, st.link_p[i]);
            mx = Math.max(mx, st.link_t[i]);
        }
        for (var i in nodes) {
            mx = Math.max(mx, st.node_p[i]);
            mx = Math.max(mx, st.node_t[i]);
        }
        for (var i = 0; i < edge_list.length; i++) {
            e = edges[edge_list[i]];
            e.link.mesh.material.opacity = 0.5*(st.link_p[i]+st.link_t[i])/mx;
        }
        for (var i in nodes) {
            nodes[i].material.opacity =  0.5*(st.node_p[i]+st.node_t[i])/mx;
        }
    }
}





//gui.add(controls, 'edgeDiameter', 0.01, 0.5).onFinishChange(redrawEdges);
//gui.add(controls, 'edgeSegments', 1, 200).step(1).onFinishChange(redrawEdges);
var guiNet = gui.addFolder('Network Properties');
guiNet.add(controls, 'scale', 1, 100).onFinishChange(redrawAll);
function redrawAll(){
  redrawNodes();
  redrawEdges();
}

var guiNode = guiNet.addFolder("Nodes");
var guiEdge = guiNet.addFolder("Edges");
gui.addColor(controls, 'background' ).onChange(background);
function background(){
  renderer.setClearColor( parseInt(controls.background.slice(1),16),1);
}

guiNode.add(controls, 'nodeSize', 0.001, 2).step(0.001).onFinishChange(redrawNodes);
guiNode.add(controls, 'nodeDetail', 0, 10).step(1).onFinishChange(redrawNodes);
guiNode.addColor(controls, 'nodeColor').onChange(redrawNodes);

guiEdge.add(controls, 'edgeDiameter', 0.001, 4).step(0.01).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeSegments', 1, 200).step(1).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeCross', 3, 100).step(1).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeStarriness', -.9,.9 ).step(.01).onFinishChange(redrawEdges);
guiEdge.addColor(controls, 'edgeColor').onChange(redrawEdges);

guiEdge.add(controls, 'edgeColorRandom').onFinishChange(redrawEdges);

guiEdge.add(controls, 'edgeOpacity', 0., 1).onFinishChange(redrawEdges);

guiNet.add(controls, 'showStress').onFinishChange(showStress);
guiNet.add(controls, 'stressOpacity').onFinishChange(stressOpacity);



var detail = 3;//3;
var ngon = 8; //cross-section n-gon
// major scale
//var scale = -10;//3;
//var nodesize = 1.0;
//var edgethickness = 2;//0.4;
//var edgesegments = 50; //10;
var cam_speed = 0.1;
var cam_loc= 5;

var starry = 0.5;

var nodecolor = 0x005500;
var linkcolor = 0xf0f0ff;//0xff357a;//0x880066;
//var colors = [0xff0000,0xff0000 ];

// var axisHelper = new THREE.AxisHelper( 10 );
// scene.add( axisHelper );

// var nodes_loc = loader.readMatrix('assets/network/nodes-Jianxi1.txt',' ');
// var edge_list = loader.readMatrix('assets/network/edgelist-Jianxi1.txt',' ');
// var weights = loader.readMatrix('assets/network/weights-Jianxi.txt',' ');


var eventlogger = document.getElementById('logger');

var clicked = {type: null, id: null}; // stores the id of clicked element
misc.clickNode();

// nodes may update cam location, so
camera.position.z = cam_loc;

var netName, vars, edge_list, edges, nodes_loc, nodes, degrees, conflicts;
var Err;
var Viz = function(){
  var b = document.getElementById('Viz');
  //b.textContent = "Loaded";
  var z = document.getElementById('netName');
  netName = z.value;
  edge_list = loader.readMatrix('assets/network/'+netName+'/edgelist.txt',' ');
  nodes_loc = loader.readMatrix('assets/network/'+netName+'/nodes.txt',' ');
  try{
    //distz = loader.readMatrix('./assets/network/'+netName+'/distz.txt',' ')

    b.style.backgroundColor = '#4CAF50';
  }
  catch(err) {
    //document.getElementById("err").innerHTML = err.message;
    if (err.name == "TypeError"){
      b.style.backgroundColor = '#ff5555';
      b.textContent = "Not Found!"
      return 1;
    }
  }
  // if info exists:
  try
  {
    var j = $.getJSON('assets/network/'+netName+'/info.json', function(data,status){
      if(status == "error"){
        console.log('No info file found!!! Skipping... ');
        return 1;
      }
      //console.log(data);
      network.info = data;
      try{
        th = data.links.thickness;
        // try{th/= data.scale;}
        // catch(err){ console.log('!! no scale in info !!'); }
      }catch(err){
        console.log(err.message);
        th = data.th;
      }
      if(typeof(th)=='number'){
        //controls.edgeDiameter = th; // * Math.abs(controls.scale);
        controls.thickness = th
        controls.nodeSize = th;// * Math.abs(controls.scale);
      }else{
        controls.thickness = th;
      }
      controls.scale = 1/data.scale;
      redrawEdges();
      //controls.nodeSize = th;// * Math.abs(controls.scale);
      redrawNodes();
    })
    .fail(function() {
    console.log( "error !!!" );
  });
    //console.log('assets/network/'+netName+'/info.json');
    //controls.edgeDiameter = j.responseJSON.th * Math.abs(controls.scale);
  }catch(err){
    console.log('!! no info file found!! Using defaults...')
  }
  degrees = network.get_degrees(edge_list);

  b.textContent = "Loading Nodes...";
  nodes = network.get_nodes(nodes_loc, center = false, sizes = degrees);//);//false );
  b.textContent = "Loading edges...";
  console.log('th=',controls.edgeDiameter);
  edges = network.get_edges(
    edge_list
    ,radius = controls.thickness
    ,segments = controls.edgeSegments
    ,colors = undefined
    ,polymer = 1
    );
    
  b.textContent = "Loaded";
  
  
  
  vars = {
    edgeGeometry : "ExtrudeGeometry"//edges[ edge_list[0].slice(0,2)].link.geometry.type ||
    ,nodeGeometry : "TetrahedronGeometry"//nodes[0].geometry.type ||
  }
  
  render();
} // Vizz

function shell(r,thickness){
  var points = [];
  for ( var i = 11; i >= 0; i -- ) {
  	points.push( new THREE.Vector3( Math.cos( i * 0.1 * Math.PI /2 ) * r , 0, Math.sin( i * 0.1 * Math.PI /2 ) * r  ) );
  }
  for ( var i = 0; i < 11; i ++ ) {
  	points.push( new THREE.Vector3( Math.cos( i * 0.1 * Math.PI /2 ) * (r+thickness) , 0, Math.sin( i * 0.1 * Math.PI /2 ) * (r+thickness)  ) );
  }
  //console.log(points.length);
  g = new THREE.LatheGeometry( points );
  mat = new THREE.MeshBasicMaterial(
    { color: 0xffff00
    , opacity: .5
    , transparent: true
    , wireframe: false } );
  lathe = new THREE.Mesh( g, mat );
  lathe.rotation.x = -Math.PI/2;
  scene.add( lathe );
  return {geometry : g, material : mat, mesh : lathe}
}

function base(height,thickness){
  g = new THREE.BoxGeometry(height, thickness, height);
  mat = new THREE.MeshBasicMaterial(
    { color: 0xff0000
    , opacity: .5
    , transparent: true
    , wireframe: false } );
  base = new THREE.Mesh( g, mat );
  base.position.y = height+thickness;
  scene.add( base );
  return {geometry : g, material : mat, mesh : base}
}

function redrawEdges(){
  console.log('change');
  //var ii = 0;
  var th = 1;
  for (ii in edge_list){
    try{
        i = edge_list[ii]
      if (controls.thickness.length >0 ){edges[i].size = controls.thickness[ii]}
      scene.remove(edges[i].link.mesh);
      //console.log(edges[i].link.mesh);
      edges[i].link = new network.linkWithCrossSection(
        edges[i].points
        ,edges[i].size
        ,controls.edgeSegments
        ,undefined //Math.random() * 0xffffff
        ,undefined
        ,undefined //starryness = .1
        ,hide = undefined
        ,opacity = controls.edgeOpacity);
    }
    catch(err){
      continue
    }
  }
}

function redrawNodes(){
    console.log('redrawing nodes...');
  for (i in nodes){
    scene.remove(nodes[i].node);
  }
  nodes = network.get_nodes(nodes_loc, center = false, sizes = undefined
//   , sizeFunc = function(s){return Math.abs(controls.scale)*controls.nodeSize*network.sizeFunc(s)}
  );
  //
}
var sh= shell(Math.abs(controls.scale)/2,1);
scene.remove(sh.mesh);



//render(); //4/20
//}


var guiCamera = gui.addFolder('Camera');
controls.follow = false;
guiCamera.add(controls,'follow').onChange(function(){
  if(controls.follow){
    console.log('Following ',clicked.id);
  }
  else console.log( "Warning: No element selected!");
});

controls.offset = 0.002;
guiCamera.add(controls,'offset', 0.0001,.01);

controls.camHelper = false;
guiCamera.add(controls, 'camHelper').onChange(function(){
  if(controls.camHelper == false){
    scene.remove(cameraHelper);
  }else{
    scene.add(cameraHelper);
  } });


var guiMisc = gui.addFolder('Misc.');

controls.shell = false;
guiMisc.add(controls, 'shell').onChange(function(){
  if(controls.shell == false){
    scene.remove(sh.mesh);
  }else{
    scene.add(sh.mesh);
  } });

var bs= base(Math.abs(controls.scale)/2,1);
scene.remove(bs.mesh);
controls.base = false;
guiMisc.add(controls, 'base').onChange(function(){
  if(controls.base == false){
    scene.remove(bs.mesh);
  }else{
    scene.add(bs.mesh);
  } });

controls.conflicts = false;
guiMisc.add(controls,'conflicts').onChange(function(){
  if(controls.conflicts && netName){
    console.log('loading conflics...');
    conflicts = loader.readMatrix('assets/network/'+netName+'/conflicts.txt',' ');
  }
  else console.log( "Warning: No network name specified!");
});

controls.grow = false;
gui.add(controls, 'grow');

misc.growth = 0;

misc.growEdge = function(){
  //console.log('change');
  if (clicked.type == 'link'){
    var i = clicked.id
    misc.growth = (misc.growth + 1/(60*5)) % 1;
    //if ((misc.growth*5 % 1) < 1/10  ){
      try{
        scene.remove(edges[i].link.mesh);
        //console.log(edges[i].link.mesh);
        var l = edges[i].points.length;
        edges[i].link = new network.linkWithCrossSection(
          edges[i].points.slice(0, 2 + l * misc.growth)
          ,controls.edgeDiameter
          ,parseInt(controls.edgeSegments * misc.growth + 1)
          , 0xffff00);
        //   ,undefined
        //   ,starryness = .1);
      }
      catch(err){
        null
      }
    //}
  }
}





function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
	if (controls.grow) misc.growEdge();
}

animate();
