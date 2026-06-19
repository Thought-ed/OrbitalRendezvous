import { input, rotspeed, thrust } from "./constants";

export function initializeControls() {
	window.addEventListener("keydown", (e) => {
		if (e.key == "w") input.w = true;
		if (e.key == "a") input.a = true;
		if (e.key == "s") input.s = true;
		if (e.key == "d") input.d = true;
	});

	window.addEventListener("keyup", (e) => {
		if (e.key == "w") input.w = false;
		if (e.key == "a") input.a = false;
		if (e.key == "s") input.s = false;
		if (e.key == "d") input.d = false;
	});
}
export function applyControls(state, dt) {
	const sat = state.satellite;

	// rotation is visual only (optional)
	const torque = rotspeed * dt;

	if (input.a) sat.omega += torque;
	if (input.d) sat.omega -= torque;

	// damping
	sat.omega *= Math.exp(-0.8 * dt);

	const maxOmega = 2.5;
	sat.omega = Math.max(-maxOmega, Math.min(maxOmega, sat.omega));
	sat.angle += sat.omega * dt;

	const vMag = Math.sqrt(sat.vx * sat.vx + sat.vz * sat.vz);

	const dirX = Math.sin(sat.angle);
	const dirZ = Math.cos(sat.angle);

	if (input.s) {
		sat.vx += dirX * thrust;
		sat.vz += dirZ * thrust;
	}

	if (input.w) {
		sat.vx -= dirX * thrust;
		sat.vz -= dirZ * thrust;
	}
}
