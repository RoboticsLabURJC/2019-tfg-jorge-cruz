# 2019-tfg-jorge_cruz

# WEEK 1
Let's start! I have started by checking some Python tutorials and familiarizing with the JdeRobot Academy interface. To that end, I have solved the Follow Line exercise. This is a short summary of how I solved it:

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
[Still working on it]
