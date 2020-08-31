
// Tutorial: https://bensonruan.com/handwritten-digit-recognition-with-tensorflow-js/
let model;

//-------------------------------------
// loader for cnn model
//-------------------------------------
async function loadModel() {
  console.log("model loading..");

  // clear the model variable
  model = undefined;
  
  // load the model using a HTTPS request (where you have stored your model files)
  model = await tf.loadLayersModel("models/model.json");
  
  console.log("model loaded..");
}

loadModel();

//-----------------------------------------------
// preprocess the canvas
//-----------------------------------------------
function preprocessCanvas(image) {
	// resize the input image to target size of (1, 28, 28)
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([28, 28])
		.mean(2)
		.expandDims(2)
		.expandDims()
		.toFloat();
	// console.log(tensor.shape);
	return tensor.div(255.0);
}

//--------------------------------------------
// predict function 
//--------------------------------------------
$("#predict-button").click(async function () {
    // get image data from canvas
	var imageData = canvas.toDataURL();

	// preprocess canvas
	let tensor = preprocessCanvas(canvas);

	// make predictions on the preprocessed image tensor
	// precit = inferencia
	let predictions = await model.predict(tensor).data();

	// get the model's prediction results
	let results = Array.from(predictions);

	//console.log(results);
});
