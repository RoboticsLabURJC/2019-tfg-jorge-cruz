## Ejercicio ChocaGira Ultrasonidos ##

En este ejercicio deberás programar nuestro robot **PiBot** para que sea capaz de deambular por una habitación sin chocarse con ningún obstáculo. El PiBot debe ser programado de forma que utilice sus *sensores* para obtener información del entorno continuamente, y sus *actuadores* para ejecutar las acciones necesarias para poder ir moviéndose por la habitación evitando los diferentes obstáculos, de acuerdo a la información obtenida por los sensores.

Concretamente, el programa debe hacer que el PiBot avance en línea recta hasta que se encuentre a poca distancia de chocar contra un obstáculo frontal. En ese momento, el programa debe hacer que el PiBot se detenga, retroceda durante unos instantes, gire a la izquierda una cantidad de grados *aleatoria*, y continúe avanzando en línea recta como al principio.

En una primera fase programarás el PiBot simulado en un mundo 3D, para poder ensayar haciendo cambios a tu programa hasta que consigas que deambule por la habitación evitando los obstáculos sin chocar. Tras completar con éxito la primera fase, estarás listo para probar tu programa en el robot PiBot real !!!

#### Sensores del PiBot a utilizar ####

Vamos a usar el sensor de Ultrasonidos (abreviado US) que tiene el PiBot en su parte frontal. Este sensor es capaz de detectar la presencia de un obstáculo que se encuentre enfrente del PiBot por medio de la emisión/detección de ondas de ultrasonidos. Para ello, en el programa debes llamar a siguiente función:

| Función               | Descripción                                                  |
| --------------------- | ------------------------------------------------------------ |
| **leerUltrasonido()** | Lee el sensor de US y nos devuelve un valor que representa la distancia (en metros) a un obstáculo que se encuentre enfrente del PiBot |

Los posibles valores que nos devuelve la función **leerUltrasonido()** se corresponden con diferentes distancias del PiBot con respecto al obstáculo que tiene enfrente. Por ejemplo:


| valor = 4.01                               | valor = 3.32                               | valor = 2.43                               | valor = 1.62                               | valor = 0.58                               |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| <img src="{% static 'python/choca_gira_us/img/choca_gira_distancia1.png' %}" | <img src="{% static 'python/choca_gira_us/img/choca_gira_distancia2.png' %}" | <img src="{% static 'python/choca_gira_us/img/choca_gira_distancia3.png' %}" | <img src="{% static 'python/choca_gira_us/img/choca_gira_distancia4.png' %}" | <img src="{% static 'python/choca_gira_us/img/choca_gira_distancia5.png' %}" |


#### Actuadores del PiBot a utilizar ####

Vamos a usar los motores que incorpora el PiBot (uno en cada rueda motriz) para hacer que se mueva según nuestras necesidades. Para ello, en el programa debes llamar a las siguientes funciones:

| Función                 | Descripción                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **avanzar(`v`)**        | Hace que el PiBot avance en línea recta con una velocidad lineal igual a `v` expresada en metros/segundo |
| **retroceder(`v`)**     | Hace que el PiBot retroceda en línea recta con una velocidad lineal igual a `v` expresada en metros/segundo |
| **girarIzquierda(`w`)** | Hace que el PiBot gire a la izquierda sobre su eje (sin avanzar) con una velocidad angular igual a `w` expresada en radianes/segundo |
| **girarDerecha(`w`)**   | Hace que el PiBot gire a la derecha sobre su eje (sin avanzar) con una velocidad angular igual a `w` expresada en radianes/segundo |

**NOTA:** Recordamos que 2&pi; radianes equivalen a 360 grados.

Estas funciones se corresponden con los siguientes comportamientos del PiBot:

| avanzar                                 | retroceder                                 | girarIzquierda                           | girarDerecha                              |
| --------------------------------------- | ------------------------------------------ | ---------------------------------------- | ----------------------------------------- |
| <img src="{% static 'python/choca_gira_us/img/choca_gira_avanzar.png' %}" | <img src="{% static 'python/choca_gira_us/img/choca_gira_retroceder.png' %}" | <img src="{% static 'python/choca_gira_us/img/choca_gira_girar_izquierda.png' %}" | <img src="{% static 'python/choca_gira_us/img/choca_gira_girar_derecha.png' %}" |


Disponemos también de una última función, no por ello menos importante:

| Función     | Descripción                                                  |
| ----------- | ------------------------------------------------------------ |
| **parar()** | Hace que el PiBot se detenga (si estaba avanzando, retrocediendo o girando) |


#### Pistas para resolver el ejercicio ####

- Debes hacer que tu programa capture la información de los sensores y, en función de esa información, realizar acciones utilizando los actuadores para que el PiBot se comporte de la forma deseada
- El punto anterior no debe hacerse una sola vez, sino de forma continua (varias veces por segundo) para que el piBot pueda ir moviéndose por la habitación sin chocar con ningún obstáculo
- Cuando el piBot reciba una orden de avanzar, retroceder o girar, continuará ejecutando dicha orden hasta que reciba otra orden (si la orden es la misma, continuará haciendo lo mismo que estaba haciendo)


### ¿Puedes conseguir que el PiBot se mueva por la habitación sin chocarse con los obstáculos? Inténtalo, es divertido! ###
