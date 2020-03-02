# 2019-tfg-jorge_cruz

# WEEK 10

I moved my project to WebSim!

![img](/docs/alfombra_2.png)
![img](/docs/alfombra_1.png)
![img](/docs/pibot+numero.png)
![img](/docs/vista_pibot_numero.png)




# WEEK 9

I added a stop sign to gazebo's world and I've worked with the image that the pibot get and the color filters to detect the signal.

![img](/docs/alfombra/stop.png)
![img](/docs/alfombra/stop_pibot.png)
![img](/docs/alfombra/stop_pibot_filter.png)

This is a video example of how to PiBot robot stops when te stop signal is close to it.
[![click here](VIDEO)](https://youtu.be/1SdQ4zZTE1Y "PiBot stops")

This is the code I use:
```
cfg = config.load('/home/jorge/cuadernillos-kibotics/Kibotics.yml')
robot = PiBot(cfg)

def hay_stop():
    img = robot.dameImagen()

    rojo_bajo = np.array([0,0,0])
    rojo_alto = np.array([80, 80, 80])

    mask = cv2.inRange(img, rojo_bajo, rojo_alto)
    
    mask = cv2.erode(mask, None, iterations=2)
    mask = cv2.dilate(mask, None, iterations=2)
    
    cnts = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[-2]

    if len(cnts) > 0:
        c = max(cnts, key=cv2.contourArea)
        ((x, y), radius) = cv2.minEnclosingCircle(c)
        M = cv2.moments(c)
        area = M["m00"]
        
    print area    
    return area > 12523.5   

while True:
    
    if hay_stop():
        robot.parar()
    else:
        robot.avanzar(0.4)
```

I have improved the road filter:

![img](/docs/alfombra/road.png)
![img](/docs/alfombra/road_better_filter.png)

I have also made some changes in the Gazebo world:
* Add sky and clouds.
* Resize the carpet model.
* Add stop sign.



# WEEK 8

This week I've been working on a method to detect the road of the children's carpet.

First I have improved the gazebo world, illuminating it better.

![img](/docs/alfombra/captura_gazebo.png)

These are the steps I'm taking to detect the road.

* Get the image from the PiBot camera.
```
img = robot.dameImagen()
```
![img](/docs/alfombra/img.png)


* Convert RGB image to HSV
```
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
```
![img](/docs/alfombra/hsv.png)

* Filter HSV image by grey values
```
gris_bajo = np.array([50,40,40])
gris_alto = np.array([100, 255, 255])
mascara_gris = cv2.inRange(hsv, gris_bajo, gris_alto)
```
![img](/docs/alfombra/mascara_gris.png)

* Crop the image
```
crop_img = mascara_gris[180:300, 0:400]
```
![img](/docs/alfombra/crop.png)

I'm working to improve the color filter.

I show all the images whit this function: 
```
cv2.imshow("Nombre de la ventana", imagen)

#Salir con ESC
while(1):
    tecla = cv2.waitKey(5) & 0xFF
    if tecla == 27:
        break
 
cv2.destroyAllWindows()
```

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
