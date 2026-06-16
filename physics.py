import numpy as np
import matplotlib.pyplot as plt

MU = 398600.4418  # earth gravitational parameter (G * M)

# satellite initial vectors
x = 7000.0
y = 0.0
vx = 0.0
vy = 7.5

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

#Earth
earth = plt.Circle(
    (0, 0), 
    EARTH_RADIUS, 
    fill=True, 
    color='blue', 
    alpha=0.5
)

ax.add_patch(earth)
ax.annotate(
    "Earth",
    (0, 0),
    xytext=(0, 0),
    textcoords="offset points"
)

# Orbit Trail
orbit_line, = ax.plot([], [], lw=1)

# Satellite Marker
satellite_dot, = ax.plot([], [], 'ko', markersize=5)

satellite_label = ax.annotate(
    "Satellite (LEO)", 
    (x, y),
    xytext=(10, 10),
    textcoords='offset points'
)

plt.show(block=False)

for step in range (steps):
    # calculate acceleration
    r = np.sqrt(x*x + y*y)
    ax_grav = -MU * x / r**3
    ay_grav = -MU * y / r**3
    vx += ax_grav * dt
    vy += ay_grav * dt
    x += vx * dt
    y += vy * dt
    xs.append(x)
    ys.append(y)
    
    if step % 10 == 0:
        orbit_line.set_data(xs, ys)
        satellite_dot.set_data([x], [y])
        satellite_label.xy = (x, y)
        fig.canvas.draw_idle()
        plt.pause(0.01)

plt.show()

