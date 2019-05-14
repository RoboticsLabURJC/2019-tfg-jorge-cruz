# 2019-tfg-jorge_cruz

# WEEK 7

After some difficulties installing the packages and the necessary dependencies to run the simulations on my pc, I have managed to establish the connection between jupyter notebook and gazebo.

I get to instruct the Pibot to move forward, backward and to the sides.

I have created a new gazebo model with a real carpet where the PiBot will work.

![img](/docs/scene-alfombra.jpg)

With this simple code I get the image from the PiBot camera:

```
import sys
sys.path.insert(0, '/usr/local/lib/python2.7')
sys.path.insert(0, '/opt/jderobot/lib/python2.7/PiBot/gazebo')

from piBot import PiBot
import time
import random
import config
import cv2

# Cargamos el robot
cfg = config.load('/home/jorge/cuadernillos-kibotics/Kibotics.yml')
robot = PiBot(cfg)

img = robot.dameImagen()

cv2.imshow("img", img)
cv2.waitKey(0)

```

This is the image from the PiBot camera:

![img](/docs/camera-pibot.png)



# WEEK 6

In order to recreate the necessary framework to create a new practice on kibotics, i Installed the following software on my computer with Ubuntu 16.04 LTS:

* Gazebo 7.
* Jupyter notebook.
* JdeRobot source code.
    * git clone http://github.com/RoboticsURJC/JdeRobot.git
* ROS 
   * Following this tutorial: http://wiki.ros.org/ariac/Tutorials/SystemSetup
   
I tried to run an old .ipynb that I created on Kibotics, on Jupyter notebook in my computer, but some modules and packages dependencies failed.

![img](/docs/error_modulo.png)

Still working to find out how to connect Jupyter notebook with Gazebo


# WEEK 5

I have done the following issues:

* I have updated my computer's operating system.
* I have read some documentation about Jupyter kernel.
* I tried to use the Gazebo world that created in Gzweb, without success (working on it).

# WEEK 4
Learning how to create a new gazebo world. First, I istalled Gazebo and checked some tutorials. I started creating a texture from an image for use it as ground.

* I download an image from internet.
![img](/docs/MyImage.png)

* I follow [this tutorial](http://answers.gazebosim.org/question/4761/how-to-build-a-world-with-real-image-as-ground-plane/) to add this image as a texture in Gazebo
![img](/docs/alfombra.png)
![img](/docs/alfombra_vertical.png)

* Adjust the texture size and add the PiBot model.
![img](/docs/alfombra_pibot1.png)
![img](/docs/alfombra_pibot2.png)


# WEEK 3
I have installed the docker and the necessary dependencies to run the simulations on my local machine.

[![IMAGE ALT TEXT](/docs/lista_reproducción_docker.png)](https://www.youtube.com/playlist?list=PLH1XVnS33teVaV3bzCm5OtXfd_RqjqVBN "Lista Reproducción")

# WEEK 2
I continue solving examples of vision behavioral in robotics. Now I'll solve the exercise ***PiBot Follow Ball***. That's my solution:

<p align="center">
 Get images from the PiBot and apply color filters
 </p>
<p align="center"> 
  <img src="/docs/[FB]Filter.JPG"
</p>

<p align="center">
    Get the interets points of the image
</p>

<p align="center">
  <img src="/docs/[FB]Points.JPG">
</p>

Once we have the center on the object, we can work with the functions given in KibBotics.
* **dameObjeto()**: will return 2 data: center (coordinates (pixelX, pixelY) of the center) and area (number of pixels).
* **avanzar(v)**: Move in a straight line (v = m/s)
* **retroceder(v)**: Go back in a straight line (v = m/s)
* **girarIzquierda(w)**: Turn left on its axis (w = rads/s)
* **girarDerecha(w)**:  Turn right on its axis (w = rads/s)
* **parar()**: Stop the car

This is the result obtained:

[![IMAGE ALT TEXT](/docs/[FB]Iteration_1.JPG)](https://youtu.be/pLYk-796DTA "Follow Ball Video-1")
[![IMAGE ALT TEXT](/docs/[FB]Iteration_2.JPG)](https://youtu.be/luqyIFiPc6M "Follow Ball Video-2")

# WEEK 1
Let's start! I have started by checking some Python tutorials and familiarizing with the JdeRobot Kibotics interface. To that end, I have solved the ***Formula 1 Follow Line*** exercise. This is a short summary of how I solved it:

Get images from the car - Image filtered by red values

![img](/docs/[FL]Camera_RGB.png) ![img](/docs/[FL]Camera_HSV.png)

Get the interets points of the image

![img](/docs/[FL]Interets-Points.JPG) 

Once we have the center on the line, we can work with the functions given in KibBotics.
* **dameObjeto()**: will return 2 data: center (coordinates (pixelX, pixelY) of the center) and area (number of pixels).
* **avanzar(v)**: Move in a straight line (v = m/s)
* **retroceder(v)**: Go back in a straight line (v = m/s)
* **girarIzquierda(w)**: Turn left on its axis (w = rads/s)
* **girarDerecha(w)**:  Turn right on its axis (w = rads/s)
* **parar()**: Stop the car

This is the result obtained:

[![IMAGE ALT TEXT](/docs/[FL]Video.JPG)](https://youtu.be/x7tjk7Ptbkc "Follow Line Video")
