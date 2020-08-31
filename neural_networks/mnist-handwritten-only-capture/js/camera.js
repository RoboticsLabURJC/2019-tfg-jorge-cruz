console.log('Entro en el driver');

'use strict';

const video = document.getElementById('video');
const snap = document.getElementById("snap");
const canvas_camera = document.getElementById('canvas_camera');
const canvas_negativo = document.getElementById('canvas_negativo');
const errorMsgElement = document.querySelector('span#errorMsg');

const constraints = {
audio: false,
video: {
width: 800, height: 600
}
};

// Acceso a la webcam
async function init() {
try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
} catch (e) {
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
}
}
// Correcto!
function handleSuccess(stream) {
window.stream = stream;
video.srcObject = stream;
}
// Load init
init();

// DIBUJAR LA IMAGEN - CAPTURA

/* El método HTMLCanvasElement.getContext() retorna un contexto de dibujo en el lienzo, o null si el identificador del
contexto no está soportado.
canvas_camera es un lienzo de dibujo fijazo que expera que definamos su contexto de renderizado.
El elmento canvas está incialmente en blanco. */

var context = canvas_camera.getContext('2d');
var context2 = canvas_negativo.getContext('2d');


/* snap es el elemento HTML que está asociado al botón
.addEventListener está "esperando a que ese botón sea pulsado.
Cuando recibe esa orden ejecuta function(), que simplemente es .drawImage */

/* El método CanvasRenderingContext2D.drawImage() de la API Canvas 2D proporciona diferentes formas para dibujar
una imagen dentro de canvas.
void ctx.drawImage(image, dx, dy, dWidth, dHeight); */


snap.addEventListener("click", function() {
context.drawImage(video, 0, 0, 640, 480);
});

  context.beginPath();
  context.rect(188, 50, 200, 100);
  context.fillStyle = 'yellow';
  context.fill();
  context.lineWidth = 7;
  context.strokeStyle = 'black';
  context.stroke();

// IMAGEN FILTRADA

snap.addEventListener("click", function() {
context2.drawImage(video, 0, 0, 640, 480);
var imgData = context2.getImageData(0, 0, context2.canvas.width, context.canvas.height);
var pixels = imgData.data;

/* Los datos de una imagen forman una matriz de tipo rejilla donde a cada píxel le corresponden 4 valores. Cada uno de estos son los que a su vez se identifican con los valores R (rojo), G (verde), B (azul) y A (transparencia) de dicho píxel.
*/

for (var i = 0; i < pixels.length; i += 4) {
      /*
        if pixel = negro{
            transformar a blanco
        }else{
            poner en negro
        }
      */

      const margen = 50;
      if(pixels[i]>=0 & pixels[i]<=margen & pixels[i+1]>=0 & pixels[i+1]<=margen & pixels[i+2]>=0 & pixels[i+2]<=margen ){
          pixels[i] = 255; // rojo
          pixels[i + 1] = 255; // verde
          pixels[i + 2] = 255; // azul

      }else{
          pixels[i] = 0; // rojo
          pixels[i + 1] = 0; // verde
          pixels[i + 2] = 0; // azul
      }
}
// pone la imagen modificada en el canvas
context2.putImageData(imgData, 0, 0, 0, 0, 640, 480);
});

$("#snap").click(async function () {
    console.log('procesado')

    // get image data from canvas
	var imageData = canvas_negativo.toDataURL(); // Guarda la imagen.

	// preprocess canvas
	let tensor = preprocessCanvas(canvas_negativo);

	// make predictions on the preprocessed image tensor
	// precit = inferencia
	let predictions = await model.predict(tensor).data();

	// get the model's prediction results
	let results = Array.from(predictions);

	// display the predictions in chart
	$("#result_box").removeClass('d-none');
	displayChart(results);
	displayLabel(results);

	console.log(results);
});