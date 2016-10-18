var misc = {
  
  max : function(ls){
      var mx = - Infinity;
      for (i in ls){
        mx = Math.max(ls[i],mx);
      }
      return mx;
    },
    
  getConflictColors : function(conflicts){
      var dum = [];
      for (i in conflicts){
        dum = dum.concat(conflicts[i]);
      }
      conflicts = dum;
      
      var maxConf = Math.max(1,misc.max(conflicts)); // in case there are no conflicts = 1
      // color based on amount of conflicts
      var colors = []
      for (i in conflicts){
        console.log(conflicts[i]/maxConf);
        colors = colors.concat(0xffffff - (257*255*conflicts[i])/maxConf);
        // var col = 0xffffff;
        // if (conflicts[i] != 0){
        //   col = 0xff0000;
        // }
        //colors = colors.concat(col)
      }
      return colors;
    },
    
    /*
    reshape the edge "2,3" to a hanging wire (cosh ~ parabola)
    */
    
  getParabolaDeltas : function(n1,n2,segs){
      // 1) get the position of the nodes,
      // 2) find the line connecting them with segs segments.
      // 3) find a neat Parabola connecting them
      // 4) find deltas
      if (n1.position.y > n2.position.y){
        var p2 = n1.position,
            p1 = n2.position;
      } else {
        var p1 = n1.position,
            p2 = n2.position;
      }
      //the vectors breaking the line from p1 to p2 into segs segments is p1+ n*(p1-p2)
      deltas = {};
      var dv = new THREE.Vector3().subVectors(p2,p1);
      for (var i=0;i<segs+1;i++){
        ddv = new THREE.Vector3(dv.x,dv.y,dv.z).multiplyScalar(i/segs);
        //console.log(dv);
        //deltas[i]=
        var dum = new THREE.Vector3().addVectors(p1, ddv);
        //deltas[i].add({x:0,y:1,z:0});
        // find radius, then add the parabola to it
        var r = Math.pow(ddv.x,2)+Math.pow(ddv.z,2);
        // scale it so it passes through endpoints of dv
        r *= dv.y/(Math.pow(dv.x,2)+Math.pow(dv.z,2));
        //console.log(r);
        deltas[i]= new THREE.Vector3(0, r-ddv.y,0 );
      }
      return deltas;
    },
    
  getDeltas : function(n1,n2,segs,func){
      // 1) get the position of the nodes,
      // 2) find the line connecting them with segs segments.
      // 3) connect using function func
      // 4) find deltas
      if (n1.position.y > n2.position.y){
        var p2 = n1.position,
            p1 = n2.position;
      } else {
        var p1 = n1.position,
            p2 = n2.position;
      }
      //the vectors breaking the line from p1 to p2 into segs segments is p1+ n*(p1-p2)
      deltas = {};
      var dv = new THREE.Vector3().subVectors(p2,p1);
      for (var i=0;i<segs+1;i++){
        ddv = new THREE.Vector3(dv.x,dv.y,dv.z).multiplyScalar(i/segs);
        //console.log(dv);
        //deltas[i]=
        var dum = new THREE.Vector3().addVectors(p1, ddv);
        //deltas[i].add({x:0,y:1,z:0});
        // find radius, then add the parabola to it
        var r = Math.pow(ddv.x,2)+Math.pow(ddv.z,2);
        // scale it so it passes through endpoints of dv
        r *= dv.y/(Math.pow(dv.x,2)+Math.pow(dv.z,2));
        //console.log(r);
        deltas[i]= new THREE.Vector3(Math.random(),r-ddv.y,Math.random());
      }
      return deltas;
    },
    
  getParabola : function(n1,n2,segs){
      // 1) get the position of the nodes,
      // 2) find the line connecting them with segs segments.
      // 3) find a neat Parabola connecting them
      // 4) find deltas
      if (n1.position.y > n2.position.y){
        var p2 = n1.position,
            p1 = n2.position;
      } else {
        var p1 = n1.position,
            p2 = n2.position;
      }
      //the vectors breaking the line from p1 to p2 into segs segments is p1+ n*(p1-p2)
      points = [];
      var dv = new THREE.Vector3().subVectors(p2,p1);
      for (var i=0;i<segs+1;i++){
        ddv = new THREE.Vector3(dv.x,dv.y,dv.z).multiplyScalar(i/segs);
        //console.log(dv);
        //deltas[i]=
        var dum = new THREE.Vector3().addVectors(p1, ddv);
        //deltas[i].add({x:0,y:1,z:0});
        // find radius, then add the parabola to it
        var r = Math.pow(ddv.x,2)+Math.pow(ddv.z,2);
        // scale it so it passes through endpoints of dv
        r *= dv.y/(Math.pow(dv.x,2)+Math.pow(dv.z,2));
        //console.log(r);
        points.push( new THREE.Vector3(p1.x+ddv.x, p1.y+r,p1.z+ddv.z ));
      }
      return points.reverse();
    },
    
  
    
  makeParabola : function(){
      for (s in edges){
        //var s = "2,3";
        var y = edges[s];
        // get the number of segments and position of endcaps
        var m = y.link.geometry.parameters.heightSegments;
        var n = y.link.geometry.parameters.radialSegments;
        
        // take the two endpoints and connect their positions with a parabola
        var si= s.split(",");
        var ni=nodes[parseInt(si[0])],
            nf=nodes[parseInt(si[1])];
        
        var deltas = misc.getParabolaDeltas(ni,nf, edgesegments);
        
        for (i in deltas){
          y.moveSect(edgesegments-i,deltas[i]);
          
        }
      }
    
    }
    
}

var raycaster, mouse;

misc.clickNode = function(){
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

				// renderer = new THREE.CanvasRenderer();
				// renderer.setClearColor( 0xf0f0f0 );
				// renderer.setPixelRatio( window.devicePixelRatio );
				// renderer.setSize( window.innerWidth, window.innerHeight );
				// container.appendChild( renderer.domElement );

				// stats = new Stats();
				// stats.domElement.style.position = 'absolute';
				// stats.domElement.style.top = '0px';
				// container.appendChild( stats.domElement );

				container.addEventListener( 'mousedown', onDocumentMouseDown, false );
				container.addEventListener( 'touchstart', onDocumentTouchStart, false );
				

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}
			
			function onDocumentTouchStart( event ) {
				
				event.preventDefault();
				
				event.clientX = event.touches[0].clientX;
				event.clientY = event.touches[0].clientY;
				onDocumentMouseDown( event );

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects(
				  scene.children.slice(4,scene.children.length) ); // to skip non-network objects
        
				if ( intersects.length > 0 ) {
          
					//intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
          console.log(intersects[ 0 ].object.geometry.type);
          var obid = intersects[ 0 ].object.id;
          // if (intersects[ 0 ].object.geometry.type == "TetrahedronGeometry"){
          // vars.nodeGeometry.includes(inter...)
          if (intersects[ 0 ].object.geometry.type == vars.nodeGeometry ){
            intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
            for (i in nodes){
              if (nodes[i].node.id == obid){
                console.log("Node ", nodes[i].id);
                clicked.type = nodes[i].type;
                clicked.id = nodes[i].id;
                
                eventlogger.innerHTML = "Node " + nodes[i].id;
                break;
              }
            }
          }
          //else
          // if (intersects[ 0 ].object.geometry.type == "CylinderGeometry"){
          if (intersects[ 0 ].object.geometry.type == vars.edgeGeometry ){
            for (i in edges){
              //console.log(i);
              try{
                if (edges[i].link.mesh.id == obid){
                  console.log("Edge ", edges[i].endpoints);
                  clicked.type = edges[i].type;
                  clicked.id = edges[i].endpoints;
                  
                  eventlogger.innerHTML = "Link " + edges[i].endpoints;
                  break;
                }
              }catch(err){continue}
            }
          }
				// 	var particle = new THREE.Sprite( particleMaterial );
				// 	particle.position.copy( intersects[ 0 ].point );
				// 	particle.scale.x = particle.scale.y = 16;
				// 	scene.add( particle );

				}

				/*
				// Parse all the faces
				for ( var i in intersects ) {

					intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

				}
				*/
}

misc.hide = function(){
  if (clicked.type == nodes[0].type){
    console.log('Removing node %s from scene', clicked.id);
    scene.remove(nodes[clicked.id].node);
  }
  if (clicked.type == 'link'){//edges[edge_list[0].slice(0,2)].type
    console.log('Removing edge '+clicked.id+' from scene');
    scene.remove(edges[clicked.id].link.mesh)
  }
}

// misc.prevClick = '';
// //misc.growing = 0;
// misc.link = {id: '', points: [], link:null, growth:0};
// misc.grow = function(){
//   misc.link.growth = (misc.link.growth +1/60) % 1;
//   var l = misc.link.points.length;
//   if (l > 0 ){
//     // grow the edge
//     scene.remove(edges[clicked.id].link.mesh);
//     misc.link.link = new network.linkWithCrossSection(
//       misc.link.points.slice(0, l * misc.link.growth), rad, parseInt(l), 0xf00 ,undefined, starryness = .1);
//   }
//   console.log(misc.link.growth);
  
//   if (clicked.type == 'link'){//edges[edge_list[0].slice(0,2)].type
//     if (scene.children.includes(edges[clicked.id].link.mesh)){
//       console.log('Removing edge '+clicked.id+' from scene');
//       scene.remove(edges[clicked.id].link.mesh);
      
//       if (misc.prevClick != clicked.id){
//         try{
//           scene.add(edges[misc.prevClick].link.mesh);
//           console.log(misc.prevClick,' added back');
//           misc.link.points = network.get_linkPoints(netName, clicked.id[0], clicked.id[1]);
//         }
//         catch (err){null};
//         misc.prevClick = clicked.id;
//       }
//     }
//   }
// }