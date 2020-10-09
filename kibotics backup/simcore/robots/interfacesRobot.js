import {simEnabled} from '../globals';
import {advance, advanceTo, setV, setW, setL, move, upTo, downTo, turnUpTo, land, takeOff, getV, getW, getL,
    getDistance, getDistances, readIR} from './robotAPI/HALRobotAPI'
import {getImage, getColoredObject, getObjectColorRGB, getObjectColorPositionRGB, getColorCode, dameObjetoCiudad, loadModel, imgMat_to_img, dameCentro, colorSemaforo} from './robotAPI/visionRobotAPI'
import {printConsole, inputConsole} from './robotAPI/consoleRobotAPI'
import {sleep} from './robotAPI/utilsRobotAPI'

export class RobotI {

    constructor(robotId) {
        const defaultDistanceDetection = 10;
        const defaultNumOfRays = 31;

        this.model = [];
        this.myRobotID = robotId;
        this.robot = document.getElementById(robotId);
        this.activeRays = false;
        this.camerasData = [];
        this.raycastersArray = [];
        this.distanceArray = {
            center: [],
            left: [],
            right: []
        };
        this.understandedColors = {
            blue: {low: [0, 0, 100, 0], high: [0, 0, 255, 255]},
            green: {low: [0, 50, 0, 0], high: [0, 255, 0, 255]},
            red: {low: [110, 0, 0, 0], high: [255, 30, 30, 255]},
            white: {low: [230, 230, 230, 0], high: [255, 255, 255, 255]},
            black: {low: [0, 0, 0, 255], high: [105, 105, 105, 255]},
            yellow: {low: [110, 125, 0, 0], high: [255, 255, 0, 255]},
            orange: {low: [125, 100, 0, 0], high: [255, 175, 30, 255]},
            pink: {low: [175, 10, 50, 0], high: [255, 30, 157, 255]},
            purple: {low: [65, 0, 50, 0], high: [138, 0, 138, 255]},
            brown: {low: [40, 34, 31, 0], high: [112, 84, 61, 255]}
        };
        this.velocity = {x: 0, y: 0, z: 0, ax: 0, ay: 0, az: 0};

        this.findCameras();
        this.motorsStarter();
        this.startCamera();
        this.startRaycasters(defaultDistanceDetection, defaultNumOfRays);
        var robotEvent = new CustomEvent('robot-loaded', {
            'detail': this
        });
        document.dispatchEvent(robotEvent);
    }

    getID() {
        return this.myRobotID;
    }

    findCameras() {
        /**
         * This function searchs for camera entities that has robotID
         * contained in cameraID which means the camera belongs to
         * the body of the robot (attached). This ID is stored in an array
         * with the camera wrapper id that must be same as cameraID + 'Wrapper'
         *
         */
        var sceneCameras = document.getElementsByTagName('a-camera');
        for (var i = 0; i < sceneCameras.length; i++) {
            var cameraID = sceneCameras[i].getAttribute('id');
            if (cameraID.includes(this.myRobotID)) {
                this.camerasData.push(
                    {
                        'wrapperID': cameraID + 'Wrapper',
                        'cameraID': cameraID,
                        'canvasID': cameraID + 'Canvas'
                    })
            }
        }
    }

    motorsStarter() {
        /**
         * This function starts motors
         */

        console.log("Setting up motors.");
        this.setVelocity();
    }

    getRotation() {
        return this.robot.getAttribute('rotation');
    }

    setVelocity() {
        var robot;
        if (this.robot.body.position.y > 1) { //to activate animation of drone
            robot = document.querySelector("#" + this.myRobotID);
            robot.setAttribute('animation-mixer', "clip:*;timeScale:1.5");
        } else {
            robot = document.querySelector("#" + this.myRobotID);
            robot.setAttribute('animation-mixer', "clip:None");
        }
        let rotation = this.getRotation();
        let newpos = this.updatePosition(rotation, this.velocity, this.robot.body.position);
        this.robot.body.position.set(newpos.x, newpos.y, newpos.z);
        this.robot.body.angularVelocity.set(this.velocity.ax, this.velocity.ay, this.velocity.az);

        this.timeoutMotors = setTimeout(this.setVelocity.bind(this), 50);
    }

    updatePosition(rotation, velocity, robotPos) {
        if (simEnabled) {
            let x = velocity.x / 10 * Math.cos(rotation.y * Math.PI / 180);
            let z = velocity.x / 10 * Math.sin(-rotation.y * Math.PI / 180);
            let y = (velocity.y / 10);
            robotPos.x += x;
            robotPos.z += z;
            robotPos.y += y;
        }
        return robotPos;
    }

    startCamera() {
        console.log("Starting camera.");
        if (($('#spectatorDiv').length) && (document.querySelector("#spectatorDiv").firstChild != undefined)) {
            for (var i = 0; i < this.camerasData.length; i++) {
                var canvasID = '#' + this.camerasData[i]['canvasID'];
                this.canvas2d = document.querySelector(canvasID);
                this.camerasData[i]['canvasElement'];
            }
            this.getImageData_async();
        } else {
            setTimeout(this.startCamera.bind(this), 100);
        }
    }

    getImageData_async() {
        /**
         * This function stores image from the robot in the variable
         * "imagedata", this allows to obtain image from the robot
         * with getImage() function.
         */
        if (simEnabled) {
            for (var i = 0; i < this.camerasData.length; i++) {
                this.camerasData[i]['image'] = cv.imread(this.camerasData[i]['canvasID']);
            }
        }
        this.timeoutCamera = setTimeout(this.getImageData_async.bind(this), 60);
    }

    startRaycasters(distance, numOfRaycasters) {
        /**
         * This function enables/disbles raycasters (position sensors)
         * for the robot.
         *
         * @distance (Number): Distance which the rays will detect objects.
         * @numOfRaycasters (Numbrer): Number of Raycaster.
         */
        if (!this.activeRays) {
            console.log("Starting raycaster");
            let emptyEntity = document.querySelector("a-scene");
            if ((numOfRaycasters % 2) === 0) {
                numOfRaycasters += 1;
            }
            var offsetAngle = 180 / numOfRaycasters;
            var angle = -90;
            for (var i = 0; i < numOfRaycasters; i++) {
                if (i === (numOfRaycasters - 1) / 2) {
                    angle += offsetAngle;
                    var group = "center";
                } else if (i < (numOfRaycasters - 1) / 2) {
                    angle += offsetAngle;
                    group = "left";
                } else if (i > (numOfRaycasters - 1) / 2) {
                    angle += offsetAngle;
                    group = "right";
                }
                this.createRaycaster(distance, angle, emptyEntity, group, i);
            }
            this.activeRays = true;
            this.setListener();
        } else {
            this.stopRaycasters();
        }
    }

    createRaycaster(distance, angle, emptyEntity, group, number) {
        /**
         * This function appends raycasters entities to the robot.
         */
        let newRaycaster = document.createElement('a-entity');
        newRaycaster.setAttribute('raycaster', 'objects', '.collidable');
        newRaycaster.setAttribute('raycaster', 'far', distance);
        newRaycaster.setAttribute('raycaster', 'showLine', true);
        newRaycaster.setAttribute('raycaster', 'direction', "1 0 0");
        newRaycaster.setAttribute('raycaster', 'interval', 100);
        newRaycaster.setAttribute('raycaster', 'enabled', true);
        newRaycaster.setAttribute('line', 'color', "#ffffff");
        newRaycaster.setAttribute('line', 'opacity', 1);
        newRaycaster.setAttribute('line', 'end', "1 0 0");
        newRaycaster.setAttribute('follow-body', 'entityId', '#' + this.myRobotID);
        newRaycaster.setAttribute('follow-body', "offsetRotation", "0 " + angle + " 0");
        newRaycaster.setAttribute('intersection-handler', 'fps', '10');
        newRaycaster.classList.add(group);
        newRaycaster.id = number.toString();
        this.raycastersArray.push(newRaycaster)
        emptyEntity.appendChild(newRaycaster);
    }

    stopRaycasters() {
        /**
         * This function erases all raycasters for the robot.
         */
        var emptyEntity = document.querySelector("#positionSensor");
        while (emptyEntity.firstChild) {
            this.removeListeners(emptyEntity.firstChild);
            emptyEntity.removeChild(emptyEntity.firstChild);
        }
        this.activeRays = false;
        console.log("Stopping raycaster");
    }

    setListener() {
        /**
         * This function sets up intersection listeners for each raycaster.
         */
        for (var i = 0; i < this.raycastersArray.length; i++) {
            this.raycastersArray[i].addEventListener('intersection-detected-' + this.raycastersArray[i].id,
                this.updateDistance.bind(this));

            this.raycastersArray[i].addEventListener('intersection-cleared-' + this.raycastersArray[i].id,
                this.eraseDistance.bind(this));
        }
    }

    removeListeners(raycaster) {
        /**
         * This function disables intersection listeners.
         */
        raycaster.removeEventListener('intersection-detected-' + raycaster.id, () => {
            console.log("removed");
        });
        raycaster.removeEventListener('intersection-cleared-' + raycaster.id, () => {
            console.log("removed");
        });
    }

    updateDistance(evt) {
        /**
         * This function is called when an intersection is detected and updates the distance
         * to the point of intersection.
         */
        let id = evt.target.id;
        let targetClass = evt.target.classList[0];

        if (this.distanceArray[targetClass].length === 0) {

            this.distanceArray[targetClass].push({id: id, d: evt.detail});
        } else {
            let found = false;
            let j = 0;
            while ((j < this.distanceArray[targetClass].length) && !found) {
                if (this.distanceArray[targetClass][j].id === id) {
                    this.distanceArray[targetClass][j].d = evt.detail;
                    found = true;
                }
                j += 1;
            }
            if (!found) {
                this.distanceArray[targetClass].push({id: id, d: evt.detail});
            }
        }
    }

    eraseDistance(evt) {
        /**
         * This function is called when the intersection is cleared and
         * removes the distance from the array.
         */
        let id = evt.target.id;
        let targetClass = evt.target.classList[0];

        for (var i = 0; i < this.distanceArray[targetClass].length; i++) {
            if (this.distanceArray[targetClass][i].id === id) {
                this.distanceArray[targetClass].splice(i, 1);
            }
        }
    }

    getPosition() {
        /**
         * This function returns an object with X-Y-Z positions and rotation (theta)
         * for the Y axis.
         */
        let x = this.robot.object3D.position.x;
        let y = this.robot.object3D.position.y;
        let z = this.robot.object3D.position.z;
        let rot = THREE.Math.radToDeg(this.robot.object3D.rotation.y);

        return {x: x, y: y, z: z, theta: rot};
    }

    getPositionValue(position) {
        let position_value = this.getPosition();
        if (position === 'POSX') {
            return position_value.x;
        } else if (position === 'POSY') {
            return position_value.z;
        } else if (position === 'POSZ') {
            return position_value.y;
        } else {
            return position_value.theta;
        }
    }
}

// utils
RobotI.prototype.sleep = sleep;
// HAL
RobotI.prototype.advance = advance;
RobotI.prototype.advanceTo = advanceTo;
RobotI.prototype.setV = setV;
RobotI.prototype.setW = setW;
RobotI.prototype.setL = setL;
RobotI.prototype.move = move;
RobotI.prototype.upTo = upTo;
RobotI.prototype.downTo = downTo;
RobotI.prototype.turnUpTo = turnUpTo;
RobotI.prototype.land = land;
RobotI.prototype.takeOff = takeOff;
RobotI.prototype.getV = getV;
RobotI.prototype.getW = getW;
RobotI.prototype.getL = getL;
RobotI.prototype.getDistance = getDistance;
RobotI.prototype.getDistances = getDistances;
RobotI.prototype.readIR = readIR;
// vision
RobotI.prototype.getImage = getImage;
RobotI.prototype.getColoredObject = getColoredObject;
RobotI.prototype.getObjectColorRGB = getObjectColorRGB;
RobotI.prototype.getObjectColorPositionRGB = getObjectColorPositionRGB;
RobotI.prototype.getColorCode = getColorCode;
RobotI.prototype.dameObjetoCiudad = dameObjetoCiudad;
RobotI.prototype.loadModel = loadModel;
RobotI.prototype.imgMat_to_img = imgMat_to_img;
RobotI.prototype.dameCentro = dameCentro;
RobotI.prototype.colorSemaforo = colorSemaforo;
// console
RobotI.prototype.printConsole = printConsole;
RobotI.prototype.inputConsole = inputConsole;

