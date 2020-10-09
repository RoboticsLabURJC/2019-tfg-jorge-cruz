class RobotIWW {
    constructor(robotId) {
        this.finished = {status: false};
        this.myRobotID = robotId;
        this.sensors = {
            velocity: {x: 0, y: 0, z: 0, ax: 0, ay: 0, az: 0},
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0},
            distanceArray: 10,
            object: 0,
            camera: [],
            console: "",
            objetoCiudad: {clase:null, probabilidad:null},
            centro: 0,
        };
        this.handlerMessages(this.finished, this.sensors, this);
    }

    handlerMessages(finished, sensors) {
        onmessage = function (e) {
            switch (e.data.message) {
                case "finished":
                    break;
                case "sensor":
                    if (e.data.function === "getV" || e.data.function === "getW" || e.data.function === "getL") {
                        sensors.velocity = e.data.parameter;
                    } else if (e.data.function === "getDistance" || e.data.function === "getDistances") {
                        sensors.distanceArray = e.data.parameter;
                    } else if (e.data.function === "getPosition") {
                        sensors.position = e.data.parameter;
                    } else if (e.data.function === "getRotation") {
                        sensors.rotation = e.data.parameter;
                    }
                    break;
                case "camera":
                    sensors.object = e.data.parameter;
                    break;
                case "image":
                    sensors.camera = e.data.parameter;
                    break;
                case "input":
                    sensors.console = e.data.parameter;
                    break;
                case "stopping_code":
                    var threadWorker = worker.threadsWorker.find((threadsWorker) => threadsWorker.id === e.data.robotID);
                    threadWorker.running = false;
                    break;
                case "resume_code":
                    var code = cleanCode(e.data.code);
                    code = 'async function myAlgorithm(){\n' + code + '\n}\nmyAlgorithm();';
                    var threadsWorker = worker.threadsWorker.find((threadsWorker) => threadsWorker.id === e.data.robotID);
                    if (code === threadsWorker.codeRunning) {
                        threadsWorker.running = true;
                    } else {
                        clearTimeout(threadBrain.iteration);
                        console.log("Worker closed");
                        self.close();
                    }
                    break;
                case "dameObjetoCiudad":
                    sensors.objetoCiudad = e.data.parameter;
                    break;
                case "loadModel":
                    break;
                case "dameCentro":
                    sensors.centro = e.data.parameter;
                    break;
                default:
                    console.log("Message received: " + e.data);
            }
            finished.status = true;
        }
    }
}
