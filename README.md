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
    
    # Cargamos el robot
    f1 = F1()
        
    CENTRO_X = 320
    MARGEN = 20 # píxeles
    
    def get_centro():
        centro = f1.dameObjeto()[0]
        centro_x = centro[0]
        centro_y = centro[1]
        return centro_x,centro_y
    
    def estoy_izda(posx):
        return posx>CENTRO_X+MARGEN
    
    def estoy_dcha(posx):
        return posx<CENTRO_X-MARGEN

    def calcular_angulo(posx):
        c = float(120)
        a = float(abs(posx-CENTRO_X))
        angulo_grados = math.atan(a/c)
        angulo_radianes = (angulo_grados*math.pi)/180
        print 'GIRO: ', angulo_radianes
        return 6*angulo_radianes

    def comprobar_posicion(posx):
        if estoy_izda(posx):
            print 'Me estoy yendo a la izda'
            giro = calcular_angulo(posx)
            f1.girarIzquierda(giro)
            f1.avanzar(0.5)
        elif estoy_dcha(posx):
            print 'Me estoy yendo a la dcha'
            giro = calcular_angulo(posx)
            f1.girarDerecha(giro)
            f1.avanzar(0.5)
        else:
            print 'Estoy centrado'
            f1.avanzar(0.5)
        
    while True:        
        centro_actual = get_centro()
        print centro_actual
        comprobar_posicion(centro_actual[0])
        
        time.sleep(2)

```

[Still working on it]
