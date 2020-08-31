        <div id="ace">
        <script>
        const myCanvas = document.getElementById('myCanvas');
        const context = myCanvas.getContext("2d");

         async function dameObjetoCiudad(model,foto){
           var date1 = new Date();
           var objetoCiudad = {clase: null, probabilidad: null};
           var predictions = await model.detect(foto);
           var date2 = new Date();
           // console.log("Han pasado " + (date2.valueOf()-date1.valueOf())/1000/60*60000 + " milisegundos");
           if (predictions.length != 0){
             objetoCiudad.clase = predictions[0].class;
             objetoCiudad.probabilidad = predictions[0].score;
           }
           return objetoCiudad;
         }

         function maniobrar(foto){
          let lower = [50, 40, 40, 0];
          let higher = [100, 90, 255, 255];
          let src = cv.imread(foto);
          let dst = new cv.Mat();
          let low = new cv.Mat(src.rows, src.cols, src.type(), lower); //109x163
          let high = new cv.Mat(src.rows, src.cols, src.type(), higher);
          cv.inRange(src, low, high, dst);

          let M = cv.Mat.ones(5, 5, cv.CV_8U);
          let anchor = new cv.Point(-1, -1);
          cv.dilate(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
          cv.erode(dst, dst, M, anchor, 3, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

          let rect = new cv.Rect(45, 80, 70, 20);
          dst = dst.roi(rect);

          cv.medianBlur(dst, dst, 5);

          let src2 = dst;
          let dst2 = cv.Mat.zeros(src2.rows, src2.cols, cv.CV_8UC3);
          let contours = new cv.MatVector();
          let hierarchy = new cv.Mat();
          cv.findContours(src2, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
          let cnt = contours.get(0);

          let Moments = 0;
          if (typeof cnt !== 'undefined') {
            Moments = cv.moments(cnt, false);
          }else{
            Moments = 0;
          }

          //console.log(Moments.m10/Moments.m00);

          // CONVERTIR MAT* A IMAGEDATA
          var canvas = document.createElement('canvas');
          cv.imshow(canvas, dst);
          var ctx = canvas.getContext('2d');
          var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // CONVERTIR IMAGEDATA A IMAGEN
          var canvas2 = document.createElement('canvas2');
          var ctx2 = canvas.getContext('2d');
          canvas2.width = image_data.width;
          canvas2.height = image_data.height;
          ctx2.putImageData(image_data, 0, 0);

          var foto2 = new Image();
          foto2.src = canvas.toDataURL();

          //context.drawImage(foto2, 0, 0, 150, 100);
          return Moments.m10/Moments.m00;
         }

         async function conducir(){
           console.log('loading model...');
           const detectModel = await cocoSsd.load();
           console.log('model loaded');

           myRobot.move(0.4,0,0);

           while (true) {
            //OBTENER LA IMAGEN EN FORMA MAT*
            var imgMat = myRobot.getImage();

            // CONVERTIR MAT* A IMAGEDATA
            var canvas = document.createElement('canvas');
            cv.imshow(canvas, imgMat);
            var ctx = canvas.getContext('2d');
            var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // CONVERTIR IMAGEDATA A IMAGEN
            var canvas2 = document.createElement('canvas2');
            var ctx2 = canvas.getContext('2d');
            canvas2.width = image_data.width;
            canvas2.height = image_data.height;
            ctx2.putImageData(image_data, 0, 0);

            var foto = new Image();
            foto.src = canvas.toDataURL();


            var objetoCiudad = await dameObjetoCiudad(detectModel,foto);

            if (objetoCiudad.clase != null){
                 if(objetoCiudad.clase == "traffic light"){
                   alert('SEMAFORO!');
                   // console.log(objetoCiudad);
                 }else if(objetoCiudad.clase == "stop sign"){
                   alert('STOP!');
                   // console.log(objetoCiudad);
                   // this.move(0,0,0);
                 }else if(objetoCiudad.clase == "person"){
                   alert('PERSONA!');
                 }
            }

            /*
            var posicion = maniobrar(foto);
            console.log(posicion);
            if (posicion>28 & posicion<38){
              console.log('RECTO');
              myRobot.move(0.5,0,0)
            }else if (posicion>38 & posicion<58){
              console.log('Giro DERECHA');
              myRobot.move(0.4,-0.016,0)
            }else if (posicion<28 & posicion>8){
              console.log('Giro IZQUIERDA');
              myRobot.move(0.4,0.016,0);
            }else{
              console.log('NO DETECTO');
              myRobot.move(0.5,0,0)
            } */

            await sleep(0.25);
           }
         }

         conducir();
        </script>
        </div>