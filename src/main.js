import * as THREE from 'three';
import { Text } from 'troika-three-text'

// functions import
import { createScene } from './scene.js';
import { physicsStep } from './physics.js';
import { Satellite } from './satellite.js';
import { MU, EARTH_RADIUS, SCALE } from './constants.js';
import { computeTelemetry } from './telemetry.js';
import { TechnicolorShader } from 'three/examples/jsm/Addons.js';


const altitudeEl = document.getElementById("altitude")
const velocityEl = document.getElementById("velocity")
const energyEl = document.getElementById("energy")
const momentumEl = document.getElementById("momentum")
const periapsisEl = document.getElementById("periapsis")
const apoapsisEl = document.getElementById("apoapsis")
const periodEl = document.getElementById("period")
const vspeedEl = document.getElementById("vspeed")


const {
    renderer,
    camera,
    scene,

} = createScene(SCALE);

// Sputnik Physics and Mesh join
const lilSputnik =
    new Satellite(
        EARTH_RADIUS + 500, // x
        0, // y
        0, // vx
        8.15 // vy
    );

const satelliteMesh =
    new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );



scene.add(satelliteMesh)


function addText() {
    const text = new Text()
    text.text = "Lil' Sputnik :D"
    text.fontSize = 8

    text.font = './fonts/Roboto_Mono/RobotoMono-Regular.ttf';    
    text.position.set(5, 5.2, 0)
    text.renderOrder = 999;
    text.material.depthTest = false;
    text.material.depthWrite = false;

    text.sync();
    satelliteMesh.add(text)
}

addText()

// orbital trail
const trail = []
const MAX_TRAIL = 2500
const trailGeometry = new THREE.BufferGeometry
const trailMaterial = new THREE.LineBasicMaterial({ color: 0x0073EB })
const trailLine = new THREE.Line(trailGeometry, trailMaterial);
scene.add(trailLine);


function animate() {
    requestAnimationFrame(animate);

    const dt = 0.1;      // smaller timestep
    const steps = 10;    // 10 substeps per frame
    const timescale = 3

    for (let i = 0; i < steps; i++) {
        physicsStep(lilSputnik, dt * timescale);
    }

    trail.push({ x: lilSputnik.x, y: lilSputnik.y });

    if (trail.length > MAX_TRAIL) {
        trail.shift();
    }

    satelliteMesh.position.set(
        lilSputnik.x * SCALE,
        lilSputnik.y * SCALE,
        0
    );

    const positions = new Float32Array(trail.length * 3);

    for (let i = 0; i < trail.length; i++) {
        positions[i * 3] = trail[i].x * SCALE;
        positions[i * 3 + 1] = trail[i].y * SCALE;
        positions[i * 3 + 2] = 0;
    }

    trailGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    trailGeometry.computeBoundingSphere();

    const t = computeTelemetry(lilSputnik);

    altitudeEl.textContent = `${t.altitude.toFixed(2)}km`;
    velocityEl.textContent = `${t.speed.toFixed(4)}km/s`;
    energyEl.textContent = `${t.energy.toFixed(3)} km²/s²`;
    momentumEl.textContent = `${t.momentum.toExponential(3)} km²/s`;
    periapsisEl.textContent = `${t.periapsis.toFixed(3)} km`;
    apoapsisEl.textContent = `${t.apoapsis.toFixed(3)} km`;
    periodEl.textContent = `${t.period.toFixed(3)} units (dt)`;
    vspeedEl.textContent = `${t.vspeed.toFixed(3)} km/s`;



    renderer.render(
        scene,
        camera
    );

}

animate()