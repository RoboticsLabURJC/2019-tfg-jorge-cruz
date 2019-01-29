# 2019-tfg-jorge_cruz

# WEEK 1
Let's start! I have started by checking some Python tutorials and familiarizing with the JdeRobot Academy interface. To that end, I have solved the Follow Line exercise. This is a short summary of how I solved it:

Getting images from the car:

![img](/docs/[FL]Camera_RGB.png)

Transform RGB image to HSV:

![img](/docs/[FL]Camera_HSV.png)

```
# Implement execute method
def execute(self):
    print('Iteración')
    img_RGB = self.getImage() # Obtener imagen
    self.set_color_image(img_RGB) # Imprimir imagen RGB
    img_HSV = cv2.cvtColor(img_RGB,cv2.COLOR_RGB2HSV) # Pasar de RGB a HSV
    
    value_min_HSV = np.array([0, 235, 60])
    value_max_HSV = np.array([180, 255, 255])
    image_HSV_filtered = cv2.inRange(img_HSV, value_min_HSV, value_max_HSV)
    print(image_HSV_filtered)
    self.set_threshold_image(image_HSV_filtered) # Imprimir imagen HSV
    
    image_HSV_filtered_Mask = np.dstack((image_HSV_filtered))
    print(image_HSV_filtered_Mask)

    size = image_HSV_filtered_Mask.shape
    print(size)
    
fl.setExecute(execute)
````
