/*
the node and link classes
*/


var node = function(id,v,s){
  /* make node with id at v (vector) and with size s
  */
  this.id = id;
  this.size = s;
  this.geometry = new THREE.TetrahedronGeometry( this.size, detail );
  this.material = new THREE.MeshLambertMaterial( { color: 0x005500 } );
  this.node = new THREE.Mesh( this.geometry, this.material );
  this.position = this.node.position;
  this.position.set(v.x,v.y,v.z);
  this.degree = 0;
};



var link = function(id1,id2,rad){
  /* make a link from v1 to v2 (vectors) with radius rad and length len
  */
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
  
  
  this.size = s;
  this.geometry = new THREE.CylinderGeometry( radiusTop=rad, rad, dv.length(), ngon, thetaLength=2 );
  this.material = new THREE.MeshLambertMaterial( { color: 0x880066 } );
  this.link = new THREE.Mesh( this.geometry, this.material );
  this.position = this.link.position;
  
  this.link.matrixAutoUpdate = false;
  
  this.link.rotateOnAxis(vr,Math.acos(dv.dot(ax)/dv.length()/ax.length()));
  this.link.position.set(start_pos.x,start_pos.y,start_pos.z);
  this.link.updateMatrix();
};



function get_degrees(elist){
  var k = {};
  for (i in elist){
    if (k[elist[i][0]]){k[elist[i][0]] +=1;}
    else {k[elist[i][0]] =1;}
    if (k[elist[i][1]]){k[elist[i][1]] +=1;}
    else {k[elist[i][1]] =1;}
  }
  return k
}

