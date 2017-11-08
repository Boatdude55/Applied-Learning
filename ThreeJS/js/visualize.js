const scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(100,100,100)');
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function MatrixHandler () {

    let MatrixCache = [];

    var updateMatrixCache = function ( sceneVectors ) {

        MatrixCache.push(sceneVectors);
        
    };

    this.getMatrixCache = function () {

        return MatrixCache;

    }
    this.setVectorsData = function ( matrix ) {

        let vectors = [];
        let x, y, z;
        let origin = new THREE.Vector3(0, 0, 0);

        for ( let i = 0 ; i < matrix.length ; i++) {
            
            let tempGeometry = new THREE.Geometry();
            let currVector = new THREE.Vector3();

            currVector.fromArray(matrix[i])
            
            tempGeometry.vertices.push(
                        origin,
                        currVector
            );
            //currVector.normalize();

            vectors.push(tempGeometry);

        }

        return vectors;

    };

    this.createVectors = function ( vectorObjs ) {

        let origin = new THREE.Vector3();
        let length = 10;

        let vectorVisuals = [];

        for ( let i = 0 ; i < vectorObjs.length ; i++ ) {

            let hex = randomizeHex();
            let material = new THREE.LineBasicMaterial({
                color: hex, linewidth: 5

            });
            let currVectorObj = vectorObjs[i];
            let tempLine = new THREE.Line( currVectorObj, material);

            vectorVisuals.push(tempLine);

        }

        updateMatrixCache(vectorVisuals);
        return vectorVisuals;
    };

    var randomizeHex = function () {
        
        var operand = 0;
        for( let i = 0; i < 6; i++ ) {
            
            let  num = Math.floor((Math.random() * 16));
            operand += (num * Math.pow( 16, i));

        }
        
        return operand;
    };

}

function createGrid ( size = 10 , dimensions = 3) {
    
	const geometryX = new THREE.Geometry();
	const geometryY = new THREE.Geometry();
	const geometryZ = new THREE.Geometry();
	
	const coordinateSystem = [];
	
	let range = size;
	const step = 1;
	
	if ( dimensions === 2 || dimensions === 3 ) {
	    
        //Span(Y)
		for (let i = -range; i <= range; i += step) {

		    //x axis
		    geometryY.vertices.push(new THREE.Vector3(size, i, 0));
		    geometryY.vertices.push(new THREE.Vector3(-size, i, 0));
		    
		    //y axis
		    geometryY.vertices.push(new THREE.Vector3(i, size,0));
		    geometryY.vertices.push(new THREE.Vector3(i,-size,0));
		    
		}
		//Span(X)
		for (let i = -range; i <= range; i += step) {
		    
			    //x axis
			    geometryX.vertices.push(new THREE.Vector3(size, 0 , i));
			    geometryX.vertices.push(new THREE.Vector3(-size, 0, i));
			    
			    //z axis
			    geometryX.vertices.push(new THREE.Vector3(i, 0,size));
			    geometryX.vertices.push(new THREE.Vector3(i, 0,-size));
			}
		
		if ( dimensions === 3 ) {
		    
		    //Span(Z)
		    for (let i = -range; i <= range; i += step) {
			    //x axis
			    geometryZ.vertices.push(new THREE.Vector3(0, size, i));
			    geometryZ.vertices.push(new THREE.Vector3(0, -size, i));
			    
			    //z axis
			    geometryZ.vertices.push(new THREE.Vector3(0, i, size));
			    geometryZ.vertices.push(new THREE.Vector3(0, i, -size));
			}
		
		}
		
	}
	const AxisMaterial = new THREE.LineBasicMaterial( {
        	color: 0xffffff,
        	linewidth: 2,
    } );
    
	const xGrid = new THREE.LineSegments(geometryX, AxisMaterial);
	const yGrid = new THREE.LineSegments(geometryY, AxisMaterial);
	const zGrid = new THREE.LineSegments(geometryZ, AxisMaterial);
	
	coordinateSystem.push(xGrid, yGrid, zGrid);
	
	return coordinateSystem;
}

function SceneHandler () {
    this.addNewObj = function ( objs ) {

        for ( let i= 0; i < objs.length; i++){

            objs[i].forEach(function(elem){
                scene.add(elem);
            });
        }
    };
}

/*function addition ( lOperand ) {
console.log(lOperand.geometry.vertices);
       lOperand.geometry.vertices[1].translate(-1,-2,-3);
}*/
/////////////////////////////////////////Function/Obj Testing//////////////////////////////////
	let newGrid = createGrid();

    let testVectors = [[1, 2, 3], [4, 5, 2], [7, 5, 9]];
    
    const matrixHandler = new MatrixHandler();
    let points, newVectors;

    points = matrixHandler.setVectorsData(testVectors);

    newVectors = matrixHandler.createVectors(points);
    //addition(newVectors[0]);
    const sceneSetter = new SceneHandler();

    sceneSetter.addNewObj([newGrid, newVectors]);
////////////////////////////////////////////////////////////////////////////////////////////////

    camera.position.z = 20;
    camera.position.y = 10;
    scene.rotation.y = 0.5;
	camera.lookAt(scene.position);

const viewControls = new THREE.OrbitControls(camera, renderer.domElement);
viewControls.addEventListener('change', render);
// remove when using animation loop
// enable animation loop when using damping or autorotation
//controls.enableDamping = true;
//controls.dampingFactor = 0.25;

viewControls.enableZoom = true;

function animator () {

	requestAnimationFrame( animator );

	viewControls.update();
    render();

}

function render(){



	renderer.render(scene, camera);

}
animator();
