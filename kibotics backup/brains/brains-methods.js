const utils = require('../simcore/utils/index.js');
const miniproxy = require('./miniproxy-worker.js');
const sleep = utils.sleep;
const setIntervalSynchronous = utils.setIntervalSynchronous;

var brains = {};
brains.newCode;
brains.threadsBrains = [];
brains.workerActive = [];
brains.arrayBrainsStatus = [];
brains.reset = false;
brains.workers = [];

const PYTHON_WHILE = "while(true)";
const PYONBROWSER_WHILE = "while ( (__PyTrue__).__bool__ () === __PyTrue__)";
const START_USER_CODE = "// START USER CODE";
const END_USER_CODE = "// END USER CODE";

function getLoopEnd(loop) {
    let endWhile;
    for (var char = 0, ignore = -1; char < loop.length; char++) {
        if (loop[char] == '{') {
            // another JS sentence starting ({) found
            ignore += 1;
        } else if (loop[char] == '}') {
            if (ignore > 0) {
                // if another sentence starting was found
                // this (}) is not the end of the infinite loop
                ignore -= 1;
            } else {
                // end of infinite loop found
                endWhile = char;
                break;
            }
        }
    }
    if (endWhile + 1 < loop.length - 1) {
        console.log('Detectado código después del bucle infinito. Ese código se ignorará.')
        /*Swal.fire({
          type: 'info',
          text: 'Ese código no se ejecutará',
          title: 'Detectado código después del bucle infinito',
        });*/
    }
    return endWhile;
}


function cleanCode(code) {
    /* Remove anything subsequent to an infinite loop */
    if (code.split(PYTHON_WHILE).length <= 2 && code.indexOf(PYTHON_WHILE) != -1) {
        // only one infinite loop allowed
        var loop = code.split(PYTHON_WHILE)[1];
        let endWhile = getLoopEnd(loop);
        loop = loop.substring(0, endWhile + 1); // removing anything after end of loop
        // recovering the previous code and building the cleaned code
        var newCode = code.split(PYTHON_WHILE)[0] + PYTHON_WHILE + loop;
        return newCode;
    } else {
        return code;
    }
}

brains.createTimeoutBrain = (code, myRobot, id) => {
    var iterative_code, sequential_code;
    // SI+ Applications
    if (code.split(PYTHON_WHILE).length <= 2 && code.split(PYONBROWSER_WHILE).length <= 2) {
        // only one infinite loop allowed
        if (code.indexOf(PYTHON_WHILE) !== -1) {
            if (code.split(PYTHON_WHILE)[0] === "async function myAlgorithm(){\n") {
                sequential_code = null;
            } else {
                sequential_code = code.split(PYTHON_WHILE)[0] + '\n}\nmyAlgorithm();' // S
            }
            iterative_code = "async function myAlgorithm()" + code.split(PYTHON_WHILE)[1]; // I
            var pos = iterative_code.lastIndexOf('}');
            iterative_code = iterative_code.substring(0, pos) + '' + iterative_code.substring(pos + 1);
        } else if (code.indexOf(PYONBROWSER_WHILE) !== -1) {
            let start_general_code = code.split(START_USER_CODE)[0];
            let end_general_code = code.split(END_USER_CODE)[1];
            let user_code = code.split(START_USER_CODE)[1];
            user_code = user_code.split(END_USER_CODE)[0];
            if (code.split(PYONBROWSER_WHILE)[0] === "async function myAlgorithm(){\n") {
                sequential_code = null;
            } else {
                sequential_code = user_code.split(PYONBROWSER_WHILE)[0]
                sequential_code = start_general_code + sequential_code + end_general_code;
            }
            var loop = user_code.split(PYONBROWSER_WHILE)[1];
            let endWhile = getLoopEnd(loop);
            loop = loop.substring(0, endWhile + 1);
            iterative_code = start_general_code + loop + end_general_code;
        } else {
            sequential_code = code;
            iterative_code = null;
        }
        return setTimeout(async function iteration() {
            if (sequential_code != null) {
                await eval(sequential_code);
                sequential_code = null;
            }
            if (iterative_code != null) {
                await eval(iterative_code);
                var threadBrain = brains.threadsBrains.find((threadBrain) => threadBrain.id === id);
                var brainStatus = brains.getBrainStatus(threadBrain.id);
                if (brainStatus.status != "RELOADING") {
                    var t = setTimeout(iteration, 100);
                    threadBrain.iteration = t;
                    brainStatus.status = "RUNNING";
                } else {
                    while (brainStatus.blocking_instruction) {
                        await sleep(0.001);
                    }
                    brainStatus.status = "RUNNING";
                    if (brains.newCode) {
                        threadBrain.iteration = brains.createTimeoutBrain(brains.newCode, Websim.simulation.getHalAPI(brainStatus.id), brainStatus.id);
                    } else {
                        threadBrain.iteration = brains.createTimeoutBrain(code, Websim.simulation.getHalAPI(brainStatus.id), brainStatus.id);
                    }
                }
            }
        }, 100);
    } else {
        console.log('Error en el código.\nSólo puedes poner un bucle infinito.');
        /*Swal.fire({
          type: 'error',
          text: 'Modifica el código y vuelve a ejecutar',
          title: 'Error en el código.\nSólo puedes poner un bucle infinito',
        });*/
        return undefined;
    }
};

brains.runBrain = (robotID, code) => {
    /**
     * Function to create a "thread" and execute UI code
     * also saves the "thread" on an array of running threadss
     *
     * @param {Object} myRobot RobotI object used to run code from UI
     */
    var brainStatus = brains.getBrainStatus(robotID);
    brainStatus.id = robotID;
    brainStatus.status = "RUNNING";
    code = cleanCode(code);
    code = 'async function myAlgorithm(){\n' + code + '\n}\nmyAlgorithm();';
    brains.threadsBrains.push({
        "id": robotID,
        "running": true,
        "iteration": brains.createTimeoutBrain(code, Websim.simulation.getHalAPI(robotID), robotID),
        "codeRunning": code
    });
};

brains.threadExists = (robotID) => {
    return brains.threadsBrains.find((threadBrain) => threadBrain.id == robotID);
};

brains.isThreadRunning = (robotID) => {
    /**
     * Function to check if a thread is running
     *
     * @param {string} threadID ID of the thread to check if running
     */
    var threadBrain = brains.threadsBrains.find((threadBrain) => threadBrain.id == robotID);
    return threadBrain.running;
};

brains.resumeBrain = (robotID, code) => {
    let brainStatus = brains.getBrainStatus(robotID);
    code = cleanCode(code);
    var threadBrain = brains.threadsBrains.find((threadBrain) => threadBrain.id == robotID);
    code = 'async function myAlgorithm(){\n' + code + '\n}\nmyAlgorithm();';
    if (threadBrain.codeRunning !== code) {
        brainStatus.status = "RELOADING";
        clearTimeout(threadBrain.iteration);
        brains.newCode = code; 
        if (!brainStatus.blocking_instruction) { 
            var myRobot = Websim.simulation.getHalAPI(robotID);
            myRobot.parar();
            threadBrain.iteration = brains.createTimeoutBrain(code, myRobot, robotID);
        }
    } else {
        brainStatus.status = "RUNNING";
    }
    threadBrain.running = true;
    threadBrain.codeRunning = code;
};

brains.resetBrain = (robotID, code) => {
    let brainStatus = brains.getBrainStatus(robotID);
    code = cleanCode(code);
    var threadBrain = brains.threadsBrains.find((threadBrain) => threadBrain.id == robotID);
    code = 'async function myAlgorithm(){\n' + code + '\n}\nmyAlgorithm();';
    brainStatus.status = "RELOADING";
    clearTimeout(threadBrain.iteration);
    brains.newCode = code;
    if (!brainStatus.blocking_instruction) {
        var myRobot = Websim.simulation.getHalAPI(robotID);
        myRobot.parar();
        threadBrain.iteration = brains.createTimeoutBrain(code, myRobot, robotID);
    }
    threadBrain.running = true;
    threadBrain.codeRunning = code;
};

brains.pauseBrain = (robotID) => {
    /**
     * Pause one thread running
     */
    let brainStatus = brains.getBrainStatus(robotID);
    brainStatus.status = "PAUSE";
    var threadBrain = brains.threadsBrains.find((threadBrain) => threadBrain.id === robotID);
    clearTimeout(threadBrain.iteration);
    threadBrain.running = false;
};

brains.runWorkerBrain = (robotID, code) => {
    /**
     * Function to create a webworker and send it user code
     *
     * @param {Object} myRobot RobotI object used to run code from UI
     */
    if (typeof (Worker) !== "undefined") {
        brains.threadsBrains.push({id: robotID, code: code, running: true});
        startWorker(robotID, code);
        brains.arrayBrainsStatus.push({id:robotID,status:"PAUSE",blocking_instruction:false});
    } else {
        console.log("Your browser does not support web workers");
    }
};

brains.stopWorker = (robotID) => {
    var threadBrain = brains.threadsBrains.find((threadBrain) => threadBrain.id === robotID);
    threadBrain.running = false;
    let brainStatus = brains.getBrainStatus(robotID);
    brainStatus.status="PAUSE";
};

brains.resumeWorker = (robotID, code) => {
    var threadBrain = brains.threadsBrains.find((threadBrain) => threadBrain.id === robotID);
    if (threadBrain.code !== code || !threadBrain.running) {
        let brainStatus = brains.getBrainStatus(robotID);
        brainStatus.status = "RELOADING";
        let worker = brains.getWorker(robotID);
        worker.postMessage({message: "resume_code", robotID: robotID, code: code});
        brains.removeWorker(robotID, worker);
        // brains.w = undefined;
        startWorker(robotID, code);
    } else if (brains.reset === true) {
        startWorker(robotID, code);
        brains.reset = false;
    }
    threadBrain.running = true;
    threadBrain.codeRunning = code;
};

brains.resetWorker = (robotID, code) => {
    let threadBrain = brains.threadsBrains.find((threadBrain) => threadBrain.id === robotID);
    let brainStatus = brains.getBrainStatus(robotID);
    brainStatus.status = "RELOADING";
    let myRobot = Websim.simulation.getHalAPI(robotID);
    myRobot.move(0, 0, 0);
    let worker = brains.getWorker(robotID);
    worker.postMessage({message: "resume_code", robotID: robotID, code: code});
    brains.removeWorker(robotID, worker);
    brains.reset = true;
    threadBrain.running = false;
    threadBrain.codeRunning = code;
};


async function startWorker(robotID, code) {
    let brainStatus = brains.getBrainStatus(robotID);
    while(brainStatus.blocking_instruction){
        await sleep(0.001);
    }
    var myRobot = Websim.simulation.getHalAPI(robotID);

    if (window.location.hostname === "localhost" && window.location.port === "8080") {
        brains.workers.push({id: robotID, worker: new Worker("../../brains/worker.js?host=local")});
    } else {
        brains.workers.push({id: robotID, worker: new Worker("../../../static/websim/Scratch-editor/build/worker.js?host=production")});
    }
    brainStatus.status="RUNNING";
    brains.workers[brains.workers.length-1].worker.postMessage({message: "user_code", robotID: robotID, code: code});
    brains.workers[brains.workers.length-1].worker.onmessage = function (e) {
        miniproxy.reply(e.data, brains, myRobot);
    }
}

brains.removeWorker = (robotID, worker) => {
    worker.terminate();
    brains.workers = [];
}

brains.showThreads = () => {
    /**
     * Function used for debugging, prints all threads data
     */
    brains.threadsBrains.forEach((threadBrain) => {
        console.log(threadBrain);
    })
};

brains.getBrainStatus = (robotID, brainArr=brains) => {
    var brain;
    brainArr.arrayBrainsStatus.forEach(element => {
        if (element.id === robotID) {
            brain = element;
        }
    });
    if (!brain) {
        return brainArr.arrayBrainsStatus[0];
    }
    return brain;
};

brains.getWorker = (robotID) => {
    var worker;
    brains.workers.forEach(element => {
        if (element.id == robotID) {
            worker = element.worker;
        }
    });
    if (!worker) {
        return worker;
    }
    return worker;
}

module.exports = brains;
