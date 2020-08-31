// Tutorial: https://www.youtube.com/watch?v=nCrQ1A2BEZ0
'use strict';

const video = document.getElementById('video');
const vendorUrl = window.URL || window.webkitURL;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvas_result = document.getElementById('resultado');
const ctx_result = canvas_result.getContext('2d');
const centerX = canvas_result.width/2;

const continuous = document.getElementById("Continuous");
const capture = document.getElementById("Capture");
const start_predict = document.getElementById("Start_Predict");


var estado = null;

(function displayvideo (){

    navigator.getMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMeida ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

    navigator.getMedia({
        video:true,
        audio: false
    }, function(stream) {
        video.srcObject = stream;
        video.play();
    }, function(error){
        // An error occurred
        // error.code
    });

})();

(function iniciar_bombillas(){

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.rect(75, 25, 50, 50);
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('1',75+12,25+40);


    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(175, 25, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('2',175+12,25+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(275, 25, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('3',275+12,25+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(75, 100, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('4',75+12,100+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(175, 100, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('5',175+12,100+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(275, 100, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('6',275+12,100+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(75, 175, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('7',75+12,175+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(175, 175, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('8',175+12,175+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(275, 175, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('9',275+12,175+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(175, 240, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('0',175+12,240+40);

})();

function crear_bombillas(resultado){

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.rect(75, 25, 50, 50);
    ctx_result.stroke();
    // Iluminación
    if(resultado == 1){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('1',75+12,25+40);


    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(175, 25, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 2){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('2',175+12,25+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(275, 25, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 3){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('3',275+12,25+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(75, 100, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 4){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('4',75+12,100+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(175, 100, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 5){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('5',175+12,100+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(275, 100, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 6){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('6',275+12,100+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(75, 175, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 7){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('7',75+12,175+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(175, 175, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 8){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('8',175+12,175+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(275, 175, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 9){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('9',275+12,175+40);

    // Cuadrado
    ctx_result.beginPath();
    ctx_result.rect(175, 240, 50, 50);
    ctx_result.lineWidth = 5;
    ctx_result.strokeStyle = 'black';
    ctx_result.stroke();
    if(resultado == 0){
        ctx_result.fillStyle = 'yellow';
        ctx_result.fill();
    }
    // Numero
    ctx_result.font="30pt Verdana";
	ctx_result.fillStyle = "black";
    ctx_result.fillText('0',175+12,240+40);

}


async function getresults(){
    //console.log('procesado')

    // get image data from canvas
	var imageData = canvas.toDataURL(); // Guarda la imagen.

	// preprocess canvas
	let tensor = preprocessCanvas(canvas);

	// make predictions on the preprocessed image tensor
	// precit = inferencia
	let predictions = await model.predict(tensor).data();

	// get the model's prediction results
	let results = Array.from(predictions);

    // console.log('Este es el resultado:')
    //console.log(results);
    var max_valor = Math.max(results[0],
                         results[1],
                         results[2],
                         results[3],
                         results[4],
                         results[5],
                         results[6],
                         results[7],
                         results[8],
                         results[9]
                         )
    resultado = results.indexOf(max_valor);

	// Primero borro el resultado anterior
	ctx_result.clearRect(0, 0, canvas_result.width, canvas_result.height);
	//console.log(resultado);

	// ILUMINAR LA BOMBILLA ADECUADA

	crear_bombillas(resultado);
}

start_predict.addEventListener("click", function() {
    setInterval('getresults()',100);
});

continuous.addEventListener("click", function() {
    console.log('MODO CONTINUO');
    estado = 'continuo';
    (function draw_video(){
        context.drawImage(video,0,0,400,300);

          var imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
          var pixels = imgData.data;

            // Cambiar la imagen a blanco y negro.
            for (var i = 0; i < pixels.length; i += 4) {
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
            context.putImageData(imgData, 0, 0, 0, 0, 640, 480);

          // Crear un Bounding Box
          context.beginPath();
          context.rect(75, 25, 250, 250);
          context.lineWidth = 5;
          context.strokeStyle = 'green';
          context.stroke();

        if(estado == 'continuo'){
            setTimeout(draw_video,10,video,context,400,300);
        }
    })();
});

capture.addEventListener("click", function() {
    console.log('MODO CAPTURA');
    estado = 'captura';
    (function draw_capture(){
    context.drawImage(video, 0, 0, 400, 300);

    var imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    var pixels = imgData.data;

    for (var i = 0; i < pixels.length; i += 4) {
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
    context.putImageData(imgData, 0, 0, 0, 0, 400, 300);
    })();
});
