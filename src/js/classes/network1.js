/*
the node and link classes
*/


var network = {
  node : function(id,v,s, box){
    /* make node with id at v (vector) and with size s
    */
    this.id = id;
    this.size = s;
    this.geometry = new THREE.TetrahedronGeometry( this.size, detail );
    if (typeof box !== 'undefined'){
      this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );
    }
    this.material = new THREE.MeshLambertMaterial( { color: nodecolor } );
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
    this.material = new THREE.MeshLambertMaterial( { color: col } );//, wireframe: true MeshBasicMaterial
    this.link = new THREE.Mesh( this.geometry, this.material );
    this.position = this.link.position;
    
    this.link.matrixAutoUpdate = false;
    
    this.link.rotateOnAxis(vr,Math.acos(dv.dot(ax)/dv.length()/ax.length()));
    this.link.position.set(start_pos.x,start_pos.y,start_pos.z);
    this.link.updateMatrix();
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
  
  get_edges : function(elist, segments, colors){
    var segs = 1;
    if (segments){
      segs = segments;
    }
    console.log('segs=', segs);
    
    var edges = {};
    
    for(i in elist){
      // if color is defined, use it
      if (colors){
        col = parseInt(colors[i]);
        console.log('color given!!!!:', col);
      }
      else col = linkcolor;
      
      var ii = elist[i];
      //console.log(ii);
      if (ii.length == 2){
        id = ii;
        edges[id] = new network.link(ii[0],ii[1],edgethickness,col,segs);
      }
      else if (ii.length == 3){ //weight given
        id = ii.slice(0,2);
        var wght = ii[2];
        edges[id] = new network.link(ii[0],ii[1], network.weightFunc(wght), col, segs);
      }
      scene.add(edges[id].link);
    }
    return edges;
  },
  
  get_nodes : function(nodeloc, center, sizes, sizeFunc){
    var nodes = {};
    // first find center of all points
    var com = [0,0,0];
    if (center){
      for(i in nodeloc){
        var ii = nodeloc[i];
        com = [com[0]+ii[0],0*com[1]+ii[1],com[2]+ii[2]];
      }
      var nl = nodeloc.length
      com = [com[0]/nl,com[1]/nl,com[2]/nl];
    }
    if(typeof sizeFunc === 'undefined'){
      sizeFunc = network.sizeFunc;
    }
    var ns = nodesize;
    for(i in nodeloc){
      if (typeof sizes !== 'undefined'){//(0 !== sizes){
        ns=nodesize*sizeFunc(sizes[i]);
      }
      var ii = nodeloc[i];
      if (ii.length == 3){ id = i;}
      nodes[id] = new network.node(id, new THREE.Vector3(ii[0]-com[0],ii[1]-com[1],ii[2]-com[2]),ns);//degrees[i]
      scene.add(nodes[id].node);
      cam_loc = Math.max(cam_loc,ii[2]);
      
      cam_speed = cam_loc/100.0 ;
    }
    return nodes;
  },
  
  weightFunc : function(w){
    return Math.asinh(.1*w)/3+.1;
  },
  
  sizeFunc : function(s){
    return Math.pow(s, 1/2.0); // tak s as volume, thus radius is cubic root
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
