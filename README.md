# 2019-tfg-jorge_cruz

# WEEK 1
Let's start! I have started by checking some Python tutorials and familiarizing with the JdeRobot Kibotics interface. To that end, I have solved the Follow Line exercise. This is a short summary of how I solved it:

Getting images from the car:

![img](/docs/[FL]Camera_RGB.png)

Image filtered by red values:

![img](/docs/[FL]Camera_HSV.png)

```
def execute(self):
    print('Iteración')
    #self.motors.sendV(5)
    img_RGB = self.getImage() # Obtener imagen
    img_HSV = cv2.cvtColor(img_RGB,cv2.COLOR_RGB2HSV) # Pasar de RGB a HSV
    
    value_min_HSV = np.array([0, 235, 60])
    value_max_HSV = np.array([180, 255, 255])
    image_HSV_filtered = cv2.inRange(img_HSV, value_min_HSV, value_max_HSV) # Imagen en Blanco y Negro
    self.set_threshold_image(image_HSV_filtered) # Imprimir imagen Filtrada
   
    # Crear una máscara (Quedarnos solo con la línea ¿?).
    image_HSV_filtered_Mask = np.dstack((image_HSV_filtered, image_HSV_filtered, image_HSV_filtered))
    self.set_threshold_image(image_HSV_filtered_Mask)
    
    # Obtener los píxeles donde cambia de tono

    size = image_HSV_filtered_Mask.shape
    print(size)

fl.setExecute(execute)

````
VERSION 1. It works at a constant speed and very slow
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
        c = float(120)
        desviation = float(abs(x-CENTER_X))
        degrees = math.atan(desviation/c)
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
