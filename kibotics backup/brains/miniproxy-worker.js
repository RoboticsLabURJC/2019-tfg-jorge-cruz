const console = require('./robotAPIminiproxy/consoleRobotAPIminiproxy');

export async function reply(message, brains, myRobot){
/**
Miniproxy: To handler messages from worker and translate to HALapi
**/
  var worker = brains.getWorker(myRobot.myRobotID);
  switch (message.message) {
    case "lineal":
      eval("myRobot."+ message.function + "(" + message.parameter + ")");
      worker.postMessage({message:"finished"});
      break;
    case "move":
      eval("myRobot.move(" + message.v + ", " + message.w + ", " + message.h + ")");
      break;
    case "advanceTo":
      await eval("myRobot."+ message.function + "(" + message.parameter + "," + JSON.stringify(brains) + ")");
      worker.postMessage({message:"finished"});
      break;
    case "turnUpTo":
      await eval("myRobot."+ message.function + "(" + message.parameter + "," + JSON.stringify(brains) + ")");
      worker.postMessage({message:"finished"});
      break;
    case "land":
      await eval("myRobot."+ message.function + "(" + JSON.stringify(brains) + ")");
      worker.postMessage({message:"finished"});
      break;
    case "takeOff":
      await eval("myRobot."+ message.function + "(" + JSON.stringify(brains) +")");
      worker.postMessage({message:"finished"});
      break;
    case "sensor":
      let sensor = eval("myRobot."+message.function + "();");
      worker.postMessage({message:"sensor",function:message.function,parameter:sensor});
      break;
    case "camera":
      let camera = eval("myRobot." + message.function + "(\"" + message.color + "\");");
      worker.postMessage({message:"camera",function:message.function,parameter:camera});
      break;
    case "cameraRGB":
      let cameraRGB = myRobot.getObjectColorRGB(message.color[0],message.color[1]);
      worker.postMessage({message:"camera",function:message.function,parameter:cameraRGB});
      break;
    case "image":
      let image = myRobot.getImage(message.id);
      worker.postMessage({message:"image",function:message.function,parameter:image});
      break;
    case "upTo":
      await eval("myRobot."+ message.function + "(" + message.parameter + "," + JSON.stringify(brains) + ")");
      worker.postMessage({message:"finished"});
      break;
    case "downTo":
      await eval("myRobot."+ message.function + "(" + message.parameter + "," + JSON.stringify(brains) + ")");
      worker.postMessage({message:"finished"});
      break;
    case "coloredObject": 
      let imagePosition = myRobot.getColoredObject(message.color);
      let value = [imagePosition.center[0], imagePosition.center[1], imagePosition.area];
      worker.postMessage({message:"camera",function:message.function,parameter:value});
      break;
    case "print":
      if (message.function === "print") {
        console.printConsole(message.parameter);
      } else {
        eval("myRobot." + message.function + "(\"" + message.parameter + "\");");
      }
      break;
    case "input":
      if (message.function === "input") {
        let inputValue = await console.inputConsole(message.parameter, myRobot, brains, worker);
        worker.postMessage({message:"input", function:"input", parameter:inputValue});
      } else {
        await eval("myRobot." + message.function + "(\"" + message.parameter + "\");");
      }
      break;
    case "dameObjetoCiudad":
        let objetoCiudad = await myRobot.dameObjetoCiudad();
        worker.postMessage({message:"dameObjetoCiudad",parameter:objetoCiudad});
        break;
    case "loadModel":
        myRobot.loadModel();
        worker.postMessage({message:"loadModel"});
        break;
    case "dameCentro":
        let centro = myRobot.dameCentro();
        worker.postMessage({message:"dameCentro",parameter:centro});
        break;
    default:
      console.log("Message receive in proxy: " + message);
  }
}
