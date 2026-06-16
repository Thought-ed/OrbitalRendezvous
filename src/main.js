import * as THREE from 'three';

const scale = 0.01; // 1 unit = 100 km

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near clip
    100000 // far clip
);
camera.position.z = 20000 * scale;


const renderer = new THREE.WebGLRenderer();
renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);



// Geometries

// Earth
const earthGeometry = new THREE.SphereGeometry(
    6378 * scale,
    32,
    32
);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x80BCFF});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

// Lil Sputnik
const satelliteGeometry = new THREE.SphereGeometry(
    1,
    16,
    16
);
const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);


// Positioning

satellite.position.set(
    7000 * scale,
    0,
    0
);

scene.add(earth);
scene.add(satellite);  

// Animation Loop
function animate() {

    requestAnimationFrame(animate);
    satellite.position.y += 0.05;

    renderer.render(
        scene,
        camera
    );
}

animate();