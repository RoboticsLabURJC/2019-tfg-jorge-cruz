import editor from './editor-methods.js'
import brains from '../../brains/brains-methods.js'


var editorRobot1 = 'a-pibot';
var editorRobot2 = 'a-car2';

$(document).ready(async () => {
    editor.setup();

    $("#cambtn").click(() => {
        editor.toggleCamera();
    });

    $("#spectatorCamera").click(() => {
        changeSpectatorCamera();
    });

    $("#runbtn").click(() => {
        /**
         * Function to execute when run button clicked, multiple options
         * supported:
         * - Creates thread for a robot if not exists and runs
         * - Stop thread for a robot if exists and running
         * - Resume thread for a robot if exists and not running
         */
        var iconRunBtn = document.querySelector("#runbtn").firstChild;
        if ($(iconRunBtn)[0].getAttribute("src") === "../assets/resources/play-icon.png") {
            $(iconRunBtn).attr("src", "../assets/resources/stop-icon.png");
        } else {
            $(iconRunBtn).attr("src", "../assets/resources/play-icon.png");
        }
        var code = editor.getCode();
        if (brains.threadExists(editorRobot1)) {
            if (brains.isThreadRunning(editorRobot1)) {
                Websim.simulation.pauseSimulation();
                brains.stopWorker(editorRobot1);
                //brains.pauseBrain(editorRobot1);
            } else {
                //brains.resumeBrain(editorRobot1, code);
                brains.resumeWorker(editorRobot1,code);
                Websim.simulation.playSimulation();
            }
        } else {
            //brains.runBrain(editorRobot1, code);
            brains.arrayBrainsStatus.push({id: editorRobot1, status: "RUNNING", blocking_instruction: false});
            brains.runWorkerBrain(editorRobot1,code);
        }
    });

    $('#resetRobot').click(() => {
        Websim.simulation.resetSimulation();
        var code = editor.getCode();
        brains.resetWorker(editorRobot1,code);
        let iconRunBtn = document.querySelector("#runbtn").firstChild;
        $(iconRunBtn).attr("src", "../assets/resources/play-icon.png");
    });

    // Init Websim simulator with config contained in the file passed
    await Websim.config.init(config_file);
    $("#buttons").show();
    if (typeof config_evaluator !== "undefined") {
        evaluators.runEvaluator([editorRobot1], config_evaluator);
    }
});
