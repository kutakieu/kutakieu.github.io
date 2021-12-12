import { onDown_key, onLeft_key, onRight_key, onUp_key } from '../../libs/keydown_functions.js';

let camera, scene, renderer, sphere, clock;

let isUserInteracting = false,
	onPointerDownMouseX = 0, onPointerDownMouseY = 0,
	lon = 42.723046874999994, onPointerDownLon = 0,
	lat = -48.548046875, onPointerDownLat = 0,
	phi = 0, theta = 0;

let panoSphereGeo, panoSphereMat;

const direction = new THREE.Vector3;
let camera_speed = 0.1;

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
// const pano_file = urlParams.get('pano')
// const depth_file = urlParams.get('depth')
const pano_file = "0.jpg"
const depth_file = "0.png"

THREE.ShaderChunk.displacementmap_vertex = "#ifdef USE_DISPLACEMENTMAP\n\ttransformed += normalize( objectNormal ) * ( (texture2D( displacementMap, vUv ).x * 1200.0) * displacementScale + displacementBias );\n#endif"


init();
animate();

function init() {

	var gui = new dat.GUI();
	const gui_folder = gui.addFolder("menu");
	var gui_control = new function(){
		this.scale = 1;
		this.bias = 0;
		this.sphere_size = 10;
		this.camera_x = 0;
		this.camera_y = 0;
		this.camera_z = 0;
	}

	const container = document.getElementById( 'container' );

	clock = new THREE.Clock();

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x101010 );

	const light = new THREE.AmbientLight( 0xffffff, 1 );
	scene.add( light );

	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 2000 );
	camera.position.x = -0.18082234535384292
	camera.position.y = 0.37441312527645654
	camera.position.z = -0.30119306833415305
	scene.add( camera );

	const panoSphereGeo = new THREE.SphereBufferGeometry( 1, 256, 256 );
	// const panoSphereGeo = new THREE.IcosahedronBufferGeometry( 1, 5);
	
	// Create the panoramic sphere material
	panoSphereMat = new THREE.MeshStandardMaterial( {
		side: THREE.BackSide,
		displacementScale: - 4.0
	} );
	
	// Create the panoramic sphere mesh
	sphere = new THREE.Mesh( panoSphereGeo, panoSphereMat );
	sphere.frustumCulled = false

	// Load and assign the texture and depth map
	const manager = new THREE.LoadingManager();
	const loader = new THREE.TextureLoader( manager );

	const pano_video = document.createElement( 'video' );
    pano_video.crossOrigin = 'anonymous';
    pano_video.loop = true;
    pano_video.muted = true;
    pano_video.src = 'data/pano.mp4';
    pano_video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    pano_video.setAttribute( 'playsinline', 'playsinline' );
    pano_video.setAttribute( 'muted', 'muted' );
    pano_video.play();

	const texture = new THREE.Texture( pano_video );
    texture.generateMipmaps = false;
    texture.minFilter = THREE.NearestFilter;
    texture.maxFilter = THREE.NearestFilter;
    texture.format = THREE.RGBFormat;
　　　　// 動画に合わせてテクスチャを更新
    setInterval( function () {
      if ( pano_video.readyState >= pano_video.HAVE_CURRENT_DATA ) {
        texture.needsUpdate = true;

      }
    }, 1000 / 24 );

	sphere.material.map = texture;
	sphere.material.map.wrapS = sphere.material.map.wrapT = THREE.RepeatWrapping;
	sphere.material.map.repeat.set(1, 1);

	// loader.load( './data/' + pano_file, function ( texture ) {
	// 	texture.minFilter = THREE.NearestFilter;
	// 	texture.generateMipmaps = false;
	// 	sphere.material.map = texture;
	// 	sphere.material.map.wrapS = sphere.material.map.wrapT = THREE.RepeatWrapping;
	// 	sphere.material.map.repeat.set(1, 1);
	// } );


	const depth_video = document.createElement( 'video' );
    depth_video.crossOrigin = 'anonymous';
    depth_video.loop = true;
    depth_video.muted = true;
    depth_video.src = 'data/depth.mp4';
    depth_video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    depth_video.setAttribute( 'playsinline', 'playsinline' );
    depth_video.setAttribute( 'muted', 'muted' );
    depth_video.play();

	const depth_texture = new THREE.Texture( depth_video );
    depth_texture.generateMipmaps = false;
    depth_texture.minFilter = THREE.NearestFilter;
    // depth_texture.maxFilter = THREE.NearestFilter;
    // depth_texture.format = THREE.RGBFormat;
　　　　// 動画に合わせてテクスチャを更新
    setInterval( function () {
      if ( depth_video.readyState >= depth_video.HAVE_CURRENT_DATA ) {
        depth_texture.needsUpdate = true;
      }
    }, 1000 / 24 );

	sphere.material.displacementMap = depth_texture;
	sphere.material.displacementScale = 0.001;
	sphere.material.displacementBias = -1.0;
	

	// loader.load( './data/' + depth_file, function ( depth ) {
	// 	depth.minFilter = THREE.NearestFilter;
	// 	depth.generateMipmaps = false;
	// 	sphere.material.displacementMap = depth;
	// 	sphere.material.displacementScale = 0.001;
	// 	sphere.material.displacementBias = -1.0;
	// } );

	// On load complete add the panoramic sphere to the scene
	// manager.onLoad = function () {

	// 	scene.add( sphere );

	// };

	scene.add( sphere );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.xr.enabled = true;
	renderer.xr.setReferenceSpaceType( 'local' );
	container.appendChild( renderer.domElement );

	// document.body.appendChild( VRButton.createButton( renderer ) );

	//GUI

	gui_folder.add(gui_control, 'scale', 0, 0.01).step(0.0001).listen().onChange(function(){sphere.material.displacementScale = gui_control.scale});
	gui_folder.add(gui_control, 'bias', -10, 10).step(0.001).listen().onChange(function(){sphere.material.displacementBias = gui_control.bias});
	gui_folder.add(gui_control, 'sphere_size', 1, 50).step(1.0).listen().onChange(function(){
																								sphere.scale.x = gui_control.sphere_size
																								sphere.scale.y = gui_control.sphere_size
																								sphere.scale.z = gui_control.sphere_size
																							});
	gui_folder.add(gui_control, 'camera_x', -5, 5).step(0.1).listen().onChange(function(){camera.position.x = gui_control.camera_x});
	gui_folder.add(gui_control, 'camera_y', -5, 5).step(0.1).listen().onChange(function(){camera.position.y = gui_control.camera_y});
	gui_folder.add(gui_control, 'camera_z', -5, 5).step(0.1).listen().onChange(function(){camera.position.z = gui_control.camera_z});

	window.addEventListener( 'resize', onWindowResize, false );
	
	container.addEventListener( 'pointerdown', onPointerDown, false );
	document.addEventListener( 'keydown', onKeydown, false );
	document.addEventListener( 'wheel', onMouseWheel, false );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	// renderer.setAnimationLoop( render );
	requestAnimationFrame( animate );
	update();

}

function update() {

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.MathUtils.degToRad( 90 - lat );
	theta = THREE.MathUtils.degToRad( lon );

	const x = 500 * Math.sin( phi ) * Math.cos( theta );
	const y = 500 * Math.cos( phi );
	const z = 500 * Math.sin( phi ) * Math.sin( theta );

	camera.lookAt( x, y, z );

	renderer.render( scene, camera );

}

function onPointerDown( event ) {

	if ( event.isPrimary === false ) return;

	isUserInteracting = true;

	onPointerDownMouseX = event.clientX;
	onPointerDownMouseY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

	document.addEventListener( 'pointermove', onPointerMove, false );
	document.addEventListener( 'pointerup', onPointerUp, false );

}

function onPointerMove( event ) {

	if ( event.isPrimary === false ) return;

	lon = ( onPointerDownMouseX - event.clientX ) * 0.1 + onPointerDownLon;
	lat = ( event.clientY - onPointerDownMouseY ) * 0.1 + onPointerDownLat;

}

function onPointerUp() {

	if ( event.isPrimary === false ) return;

	isUserInteracting = false;

	document.removeEventListener( 'pointermove', onPointerMove );
	document.removeEventListener( 'pointerup', onPointerUp );

}

function onMouseWheel(event){
	
	camera.getWorldDirection(direction);
	camera.position.addScaledVector(direction, event.deltaY/200);        
}

function onKeydown(event) {

	switch (event.keyCode){

		case 38: // """up"""
			onUp_key(event, camera, direction, camera_speed);
			break;
		case 40: // """down"""
			onDown_key(event, camera, direction, camera_speed);
			break;
		case 37: // """left"""
			onLeft_key(event, camera, direction, camera_speed);
			break;
		case 39: // """right"""
			onRight_key(event, camera, direction, camera_speed);
			break;
		case 32: // """space"""
			console.log(panoSphereGeo)
			console.log(panoSphereMat)
			console.log(sphere)
			console.log(lat, lon)
			console.log(camera.position)
	}
}
