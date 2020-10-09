function addUtilsMethods(myRobot) {

    myRobot.sleep = function(s) {
        let ms = s * 1000;
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    return myRobot;
}