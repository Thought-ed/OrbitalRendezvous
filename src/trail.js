import * as THREE from "three";

export function createTrail(scene) {
	const trail = [];
	const geometry = new THREE.BufferGeometry();
	const material = new THREE.ShaderMaterial({
		transparent: true,
		vertexShader: `
        attribute float alpha;
        varying float vAlpha;

        void main() {
            vAlpha = alpha;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
		fragmentShader: `
        varying float vAlpha;

        void main() {
            gl_FragColor = vec4(0.0, 0.45, 0.92, vAlpha);
        }
    `,
	});
	const line = new THREE.Line(geometry, material);
	scene.add(line);

	return {
		trail,
		geometry,
		line,
	};
}

export function updateTrail(trailState, x, z, scale, maxTrail) {
	trailState.trail.push({ x, z });

	if (trailState.trail.length > maxTrail) {
		trailState.trail.shift();
	}

    const count = trailState.trail.length;
	const positions = new Float32Array(trailState.trail.length * 3);
    const alphas = new Float32Array(count);

	for (let i = 0; i < trailState.trail.length; i++) {
		positions[i * 3] = trailState.trail[i].x * scale;
		positions[i * 3 + 1] = 0
		positions[i * 3 + 2] = trailState.trail[i].z * scale;

        alphas[i] = count > 1 ? i / (count -1) : 1
	}

	trailState.geometry.setAttribute(
		"position",
		new THREE.BufferAttribute(positions, 3),
	);

    trailState.geometry.setAttribute(
        "alpha",
        new THREE.BufferAttribute(alphas, 1)
    )
	trailState.geometry.computeBoundingSphere();
}
