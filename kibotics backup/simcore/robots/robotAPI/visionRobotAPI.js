export function getImage(cameraID) {
    /**
     * Returns a screenshot from the robot camera
     */
    if (!cameraID || (this.camerasData.length === 1) || (cameraID > this.camerasData.length - 1)) {
        return this.camerasData[0]['image'];
    } else {
        return this.camerasData[cameraID]['image'];
    }

}


export async function loadModel(){
    console.log('loading model...');
    var model =  await cocoSsd.load();
    console.log('model loaded');
    this.model = model;
    console.log(this.model);
}

export function imgMat_to_img(imgMat){
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

    var img = new Image();
    img.src = canvas.toDataURL();

    return img;
}

export function colorSemaforo(img){
    let src = cv.imread(img);
    /* ROJO */
    let lower = [100, 0, 0, 0];
    let higher = [255, 0, 10, 255];

    let dst = new cv.Mat();
    let low = new cv.Mat(src.rows, src.cols, src.type(), lower); //109x163
    let high = new cv.Mat(src.rows, src.cols, src.type(), higher);
    cv.inRange(src, low, high, dst);

    cv.imshow('outputCanvas',dst); // dst es una imagen binaria de pixeles negros y blancos (mi color filtrado).

    var area = cv.countNonZero(dst); // Me devuelve los pixeles blancos
    console.log(area);

    if(area>120){
        var color = "rojo";
    }else{
        var color = "verde-amarillo";
    }
    return color;
}

export async function dameObjetoCiudad(){
    var model = this.model;

    var imgMat = this.getImage();
    var img = this.imgMat_to_img(imgMat);


    var predictions = await model.detect(img);

    var objetoCiudad = {clase: null, probabilidad: null, area:null};
    if (predictions.length != 0){
             //console.log(predictions);
             objetoCiudad.probabilidad = predictions[0].score;
             objetoCiudad.clase = predictions[0].class;
             var bbox = predictions[0].bbox;
             objetoCiudad.area = (bbox[0]+bbox[3]);

             if(objetoCiudad.clase == "traffic light"){
                var color = colorSemaforo(img);
                objetoCiudad.clase = "traffic light " + color;
             }
    }

    return objetoCiudad;
}

function dame_centro(foto){

          // FILTRAR LA IMAGEN
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


          // X,Y,WIDTH,HEIGH
          let rect = new cv.Rect(32, 35, 65, 50); // RETOCAR ESTO. EL CENTRO TIENE QUE SER 33.
          dst = dst.roi(rect);

          cv.medianBlur(dst, dst, 5);

            /*
          // REPRESENTAR LA IMAGEN PROCESADA
          var myCanvas = document.getElementById('outputCanvas');
          var context = myCanvas.getContext("2d");

          var canvas = document.createElement('canvas');
          cv.imshow(canvas, dst);
          var ctx = canvas.getContext('2d');
          var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(image_data, 0, 0);
          var foto2 = new Image();
          foto2.src = canvas.toDataURL();
          context.drawImage(foto2, 0, 0, 300, 150); */

          // CALCULAR EL CENTRO DE LA CARRETERA
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

          return Moments.m10/Moments.m00;
}

export function dameCentro(){

    var imgMat = this.getImage();
    var img = this.imgMat_to_img(imgMat);

    var centro = dame_centro(img);

    return centro;
}

export function getColoredObject(colorAsString) {
    /**
     * This function filters an object in the scene with a given color passed as string, uses OpenCVjs
     * to filter by color and calculates the center of the object and the area.
     *
     * Returns center: CenterX (cx), CenterY (cy) and the area of the object detected in the image.
     */
    var image = this.getImage();
    var colorCodes = this.getColorCode(colorAsString);
    var binImg = new cv.Mat();
    var M = cv.Mat.ones(5, 5, cv.CV_8U);
    var anchor = new cv.Point(-1, -1);
    var lowThresh = new cv.Mat(image.rows, image.cols, image.type(), colorCodes[0]);
    var highThresh = new cv.Mat(image.rows, image.cols, image.type(), colorCodes[1]);
    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();

    cv.morphologyEx(image, image, cv.MORPH_OPEN, M, anchor, 2,
        cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue()); // Erosion followed by dilation

    cv.inRange(image, lowThresh, highThresh, binImg);
    cv.findContours(binImg, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    var contoursDict = {};
    var contoursArray = [];
    var nareas = 0;
    for (let i = 0; i < contours.size(); ++i) {
        let p1 = new cv.Point(0, 0);
        let p2 = new cv.Point(0, 0);
        var dict = {};

        if (contours.size() > 0) {
            nareas++;
            let stored = contours.get(i);
            var objArea = cv.contourArea(stored, false);

            if (objArea > 0) {
                let moments = cv.moments(stored, false);
                var cx = moments.m10 / moments.m00;
                var cy = moments.m01 / moments.m00;

                let square = cv.boundingRect(stored);

                p1 = new cv.Point(square.x, square.y);
                p2 = new cv.Point(square.x + square.width, square.y + square.height);

                dict = {
                    center: [parseInt(cx), parseInt(cy)],
                    area: parseInt(objArea),
                    corner1: [parseInt(p1.x), parseInt(p1.y)],
                    corner2: [parseInt(p2.x), parseInt(p2.y)]
                };
                contoursArray.push(dict);
            }
        }
    }
    contoursArray.sort(function (first, second) {
        return second.area - first.area;
    });
    contoursDict["areas"] = nareas;
    contoursDict["details"] = contoursArray;
    return contoursDict;
}

export function getObjectColorRGB(lowval, highval) {
    /**
     * This function filters an object in the scene with a given color, uses OpenCVjs to filter
     * by color and calculates the center of the object.
     *
     * Returns center: CenterX (cx), CenterY (cy) and the area of the object detected in the image.
     */

    if (lowval.length === 3) {
        lowval.push(0);
    }
    if (highval.length === 3) {
        highval.push(255);
    }
    var image = this.getImage();
    var binImg = new cv.Mat();
    var M = cv.Mat.ones(5, 5, cv.CV_8U);
    var anchor = new cv.Point(-1, -1);
    var lowThresh = new cv.Mat(image.rows, image.cols, image.type(), lowval);
    var highThresh = new cv.Mat(image.rows, image.cols, image.type(), highval);
    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();

    cv.morphologyEx(image, image, cv.MORPH_OPEN, M, anchor, 2,
        cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue()); // Erosion followed by dilation

    cv.inRange(image, lowThresh, highThresh, binImg);
    cv.findContours(binImg, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    if (contours.size() > 0) {

        let stored = contours.get(0);
        var objArea = cv.contourArea(stored, false);

        let moments = cv.moments(stored, false);
        var cx = moments.m10 / moments.m00;
        var cy = moments.m01 / moments.m00;

    }
    return {center: [parseInt(cx), parseInt(cy)], area: parseInt(objArea)};
}

export function getObjectColorPositionRGB(position, valuemin, valuemax) {
    let image = this.getObjectColorRGB(valuemin, valuemax);
    if (position === 'X') {
        return image.center[0];
    } else if (position === 'Y') {
        return image.center[1];
    } else {
        return image.area;
    }
}

export function getColorCode(color) {
    /**
     * This function returns binary values for the color if the color is on the
     * array of colors that robot can filter.
     */
    if (this.understandedColors[color]) {
        var low = this.understandedColors[color].low;
        var high = this.understandedColors[color].high;
        return [low, high];
    }
}

module.exports = {
    getImage,
    getColoredObject,
    getObjectColorRGB,
    getObjectColorPositionRGB,
    getColorCode,
    dameObjetoCiudad,
    loadModel,
    imgMat_to_img,
    dameCentro,
    colorSemaforo,
};