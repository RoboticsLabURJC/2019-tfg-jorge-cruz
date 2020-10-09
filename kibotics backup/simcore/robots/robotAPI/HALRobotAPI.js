import {getBrainStatus} from "../../../brains/brains-methods";

export function advance(linearSpeed) {
    this.setV(linearSpeed);
}

export async function advanceTo(distance, brain) {
    var brainStatus = getBrainStatus(this.myRobotID, brain);
    brainStatus.blocking_instruction = true;
    let initial_position_x = this.getPosition().x;
    let initial_position_z = this.getPosition().z;
    distance > 0 ? this.setV(1) : this.setV(-1);
    while (getBrainStatus(this.myRobotID, brain).status !== "RELOADING" && Math.sqrt(Math.pow(initial_position_x - this.getPosition().x, 2)
        + Math.pow(initial_position_z - this.getPosition().z, 2)) <= Math.abs(distance)) {
        await this.sleep(0.01);
    }
    brainStatus.blocking_instruction = false;
    this.setV(0);
}

function setV(v) {
    this.velocity.x = v;
}

export function setW(w) {
    this.velocity.ay = w * 10;
}

export function setL(l) {
    this.velocity.y = l;
}

function move(v, w, h) {
    this.setV(v);
    this.setW(w);
    this.setL(h);
}

export async function upTo(distance, brain) {
    let initial_position = this.getPosition().y;
    this.setL(1);
    while (getBrainStatus(this.myRobotID, brain).status !== "RELOADING" && Math.abs(initial_position - this.getPosition().y) <= Math.abs(distance)) {
        await this.sleep(0.01);
    }
    this.setL(0);
}

export async function downTo(distance, brain) {
    let initial_position = this.getPosition().y;
    this.setL(-1);
    while (getBrainStatus(this.myRobotID, brain).status !== "RELOADING" && Math.abs(initial_position - this.getPosition().y) <= Math.abs(distance)) {
        await this.sleep(0.01);
    }
    this.setL(0);
}

export async function turnUpTo(angle, brain) {
    var brainStatus = getBrainStatus(this.myRobotID, brain);
    brainStatus.blocking_instruction = true;
    let initial_position = this.getPosition().theta + 180.0; // [0, 360]
    angle > 0 ? this.setW(-0.15) : this.setW(0.15);
    var current_position = this.getPosition().theta + 180.0; // [0, 360]
    if (initial_position - angle < 0.0) {
        angle = angle - 360.0; // discontinuity
    }
    while (getBrainStatus(this.myRobotID, brain).status !== "RELOADING" && Math.abs(current_position - ((initial_position - angle) % 360.0)) >= 5.0) {
        await this.sleep(0.0001);
        current_position = this.getPosition().theta + 180.0; // [0, 360]
    }
    brainStatus.blocking_instruction = false;
    this.setW(0);
}

export async function land(brain) {
    var brainStatus = getBrainStatus(this.myRobotID, brain);
    brainStatus.blocking_instruction = true;
    let position = this.getPosition();
    if (position.y > 2) {
        while (getBrainStatus(this.myRobotID, brain).status !== "RELOADING" && this.getPosition().y > 2) {
            this.setL(-2);
            await this.sleep(0.2);
        }
        this.setL(0);
    }
    brainStatus.blocking_instruction = false;
}

export async function takeOff(brain) {
    var brainStatus = getBrainStatus(this.myRobotID, brain);
    brainStatus.blocking_instruction = true;
    let position = this.getPosition();
    if (position.y < 10) {
        while (getBrainStatus(this.myRobotID, brain).status !== "RELOADING" && this.getPosition().y < 10) {
            this.setL(2);
            await this.sleep(0.2);
        }
        this.setL(0);
    }
    brainStatus.blocking_instruction = false;
}

export function getV() {
    return this.velocity.x;
}

export function getW() {
    return this.velocity.ay;
}

export function getL() {
    return this.velocity.y;
}

export function getDistance() {
    /**
     * This function returns the distance for the raycaster in the center of the arc of rays.
     */
    var distances = this.getDistances();

    if (distances[13] !== 10 || distances[14] !== 10 || distances[15] !== 10 || distances[16] !== 10 || distances[17] !== 10) {
        let distance0 = 100;
        let distance1 = 100;
        let distance2 = 100;
        let distance3 = 100;
        let distance4 = 100;
        if (distances[13] !== 10) {
            distance0 = distances[13];
        }
        if (distances[14] !== 10) {
            distance1 = distances[14];
        }
        if (distances[15] !== 10) {
            distance2 = distances[15];
        }
        if (distances[16] !== 10) {
            distance3 = distances[16];
        }
        if (distances[17] !== 10) {
            distance4 = distances[17];
        }
        let min_distances = [distance0, distance1, distance2, distance3, distance4];
        Array.min = function (array) {
            return Math.min.apply(Math, array);
        };
        return Array.min(min_distances);
    } else {
        return 10;
    }
}

export function getDistances() {
    /**
     * This function returns an array with all the distances detected by the rays.
     */
    var distances = [];
    for (var i = 0; i <= 31; i++) {
        distances.push(10);
    }
    var groups = ["center", "right", "left"];
    for (i = 0; i < groups.length; i++) {
        this.distanceArray[groups[i]].forEach((obj) => {
            if (typeof obj.d != "undefined") {
                distances[obj.id] = obj.d;
            }
        });
    }
    return distances;
}

export function readIR() {
    /**
     * This function filters an object on the robot image and returns 0-1-2-3 depending of the
     * position of the center on X axis for the detected object.
     */
    var outputVal = 3;
    var image = this.getImage("camera-IR");
    var binImg = new cv.Mat();
    var colorCodes = this.getColorCode("black");
    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();
    let dst = new cv.Mat();
    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, 0, 0, 1, -95]);
    let dsize = new cv.Size(image.cols, image.rows - 95);
    // You can try more different parameters
    cv.warpAffine(image, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    var lowTresh = new cv.Mat(dst.rows, dst.cols, dst.type(), colorCodes[0]);
    var highTresh = new cv.Mat(dst.rows, dst.cols, dst.type(), colorCodes[1]);

    cv.inRange(dst, lowTresh, highTresh, binImg);
    cv.findContours(binImg, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    if (contours.size() > 0) {
        let stored = contours.get(0);
        let moments = cv.moments(stored, false);

        var cx = moments.m10 / moments.m00;

        if (isNaN(cx)) {
            outputVal = 3;
        } else if ((cx <= 150) && (cx >= 85)) {
            outputVal = 2;
        } else if ((cx >= 0) && (cx <= 65)) {
            outputVal = 1;
        } else {
            outputVal = 0;
        }

    }
    return outputVal;
}

module.exports = {
    advance,
    advanceTo,
    setV,
    setW,
    setL,
    move,
    upTo,
    downTo,
    turnUpTo,
    land,
    takeOff,
    getV,
    getW,
    getDistance,
    getDistances,
    readIR
};