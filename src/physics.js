import {MU, EARTH_RADIUS, SCALE} from './constants.js';
const thrust = 0.0008

export function physicsStep(state, dt, input) {
    /// LEAPFROG INTEGRATION 

    // compute radius
    const r = Math.sqrt(state.x * state.x + state.y * state.y);

    // acceleration at current position
    const ax = -MU * state.x / (r * r * r);
    const ay = -MU * state.y / (r * r * r);

    // half-kick (velocity half-step)
    state.vx += 0.5 * ax * dt;
    state.vy += 0.5 * ay * dt;

    // drift (position full-step using updated velocity)
    state.x += state.vx * dt;
    state.y += state.vy * dt;

    // recompute radius at new position
    const r2 = Math.sqrt(state.x * state.x + state.y * state.y);

    // acceleration at new position
    const ax2 = -MU * state.x / (r2 * r2 * r2);
    const ay2 = -MU * state.y / (r2 * r2 * r2);

    // second half-kick
    state.vx += 0.5 * ax2 * dt;
    state.vy += 0.5 * ay2 * dt;

}