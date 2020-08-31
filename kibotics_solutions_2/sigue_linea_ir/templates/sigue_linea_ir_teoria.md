# Ejercicio Siguelínea Infrarrojos

En este ejercicio deberás programar nuestro robot **PiBot** para que sea capaz de seguir una línea negra pintada sobre un suelo blanco. El PiBot debe ser programado de forma que utilice sus *sensores* para obtener información del entorno continuamente, y sus *actuadores* para ejecutar las acciones necesarias para poder ir siguiendo el trazado de la línea de acuerdo a la información obtenida por los sensores.

En una primera fase programarás el PiBot simulado en un mundo 3D, para poder ensayar haciendo cambios a tu programa hasta que consigas que siga el trazado de la línea con facilidad. Tras completar con éxito la primera fase, estarás listo para probar tu programa en el robot PiBot real !!!

## Sensores del PiBot a utilizar

Vamos a usar los 2 sensores de Infrarrojos (abreviado IR) que tiene el PiBot en su parte frontal apuntando al suelo, uno en la parte izquierda y otro en la parte derecha. Estos sensores son capaces de detectar si el suelo es oscuro (negro) o claro (blanco) por medio de la emisión/detección de rayos infrarrojos. Para ello, en el programa debes llamar a siguiente función:

| Función                 | Descripción                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **leerIRSigueLineas()** | Lee los dos sensores de IR y nos devuelve un valor entre 0 y 3 |

El valor entre 0 y 3 que devuelve la función depende de las lecturas de los dos sensores de IR, de acuerdo a la siguiente tabla:

| lectura IR izquierdo | lectura IR derecho | valor de leerIRSigueLineas() |
| -------------------- | ------------------ | ---------------------------- |
| negro                | negro              | 0                            |
| negro                | blanco             | 1                            |
| blanco               | negro              | 2                            |
| blanco               | blanco             | 3                            |

Estos cuatro valores que nos devuelve la función `leerIRSigueLineas()` se corresponden con las siguientes situaciones del PiBot con respecto a la línea negra:


| valor = 0                                                    | valor = 1                                                    | valor = 2                                                    | valor = 3                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="{% static 'python/sigue_linea_ir/img/sigue_linea_ir_cero.png' %}"> | <img src="{% static 'python/sigue_linea_ir/img/sigue_linea_ir_uno.png' %}"> | <img src="{% static 'python/sigue_linea_ir/img/sigue_linea_ir_dos.png' %}"> | <img src="{% static 'python/sigue_linea_ir/img/sigue_linea_ir_tres.png' %}"> |


## Actuadores del PiBot a utilizar

Vamos a usar los motores que incorpora el PiBot (uno en cada rueda motriz) para hacer que se mueva según nuestras necesidades. Para ello, en el programa debes llamar a las siguientes funciones:

| Función                 | Descripción                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **avanzar(`v`)**        | Hace que el PiBot avance en línea recta con una velocidad lineal igual a `v` expresada en metros/segundo |
| **retroceder(`v`)**     | Hace que el PiBot retroceda en línea recta con una velocidad lineal igual a `v` expresada en metros/segundo |
| **girarIzquierda(`w`)** | Hace que el PiBot gire a la izquierda sobre su eje (sin avanzar) con una velocidad angular igual a `w` expresada en radianes/segundo |
| **girarDerecha(`w`)**   | Hace que el PiBot gire a la derecha sobre su eje (sin avanzar) con una velocidad angular igual a `w` expresada en radianes/segundo |

**NOTA:** Recordamos que $2\pi$ radianes equivalen a 360 grados.

Estas funciones se corresponden con los siguientes comportamientos del PiBot:

| avanzar                                                      | retroceder                                                   | girarIzquierda                                               | girarDerecha                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="{% static 'python/sigue_linea_ir/img/sigue_linea_ir_avanzar.png' %}"> | <img src="{% static 'python/sigue_linea_ir/img//sigue_linea_ir_retroceder.png' %}"> | <img src="{% static 'python/sigue_linea_ir/img//sigue_linea_ir_girar_izquierda.png' %}"> | <img src="{% static 'python/sigue_linea_ir/img//sigue_linea_ir_girar_derecha.png' %}"> |

Disponemos también de una última función, no por ello menos importante:

| Función     | Descripción                                                  |
| ----------- | ------------------------------------------------------------ |
| **parar()** | Hace que el PiBot se detenga (si estaba avanzando, retrocediendo o girando) |


## Pistas para resolver el ejercicio

- Debes hacer que tu programa capture la información de los sensores y, en función de esa información, realizar acciones utilizando los actuadores para que el PiBot se comporte de la forma deseada
- El punto anterior no debe hacerse una sola vez, sino de forma continua (varias veces por segundo) para que el piBot pueda ir siguiendo el trazado de la línea negra
- Cuando el piBot reciba una orden de avanzar, retroceder o girar, continuará ejecutando dicha orden hasta que reciba otra orden (si la orden es la misma, continuará haciendo lo mismo que estaba haciendo)


## ¿Puedes conseguir que el PiBot siga la línea negra? Inténtalo, es divertido!
