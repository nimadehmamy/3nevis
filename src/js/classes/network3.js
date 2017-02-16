/*
the node and link classes

v1.0
New paradigm:
1) link: add to scene when created.
2) link: use curving tube from A to B instead of rotating and moving cylinders.

*/


var network = {
  node : function(id,v,s, box, color){
    /* make node with id at v (vector) and with size s
    */
    this.type = 'node';
    var bx = box || false;
    this.color = color || controls.nodeColor; //nodecolor
    this.id = id;
    this.size = s;
    var detail = controls.nodeDetail;
    
    this.geometry = new THREE.TetrahedronGeometry( this.size, detail );
    this.material = new THREE.MeshLambertMaterial( {
      color: this.color,
      vertexColors: THREE.FaceColors,
    });
    this.node = new THREE.Mesh( this.geometry, this.material );
    this.position = this.node.position;
    this.position.set(v.x,v.y,v.z);
    this.degree = 0;
  },
  
  link : function(id1,id2,rad, color, segments){
    /* !! Note: assumes global variable "nodes" defined. It must be
    an array of instances of "network.node".
    Make a link from v1 to v2 (vectors) with radius rad and length len
    */
    this.type = 'link';
    
    if (color){col=color;}
    else col = linkcolor;
    
    this.endpoints = [id1,id2];
    var v1 = nodes[id1].position;
    var v2 = nodes[id2].position;
    var dv = new THREE.Vector3();
    dv.subVectors(v2,v1);
    // the midpoint of the link has to be the start position of the cylinder
    var start_pos = new THREE.Vector3().addVectors(v1,v2).divideScalar(2.0);
    // axis of cylinder
    var ax = new THREE.Vector3(0,1,0);
    // vr: normal to surface spanned by cylinder and dv
    var vr = new THREE.Vector3().crossVectors( ax, dv).normalize();
    
    this.size = rad;
    this.geometry = new THREE.CylinderGeometry(
      radiusTop=rad
      ,radiusBottom = rad
      ,height = dv.length()
      ,radiusSegments = ngon
      ,heightSegments = segments
      //,thetaLength = 2
      );
    this.material = new THREE.MeshLambertMaterial( {
      //color: col,
      //vertexColors: THREE.VertexColors,
      vertexColors: THREE.FaceColors,
    color: 0xff0000,
    side: THREE.BackSide
      } );//, wireframe: true MeshBasicMaterial
    this.link = new THREE.Mesh( this.geometry, this.material );
    this.position = this.link.position;
    
    this.link.matrixAutoUpdate = false;
    
    this.link.rotateOnAxis(vr,Math.acos(dv.dot(ax)/dv.length()/ax.length()));
    this.link.position.set(start_pos.x,start_pos.y,start_pos.z);
    this.link.updateMatrix();
  },
  
  linkWithCrossSection: function(points ,radius, segs, color, wings,starryness, hide, opacity){
      
    `NOTE: rescales with controls.scale!!!`
    var w = wings || controls.edgeCross //ngon
      ,st = starryness || controls.edgeStarriness //starry
      ,col = color || controls.edgeColor //linkcolor
      ,op = opacity || 1;
      
    console.log('new edge color:',col);
    if (controls.edgeColorRandom){
        col = Math.random() * 0xffffff;
    }
    console.log("starryness:", st, col)
    var xshape = [], count = w*3;
    for ( var i = 0; i < count; i ++ ) {
    	var a = 2 * i / count * Math.PI;
    	var r = radius * ( 1 - st * Math.cos( w * a )) * Math.abs(controls.scale);
    	xshape.push( new THREE.Vector2 ( Math.cos( a ) * r, Math.sin( a ) * r ) );
    }
    if (points.length <2) {
      console.log('!!! Not enough points!!');
      this.mesh = 'hi';
      return 1;
    }//points.push(points[0]);
    pts = network.rescale(points);
    var spline =  new THREE.CatmullRomCurve3(pts);//points);
    this.extrudeSettings = {
    	steps			: segs,
    	bevelEnabled	: false,
    	extrudePath		: spline //closedSpline
    };
    this.shape = new THREE.Shape( xshape );
    
    //console.log(xshape, shape);
    this.geometry = new THREE.ExtrudeGeometry( this.shape, this.extrudeSettings );
    this.material = new THREE.MeshLambertMaterial( {
      color: col,
      opacity: op,
      transparent: true,
      side: THREE.DoubleSide,
    } );//, wireframe: true MeshBasicMaterial
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.points = pts;
    if (!hide){
      scene.add(this.mesh);
    }
    
  },
  
  linkGrowth: function(id1,id2, rad, color, segments, polymer){
    /* !! Note: assumes global variable "nodes" defined. It must be
    an array of instances of "network.node".
    Make a link from v1 to v2 (vectors) with radius rad and length len
    */
    var col = color // || controls.edgeColor //linkcolor
        ,segs = segments || controls.edgeSegments;
    
    //c = controls.scale;
    this.endpoints = [id1,id2];
    this.type = 'link';
    this.size = rad;
    if (polymer > 0){
      this.points = network.get_linkPoints(netName, id1, id2);//pts;
      this.link = 'here';//new network.linkWithCrossSection(this.points, rad, segs,  col ,undefined, undefined );//starryness = .1);
    }
    else{
      var v1 = nodes[id1].position;
      var v2 = nodes[id2].position;
      this.points = misc.getParabola(nodes[id1], nodes[id2], segs);
      
      this.link = new network.linkWithCrossSection(
        this.points
        ,radius = rad
        ,segs = segs
        ,color = col
        ) ;
    }
  },
  
  
  get_linkPoints : function (netName, id1, id2){
    // read the points
      try{
        var p0 = loader.readMatrix('assets/network/'+netName+'/edges/'+[id1,id2]+'.txt',' ');
      }
      catch(err){
        if (err.name == "TypeError"){
          console.log('!! Edge file for ('+[id1,id2]+') not found! Making striaght edge...');
          p0 = [nodes[id1].position,nodes[id2].position];
          console.log(p0);
        }
        //return NaN;
      }
      console.log('making edge (%d,%d) with %d pts',id1,id2, p0.length);
    
      return p0;//network.rescale(p0);
  },
  
  rescale3: function(p0){
    var c = controls.scale;
    var pts = [];
    for (j in p0){
      //if (j> 500) break;
      pts.push(new THREE.Vector3(c*p0[j].x,-c*p0[j].y,c*p0[j].z));
    }
      
    return pts;
  },
  rescale: function(p0){
    var c = controls.scale;
    var pts = [];
    for (j in p0){
      //if (j> 500) break;
      pts.push(new THREE.Vector3(c*p0[j][0],-c*p0[j][1],c*p0[j][2]));
    }
      
    return pts;
  },
  
  get_degrees : function(elist){
    var k = {};
    for (i in elist){
      if (k[elist[i][0]]){k[elist[i][0]] +=1;}
      else {k[elist[i][0]] =1;}
      if (k[elist[i][1]]){k[elist[i][1]] +=1;}
      else {k[elist[i][1]] =1;}
    }
    return k;
  },
  
  get_edges : function(elist, radius, segments, colors, polymer){
    // var segs = 1;
    // if (segments){
    //   segs = segments;
    // }
    var segs = segments || 1,
        pol = polymer || 0,
        rad = radius || controls.edgeDiameter;
    //console.log('segs=', segs);
    
    var edges = {};
    
    for(i in elist){
      // if color is defined, use it
      if (colors){
        col = parseInt(colors[i]);
        console.log('color given!!!!:', col);
      }
      else col = linkcolor;
      if (typeof(rad)=="object"){
          r = rad[i]
          console.log(rad);
          TypeError
      }else r = rad;
      var ii = elist[i];
      
      //console.log(ii);
      if (ii.length == 2){
        id = ii;
        //edges[id] = new network.link2(ii[0],ii[1],edgethickness,col,segs);
        edges[id] = new network.linkGrowth(ii[0],ii[1],r,col,segs, pol);
      }
      else if (ii.length == 3){ //weight given
        id = ii.slice(0,2);
        var wght = ii[2];
        //edges[id] = new network.link2(ii[0],ii[1], network.weightFunc(wght), col, segs);
        var ed = new network.linkGrowth(ii[0],ii[1], network.weightFunc(wght), col, segs, pol);
        if (ed.link.mesh !== 'hi'){
          edges[id] = ed;
        }
      }
      //scene.add(edges[id].link.mesh);
    }
    return edges;
  },
  
  get_nodes : function(nodeloc, center, sizes, sizeFunc, hide){
    var c = controls.scale;
    var nodes = {};
    
    if(typeof sizeFunc === 'undefined'){
      sizeFunc = network.sizeFunc;
    }
    
    for(i in nodeloc){
      var bx = false;
      var ns = network.sizeFunc(controls.scale*controls.nodeSize);
    //   if (typeof sizes !== 'undefined'){//(0 !== sizes){
    //     ns=sizeFunc(sizes[i]) * controls.scale;
    //     console.log(ns)
    //   }
      console.log(ns);
      var ii = nodeloc[i];
      if (ii.length == 3){ id = i;}
      
      nodes[id] = new network.node(id, new THREE.Vector3(c*ii[0],-c*ii[1],c*ii[2]),ns);
      scene.add(nodes[id].node);
      cam_loc = Math.max(cam_loc,ii[2]);
      cam_speed = cam_loc/100.0 ;
    }
    
    return nodes;
  },
  
  
  weightFunc : function(w){
    return Math.asinh(edgethickness*w)/2.0+0.4;//w*edgethickness; // Math.asinh(edgethickness*w)/3+.1;
  },
  
  sizeFunc : function(s){
    return Math.pow(s, 1/2.0); // take s as volume, thus radius is cubic root
  }
  
}

/*
To update the links and change their shape we first make the modifications and then turn
  on the verticesNeedUpdate flag in the geometry.
  link.link.geometry.verticesNeedUpdate = true
  
  The link vertices that connect to the nodes for a link with n-gon cross-section are as follows.
  For n-gon cylinders with m segments:
  there are n*(m+1)+2 vertices
  The last two are the centers of the two endcaps.
  The len-2 element is the beginning endcap.
  The len-1 is for ending endcap.
  0-(n-1) are beginning cap,
  k*n+(0-(n-1)) are for the k-th cross-section.
  
*/

/* when we wish to add a new method function to an existing class,
as opposed to adding method to an object (instance of class),
we need to use "prototype".
*/
network.link.prototype.mold = function(vertexDeltas){
  '{vid: {x:dx, y:dy, z:dz}, ...} give the vertices and the amount of displacement';
  for (i in vertexDeltas){
    var v = vertexDeltas[i];
    v = new THREE.Vector3(v.x,v.y,v.z);
    // The world of the link may be rotated. The deltas should be rotated accordingly.
    var r = this.link.getWorldRotation();
    r.set(-r.x,-r.y,-r.z,"ZYX");
    v.applyEuler(r);
    //console.log('it was:',v);
    var v0 = this.link.geometry.vertices[i];
    v0 = v0.addVectors(v0, v);
  }
  
  this.link.geometry.verticesNeedUpdate = true;
};

network.link.prototype.moveSect = function(segment, deltas){
  'segments: int, deltas : {x:dx, y:dy, z:dz} ';
  //this.link.geometry.parameters.heightSegments
  // move a whole segment. get the data on cross-section from paraameters.
  var m = this.link.geometry.parameters.heightSegments;
  var n = this.link.geometry.parameters.radialSegments;
  ls = {};
  for (var i=segment*(n+1); i < (segment+1)*(n+1); i++){
    //console.log(n,i);
    ls[i]= deltas;
  }
  this.mold(ls);
};
