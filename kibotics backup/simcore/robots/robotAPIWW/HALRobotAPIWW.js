function addHALMethods(myRobot) {
    myRobot.setV = function (v) {
        postMessage({message: "lineal", function: "setV", parameter: v});
    };

    myRobot.advance = function(linearSpeed) {
        this.setV(linearSpeed);
    };

    myRobot.avanzar = function(linearSpeed) {
        postMessage({message: "lineal", function: "setV", parameter: linearSpeed});
    };

    myRobot.move = function(v, w, h) {
        postMessage({message: "move", v: v, w: w * 10, h: h});
    };

    myRobot.getRotation = async function() {
        postMessage({message: "sensor", function: "getRotation"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.rotation;
    };

    myRobot.setW = function(w) {
        postMessage({message: "lineal", function: "setW", parameter: w * 10});
    };

    myRobot.setL = function(l) {
        postMessage({message: "lineal", function: "setL", parameter: l});
    };

    myRobot.getV = async function() {
        postMessage({message: "sensor", function: "getV"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.velocity;
    };

    myRobot.getW = async function() {
        postMessage({message: "sensor", function: "getW"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.velocity;
    };

    myRobot.getL = async function() {
        postMessage({message: "sensor", function: "getL"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.velocity;
    };

    myRobot.getDistance = async function() {
        postMessage({message: "sensor", function: "getDistance"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.distanceArray;
    };

    myRobot.getDistances = async function() {
        postMessage({message: "sensor", function: "getDistances"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.distanceArray;
    };

    myRobot.getPosition = async function() {
        postMessage({message: "sensor", function: "getPosition"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.position;
    };

    myRobot.readIR = async function() {
        let reqColor = "white";
        postMessage({message: "camera", function: "readIR", color: reqColor});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
        return this.sensors.object;
    };

    myRobot.avanzarHasta = async function(distance) {
        this.advanceTo(distance);
    };

    myRobot.advanceTo = async function(distance) {
        postMessage({message: "advanceTo", function: "advanceTo", parameter: distance});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
    };

    myRobot.upTo = async function(distance) {
        postMessage({message: "upTo", function: "upTo", parameter: distance});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
    };

    myRobot.downTo = async function(distance) {
        postMessage({message: "downTo", function: "downTo", parameter: distance});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
    };

    myRobot.turnUpTo = async function(angle) {
        postMessage({message: "turnUpTo", function: "turnUpTo", parameter: angle});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
    };

    myRobot.land = async function() {
        postMessage({message: "land", function: "land"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
    };

    myRobot.takeOff = async function() {
        postMessage({message: "takeOff", function: "takeOff"});
        this.finished.status = false;
        while (!this.finished.status) {
            await this.sleep(0.1);
        }
    };

    myRobot.parar = function() {
        postMessage({message: "move", v: 0, w: 0, h: 0});
    };

    myRobot.despegar = async function() {
        this.takeOff();
    };

    myRobot.aterrizar = async function() {
        this.land();
    };

    myRobot.leerUltrasonido = function() {
        return this.getDistance();
    };

    myRobot.girarHasta = async function(angle) {
        this.turnUpTo(angle);
    };

    myRobot.girar = function(turningSpeed) {
        postMessage({message: "lineal", function: "setW", parameter: turningSpeed});
    };

    return myRobot;
}

