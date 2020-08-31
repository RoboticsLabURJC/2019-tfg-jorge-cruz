# Ejercicio 5 - ¡Sigue la pelota, PiBot!

<img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_opencv_logo.png' %}" width=200px>

## 1. Visión artificial. Qué difícil... ¿O no?

En las prácticas anteriores has aprendido cómo ordenar al robot distintos movimientos, e incluso has conseguido programar un comportamiento complejo en base la información obtenida por sensores como el ultrasonidos o el infrarrojo. En esta práctica vamos a utilizar el más potente de los sensores que puede llevar un robot, ya que al igual que nosotros, la vista es el sentido que más utilizamos y que más información nos ofrece ¡Vamos a intentar aprender como funciona la **visión** en un robot!

Esta práctica se basa en la **Visión artificial**, que no es más, ni menos, que una rama de la inteligencia artificial enfocada al procesamiento de imágenes digitales con el fin de obtener información relevante de las mismas para realizar una tarea concreta.

<img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_deep_learning.png' %}">

En robótica el procesamiento de imágenes digitales es vital para poder llevar a cabo un montón de tareas diferentes como que el robot pueda situarse en un entorno determinado, pueda reconocer objetos e interactuar con ellos, reconocer personas, peligros e incluso... ¡seguir una pelota!

 Pero... ¿Qué es una **imagen digital**?


 ## 2 - Imágenes, imágenes, imágenes...

Todos sabemos qué es una imagen, ¿verdad? Pero, ¿cuánto sabes sobre ellas?. Sabrias responder preguntas como: ¿qué es un **píxel**? o ¿cómo sabe un ordenador qué es el **color** rojo?



### 2.1 - Píxeles o elementos de la imagen

¿Qué es un **píxel**? Es la unidad mínima de información de una imagen digital. Imagina que eres un pintor que sólo sabe pintar puntitos de colores, ¿serías capaz de pintar un cuadro a base de puntos? Sí, ¿verdad? Pues piensa en un píxel como uno de esos puntitos.

¿No me crees? ¡Mira la siguiente imagen!

<img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_pixelart_mario.png' %}">

Aquí puedes ver a Mario representado por diferentes cuadraditos a los que podemos llamar píxeles (¡recuerda el símil del pintor!). Cada cuadradito tiene un color específico; por ejemplo la gorra y el mono son de color rojo, la camiseta de color verde y los zapatos de color azul.

Pues un píxel no es más que la "unidad de medida" mínima de una imagen digital, el cual representa un color. ¿A que es sencillo?

No te confíes ¡empiezan las mates!


### 2.2 - Colores

Ya sabemos qué son los **píxeles**: unidades mínimas de informaciñon de una imagen los cuales representan colores. Pero ¿qué es un **color** para un ordenador? Los ordenadores no son especialmente listos por sí mismos, sólo entienden números... No obstante nosotros, los humanos, hemos sabido inventar métodos
para que los ordenadores sepan hacer cosas más allá de operaciones matemáticas, por ejemplo, representar colores.

Como un ordenador sólamente entiende números, hemos convertido los colores en números. ¿Cómo? Muy sencillo. 

Imagina ahora que tienes tres lápices de colores: uno rojo, uno verde y otro azul e imagina que eres el pintor de antes, el cual sólo sabe dibujar puntos. Digamos que si pintas un punto de un color, a ese color le asignamos el número 1, mientras que si no pintas con él le asignamos el valor 0 y ¡siempre vamos en este orden! Rojo, verde y azul. Vamos a representar los colores como mezclas entre el rojo, el verde y el azul, como en la vida real; de tal modo que si pintas un punto de color rojo, a ese punto le asignaremos un valor de Rojo = 1, Verde = 0 y Azul = 0, es decir $(1,0,0)$.

Volviendo a la imagen de mario, tendríamos lo siguiente:

<div class="row" style="content: ""; clear: both; display: table">
  <div class="column" style="float:left; width: 50%;">
    <img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_mario_pixels.png' %}" height=300px style="width:100%">
  </div>
  <div class="column" style="float:left; width: 50%">
    <img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_mario_channels.png' %}" alt="" style="width:100%">
  </div>
</div>


Fácil, ¿verdad? Recapitulemos. 

Hemos dicho que las imágenes están formadas por unidades pequeñas de información llamadas **píxeles**, y que cada píxel tiene un **color** representado como tres números: uno para el rojo (R), otro para el verde (G) y otro para el azul (B). Podemos decir entonces que una imagen de color RGB, no es más que una matriz de tamaño nxmx3 donde __n__ es el numero de columnas, m el número de filas y 3 los canales de color R+G+B. Por ello, los píxeles se representan como coordenadas en esa matriz, de modo que si queremos el primer pixel de la imagen, tendremos que indicar al programa que queremos el píxel (0,0).



<div class="row" style="content: ""; clear: both; display: table">
  <div class="column" style="float:left; width: 50%; padding: 5px">
    <img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_RGB_channels_separation.png' %}" alt="" style="width:100%">
  </div>
  <div class="column" style="float:left; width: 50%; padding-top:10%">
    <img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_rgb_sum.jpeg' %}" alt="" style="width:100%">
  </div>
</div>


## 3 - Filtros de imagen

Ya sabemos de qué está compuesta una imagen. Ahora bien, ¿cómo obtenemos **información útil** de ellas para esta práctica con nuestro PiBot? Lo primero que debemos preguntarnos es: ¿qué quiero conseguir? La respuesta, en este caso es: que el PiBiot sea capaz de seguir una pelota de color naranja con la "vista". Habiendo contestado a esta pregunta se despeja la duda de qué parte de la imagen es la que nos interesa, la cual es aquella zona donde se encuentre la pelota naranja dentro de las imágenes que capte el PiBot.

¿Cómo hacemos esto? Con **filtros de color**.

Para aislar un objeto en una imagen, el método más sencillo es aplicar un filtro de color a la misma, de tal modo que el objeto quede aislado del resto de elementos de la imagen. En nuestro caso, queremos aislar una pelota de color naranaja del resto de la imagen por lo que tenemos que indicar al programa que sólo queremos que nos muestre aquellos píxeles que tengan un color (o un rango de colores) determinado, en nuestro caso el naranja.

<img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_giphy.gif' %}">


Como ya sabemos, el color viene determinado por 3 valores $(R,G,B)$, por lo que si queremos aislar el naranja, basta con decirle al programa que solo tome en cuenta los píxeles con valores RGB comprendidos entre (xx,xx,xx) y (xx,xx,xx) que corresponden a la gama de naranjas de la pelota, porque la cámara no capta la pelota con un color naranja uniforme, sino que la luz que incide sobre la pelota hace que tenga algunos lados más claros (aquellos donde le está dando la luz) y otros lados mas oscuros (donde se genera la sombra) por lo que para tener un aislamiento más robusto, es preferible indicar un rango de colores, que un color específico, ya que abarcas más píxeles y contemplas algunos cambios de iluminación.

Y hasta aquí la teoría sobre procesamiento de imagen ¿A que no ha sido tan duro?

¡Ahora empieza la práctica!

## 4 - Comportamiento "sigue pelota" basado en percepcion visual.

Como ya sabemos, el objetivo de esta práctica es conseguir que nuestro PiBot siga una pelota basándose en lo que "ve". En las prácticas anteriores ya has aprendido a trabajar con el movimiento del robot dándole instrucciones de avance, giro, retroceso, etc. Incluso has
aprendido a que se comporte de maneras diferentes según la información que le llegara de los sensores ¡ya eres todo un programador de robots!

### 4.1 - Algo de contexto y funciones útiles.

En esta práctica vamos a hacer algo similar, pero utilizando uno de los senores más potentes que tiene nuestro PiBot: su cámara.

Como ya sabes cómo funciona el PiBot y además acabas de aprender cómo funcionan las imágenes digitales, estás listo para mezclar ambas en un comportamiento muy chulo. Para realizar esta práctica tendrás que hacer uso de las siguientes funciones que te ofrece el PiBot:

* `dameObjeto()`: Esta función hará todo el trabajo sucio por ti, ya que es la que se encarga de hacer el filtro de color para aislar la pelota naranja y devolverá 2 números: centro y área.
    * centro: son las coordenadas (pixelX, pixelY) del centro de la pelota en la imagen.
    * area: es la superficie (numero de pixels) que ocupa la pelota dentro de la imagen.
    

<img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_coordenadas.png' %}">

* `girarIzquierda(vel)`: Esta función hará que el robot sobre sí mismo hacia la izquierda a la velocidad dada como parámetro (rad/s)

* `girarDerecha(vel)`: Esta función hará que el robot sobre sí mismo hacia la derecha a la velocidad dada como parámetro (rad/s)

* `avanzar(vel)`: Esta función hará avanzar al robot a una velocidad dada como parámetro (m/s)

* `retroceder(vel)`: Esta función hará retroceder al robot a una velocidad dada como parámetro (m/s)

Además se asume, que el tamaño de la imagen será siempre de ___ x ___ px.

### 4.2 - Intuición

Se espera que el robot pueda seguir la pelota utilizando las funciones arriba descritas. Una posible aproximación sería la siguiente; intentar mantener la pelota en el centro de la imagen en todo momento. Ya que conocemos el centro de la pelota (nos lo facilita la función `damePosicionDeObjetoDeColor()`) y el centro de la imagen de tamaño fijo (x/2 e y/2), podemos hacer que el robot gire en función de donde se encuentra con respecto al centro, es decir, si el centro de la pelota está a la derecha del centro de la imagen, corregiremos con un giro hacia la izquierda, y viceversa.

Además para que no se nos escape la pelota si se aleja mucho, podemos utilizar el área que nos facilita dicha función para saber si la pelota se aleja o se acerca a nosotros en función de si el área crece o decrece.

<img src="{% static 'python/sigue_pelota_picam/img/sigue_pelota_picam_follow.gif' %}">


Esto es solo una de las posibles soluciones, puedes seguir con esta idea, o ¡poner a prueba tu creatividad desarrollando un algoritmo nuevo!

**NOTA IMPORTANTE**: Debido al estado de alfa de la aplicación JdeRobot-Kids, las funciones de movimiento del robot real: `avanzar`, `retroceder`, `girarIzquierda`, `girarDerecha` no implementan velocidad, por lo que el robot siempre irá a velocidad constante. En el simulador sí la implementan, por lo que puedes probar ahí tu algoritmo antes de mandarlo al robot real. No obstante, el impacto para esta práctica no es muy grande, ya que puedes mover la pelota más lentamente cuando pruebes tu algoritmo en el PiBot real.
Esto se solucionará en versiones posteriores de la aplicación.


### 4.3 - Requisitos de la práctica.

Se pide que implementes un algoritmo en el área indicada en la siguiente celdilla, que permita al robot seguir la pelota de forma autónoma utilizando las funciones arriba indicadas tanto en entorno simulado, como con el robot PiBot real (si dispones de uno). 

Se permiten realizar ajustes para probar el algoritmo en las diferentes plataformas.

