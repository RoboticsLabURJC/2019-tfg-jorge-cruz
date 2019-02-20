# 2019-tfg-jorge_cruz

# WEEK 2
I continue solving examples of vision behavioral in robotics. Now I'll solve the exercise ***PiBot Follow Ball***. That's my solution:

[WORKING ON IT]

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


***CODE***
```
%matplotlib inline

from f1 import F1
import time
import random
import math

if __name__ == "__main__":
    
    f1 = F1()
    
    CENTER_X = 328 # image size 640x480
    CENTER_Y = 362
    MARGIN = 40 # pixels
    
    def get_center():
        center = f1.dameObjeto()[0]
        center_x = center[0]
        center_y = center[1]
        return center_x,center_y
    
    def left(x):
        return x>CENTER_X+MARGIN
    
    def right(x):
        return x<CENTER_X-MARGIN
    
    def straight_speed(x,y):
        distance = math.sqrt(pow(x-CENTER_X,2)+pow(y-CENTER_Y,2))
        if distance <= 3:
            f1.avanzar(10)
        elif distance <= 6:
            f1.avanzar(8)
        elif distance <= 8:
            f1.avanzar(7)
        elif distance <= 10:
            f1.avanzar(6)
        elif distance <= 13:
            f1.avanzar(5)
        elif distance <= 15:
            f1.avanzar(4.5)
        elif distance <= 25:
            f1.avanzar(4)
        elif distance <= 35:
            f1.avanzar(3.5)
        elif distance <= 40:
            f1.avanzar(3)
        elif distance <= 45:
            f1.avanzar(2.5)
        else:
            f1.avanzar(2)
            
    def turn_speed(x):
        c = float(120)
        desviation = float(abs(x-CENTER_X))
        c = 2 # correction factor by testing
        if desviation <= 50:
            f1.avanzar(c*2)
        elif desviation <= 100:
            f1.avanzar(c*1.5)
        elif desviation <= 200:
            f1.avanzar(c*1)
        else:
            f1.avanzar(c*0.7)

    def get_angle(x):
        dist = float(120) # distance from (x_center,0) to (x_center,y_center)
        desviation = float(abs(x-CENTER_X))
        degrees = math.atan(desviation/dist)
        radians = (degrees*math.pi)/180
        c = 20 # correction factor by testing
        return c*radians

    def work(x,y):
        if left(x):
            turn = get_angle(x)
            f1.parar() # straighten steering wheel
            f1.girarIzquierda(turn)
            turn_speed(x)
        elif right(x):
            turn = get_angle(x)
            f1.parar() # straighten steering wheel
            f1.girarDerecha(turn)
            turn_speed(x)
        else:
            f1.parar() # straighten steering wheel
            straight_speed(x,y)
        
    while True:        
        center = get_center()
        x = center[0]
        y = center[1]
        work(x,y)

```
