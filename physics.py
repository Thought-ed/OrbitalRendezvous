import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

MU = 398600.4418  # earth gravitational parameter (G * M)

# satellite initial vectors
x = 7000.0
y = 0.0
vx = 0.0
vy = 7.546  # roughly circular LEO speed at 7000 km from Earth's center

# home characteristics
EARTH_RADIUS = 6378
# simulation settings
dt = 1.0
steps = 10000

xs = []
ys = []


# Figure Setup
fig, ax = plt.subplots(figsize=(8, 8))
ax.set_xlim(-10000, 10000)
ax.set_ylim(-10000, 10000)
ax.set_aspect('equal')

ax.set_xlabel('x (km)')
ax.set_ylabel('y (km)')
ax.set_title('OrbitalRendezvous Simulation (But just one for now)')

# home
earth = plt.Circle(
    (0, 0), 
    EARTH_RADIUS, 
    fill=True, 
    color='blue', 
    alpha=0.5
)
ax.add_patch(earth)
ax.annotate(
    "Home",
    (0, 0),
    xytext=(0, 0),
    textcoords="offset points"
)

# orbit trail
orbit_line, = ax.plot([], [], lw=1)

# satellite Marker
satellite_dot, = ax.plot([], [], 'ko', markersize=5)

satellite_label = ax.annotate(
    "Lil' Sputnik :D", 
    (x, y),
    xytext=(5, 5),
    textcoords='offset points',
    bbox=dict(boxstyle='round', facecolor='white', alpha=0.6)
    
)

# telemetry box
telemetry = ax.text(
    0.02, 0.02, '',    
    transform=ax.transAxes, 
    fontsize=10,
    verticalalignment='bottom',
    bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8)
)

def physics_step():
    global x, y, vx, vy
    r = np.sqrt(x*x + y*y)
    ax_grav = -MU * x / r**3
    ay_grav = -MU * y / r**3
    vx += ax_grav * dt
    vy += ay_grav * dt
    x += vx * dt
    y += vy * dt
    xs.append(x)
    ys.append(y)

    #telemetry
    altitude = r - EARTH_RADIUS
    speed = np.sqrt(vx**2 + vy**2)
    telemetry.set_text(
        f'Altitude: {altitude:.1f} km\n'
        f'Speed: {speed:.1f} km/s\n'
        f'Position: ({x:.1f}, {y:.1f}) km\n'
        f'Velocity: ({vx:.2f}, {vy:.2f}) km/s'
    )

def update(frame):

    for _ in range(10):  # increase this for faster simulation
        physics_step()
    orbit_line.set_data(xs[-1200:], ys[-1200:])
    satellite_dot.set_data([x], [y])
    satellite_label.xy = (x, y)

    return orbit_line, satellite_dot, satellite_label, telemetry


ani = FuncAnimation(
    fig,
    update,
    interval = 16.67,
    frames=steps,
    blit=True,
    repeat=False
)

plt.show()
