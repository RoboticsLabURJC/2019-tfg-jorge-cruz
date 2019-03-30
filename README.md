# 2019-tfg-jorge_cruz

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


[WORKING ON IT]

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
