function addConsoleMethods(myRobot) {

    myRobot.printConsole = function(text) {
        postMessage({message: "print", function: "print", parameter: text});
    };

    myRobot.inputConsole = async function(text) {
        postMessage({message: "input", function: "input", parameter: text});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.console;
    };

    return myRobot;
}