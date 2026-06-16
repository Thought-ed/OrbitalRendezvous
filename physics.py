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

plt.plot(xs, ys)

for step in range (steps):
    # calculate acceleration
    r = np.sqrt(x*x + y*y)
    ax = -MU * x / r**3
    ay = -MU * y / r**3
    vx += ax * dt
    vy += ay * dt
    x += vx * dt
    y += vy * dt
    xs.append(x)
    ys.append(y)
    
    if step % 30 == 0:
        # plotting
        plt.clf()
        plt.plot(xs, ys)

        # earth display
        earth = plt.Circle(
            (0, 0), 
            EARTH_RADIUS, 
            fill=True, 
            color='blue', 
            alpha=0.5
    )
        plt.annotate(
            "Earth",
            (0, 0),
            xytext=(0, 0),
            textcoords="offset points"
        )

        # satellite display
        plt.scatter(x, y, s=100, c='black')
        plt.annotate(
            "Satellite (LEO)", 
            (x, y),
            xytext=(10, 10),
            textcoords = 'offset points'
            )
    
        plt.gca().add_patch(earth)    
        plt.gca().set_aspect('equal')    
        plt.xlim(-10000, 10000)
        plt.ylim(-10000, 10000)

        plt.xlabel('x (km)')
        plt.ylabel('y (km)')
        plt.title('OrbitalRendezvous Simulation (But just one for now)')

        plt.pause(0.01)


plt.legend()
plt.show()

