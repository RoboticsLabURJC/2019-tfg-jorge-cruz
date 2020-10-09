const START_USER_CODE = "// START USER CODE";
const END_USER_CODE = "// END USER CODE";

function initializeWorker() {
    console.log("Starting worker");
    let hostname = location.search.slice(1).split("=")[1];
    if (hostname === "local") {
        importScripts("../../simcore/robots/interfacesRobotWW.js", "../../simcore/robots/robotAPIWW/HALRobotAPIWW.js", "../../simcore/robots/robotAPIWW/visionRobotAPIWW.js", "../../simcore/robots/robotAPIWW/consoleRobotAPIWW.js", "../../simcore/robots/robotAPIWW/utilsRobotAPIWW.js");
    } else {
        importScripts("interfacesRobotWW.js", "HALRobotAPIWW.js", "visionRobotAPIWW.js", "consoleRobotAPIWW.js", "utilsRobotAPIWW.js");
    }
    worker = {};
    worker.threadsWorker = [];

    onmessage = function (e) {
        var data = e.data;
        if (data.message === "user_code") {
            var myRobot = new RobotIWW(data.robotID);
            myRobot = addUtilsMethods(myRobot);
            myRobot = addHALMethods(myRobot);
            myRobot = addVisionMethods(myRobot);
            myRobot = addConsoleMethods(myRobot);
            createArray(data.code, myRobot);
        } else {
            console.log("Message received in worker: " + data);
        }
    };
}

function getLoopEnd(loop) {
    let endWhile;
    for (var char = 0, ignore = -1; char < loop.length; char++) {
        if (loop[char] === '{') {
            // another JS sentence starting ({) found
            ignore += 1;
        } else if (loop[char] === '}') {
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
        console.log('Detected code after infinite loop. This cde will be ignored.')
    }
    return endWhile;
}

function cleanCode(code) {
    const PYTHON_WHILE = "while(true)";
    /* Remove anything subsequent to an infinite loop */
    if (code.split(PYTHON_WHILE).length <= 2 && code.indexOf(PYTHON_WHILE) !== -1) {
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

function removeConstVarLet(code) {
    if (!code) return code;
    return code.replace('const ', '').replace('var ', '').replace('let ', '');
}

function parsePyOnBrowser(code, python_while) {
    let iterativeCode, sequentialCode;

    const codeSplitStart = code.split(START_USER_CODE);
    let startGeneralCode = codeSplitStart[0];
    let endGeneralCode = code.split(END_USER_CODE)[1];
    let userCode = codeSplitStart[1];
    userCode = userCode.split(END_USER_CODE)[0];
    const userCodeSplit = userCode.split(python_while);

    const variableDeclarationRegex = /\(__scope__\.[\w]+\) =/g;
    const wordRegex = /__scope__\.[\w]+/;
    const parenthesisVariableRegex = /.__getattr__ \('[\w]+'\)\)\((\(__scope__.[\w]+\),)+/g;

    var sequentialVariables = [];
    var sequential = userCodeSplit[0];

    var sequentialVariableDeclarationRegexMatches = sequential.match(variableDeclarationRegex);
    var sequentialParenthesisVariableRegexMatches = sequential.match(parenthesisVariableRegex);

    if (sequentialVariableDeclarationRegexMatches !== null) {
        sequentialVariableDeclarationRegexMatches.forEach(function (matchEntry) {
            if (sequentialVariables.indexOf(matchEntry.match(wordRegex)[0]) <= -1) {
                sequentialVariables.push(matchEntry.match(wordRegex)[0]);
            }
        });
    }
    if (sequentialParenthesisVariableRegexMatches !== null) {
        sequentialParenthesisVariableRegexMatches.forEach(function (matchEntry) {
            if (sequentialVariables.indexOf(matchEntry.match(wordRegex)[0]) <= -1) {
                sequentialVariables.push(matchEntry.match(wordRegex)[0]);
            }
        });
    }

    if (code.split(python_while)[0] === '') {
        sequentialCode = null;
    } else {
        var subEndGeneralCode = endGeneralCode.substring(3, endGeneralCode.length);
        subEndGeneralCode = 'var result = ' + subEndGeneralCode + '\n ';
        sequentialCode = "async function mySequentialAlgorithm() {\n" + startGeneralCode + userCodeSplit[0] + 'return [' + sequentialVariables + '];}\n' + subEndGeneralCode + '\nreturn result;\n}\nmySequentialAlgorithm();';
    }

    var loop = userCodeSplit[1];
    var subloop = loop.substring(0, loop.length - 2);
    subloop = subloop.substring(2, subloop.length);
    loop = subloop;

    iterativeCode = "async function myIterativeAlgorithm() {\n" + startGeneralCode + loop + endGeneralCode + '\n}\nmyIterativeAlgorithm();';

    return [sequentialCode, iterativeCode, sequentialVariables];
}

function parsePythonWhile(code, python_while) {
    const codeSplit = code.split(python_while);
    let iterativeCode, sequentialCode;
    if (codeSplit[0] === '') {
        sequentialCode = null;
    } else {

        var variables = codeSplit[0].split('var ')[1];
        if (variables !== undefined) {
            variables = variables.split(';')[0];
            var finalCode = codeSplit[0].split('var ')[1].split('\n');

            sequentialCode = "async function mySequentialAlgorithm() {\n";
            for (var i = 1; i < finalCode.length; i++) {
                sequentialCode = sequentialCode + finalCode[i] + '\n';
            }
            sequentialCode = "var " + variables + ";\n" + sequentialCode + '\n}\nmySequentialAlgorithm();';
        } else {
            sequentialCode = "async function mySequentialAlgorithm() {\n" + codeSplit[0] + '\n}\nmySequentialAlgorithm();';
        }
    }
    const variableDeclarationRegex = /[\w]+ =/g;
    const wordRegex = /[\w]+/;
    const parenthesisVariableRegex = /\([\w]+\)/g;

    var variableDeclarationRegexMatches = codeSplit[1].match(variableDeclarationRegex);
    var parenthesisVariableRegexMatches = codeSplit[1].match(parenthesisVariableRegex);

    iterativeCode = "async function myIterativeAlgorithm()" + codeSplit[1]; // I
    var iterativeVariables = [];

    if (variableDeclarationRegexMatches !== null) {
        variableDeclarationRegexMatches.forEach(function (matchEntry) {
            if (iterativeVariables.indexOf(matchEntry.match(wordRegex)[0]) <= -1) {
                iterativeVariables.push(matchEntry.match(wordRegex)[0]);
            }
        });
    }
    if (parenthesisVariableRegexMatches !== null) {
        parenthesisVariableRegexMatches.forEach(function (matchEntry) {
            if (iterativeVariables.indexOf(matchEntry.match(wordRegex)[0]) <= -1 && isNaN(matchEntry.match(wordRegex)[0])) {
                iterativeVariables.push(matchEntry.match(wordRegex)[0]);
            }
        });
    }

    var pos = iterativeCode.lastIndexOf('}');
    if (iterativeVariables.length > 0) {
        iterativeCode = iterativeCode.substring(0, pos) + '' + iterativeCode.substring(pos + 1) + 'return [' + iterativeVariables + '];\n}\nmyIterativeAlgorithm();';
    } else {
        iterativeCode = iterativeCode.substring(0, pos) + '' + iterativeCode.substring(pos + 1) + '\n}\nmyIterativeAlgorithm();';
    }
    return [sequentialCode, iterativeCode, iterativeVariables];
}

function createTimeoutWorker(code, myRobot, id) {
    const PYTHON_WHILE = "while(true)";
    const PYONBROWSER_WHILE = "while ( (__PyTrue__).__bool__ () === __PyTrue__)";

    var iterativeCode, sequentialCode;
    // SI+ Applications
    if (code.split(PYTHON_WHILE).length > 2 || code.split(PYONBROWSER_WHILE).length > 2) {
        console.log('Code error.\nOnly one infinite loop allowed');
        return undefined;
    }

    // only one infinite loop allowed
    if (code.includes(PYTHON_WHILE)) {
        [sequentialCode, iterativeCode, iterativeVariables] = parsePythonWhile(code, PYTHON_WHILE);
    } else if (code.includes(PYONBROWSER_WHILE)) {
        [sequentialCode, iterativeCode, sequentialVariables] = parsePyOnBrowser(code, PYONBROWSER_WHILE);
    } else {
        sequentialCode = "async function mySequentialAlgorithm() {\n" + code + '\n}\nmySequentialAlgorithm();';
        // sequentialCode = code;
        iterativeCode = null;
    }
    let originalIterativeCode = iterativeCode;
    //sequentialCode = removeConstVarLet(sequentialCode);

    eval("myRobot.move(0, 0, 0);");
    var iteration = async () => {
        if (sequentialCode !== null) {
            let result = await eval(sequentialCode);
            if (typeof result !== 'undefined' && typeof result === 'string') {
                let error_cause = 'myRobot.printConsole("[ERROR]' + result + '");';
                eval(error_cause);
            } else {
                if (iterativeCode != null && code.includes(PYONBROWSER_WHILE)) {
                    iterativeCode = generatePyOnBrowserIterativeCode(code, sequentialVariables, result, PYONBROWSER_WHILE);
                }
            }
            sequentialCode = null;
        }
        if (iterativeCode != null) {
            var result = await eval(iterativeCode);
            if (typeof result !== 'undefined' && typeof result === 'string') {
                iterativeCode = null;
                let error_cause = 'myRobot.printConsole("[ERROR]' + result + '");';
                eval(error_cause);
            } else {
                if (code.includes(PYTHON_WHILE)) {
                    let updatedVariables = "";
                    for (var i = 0; i < iterativeVariables.length; i++) {
                        updatedVariables = updatedVariables + 'var ' + iterativeVariables[i] + ' = "' + result[i] + '";\n'
                    }
                    iterativeCode = updatedVariables + originalIterativeCode;
                } else if (code.includes(PYONBROWSER_WHILE)) {
                    iterativeCode = generatePyOnBrowserIterativeCode(code, sequentialVariables, result, PYONBROWSER_WHILE);
                }
            }

            var threadsWorker = worker.threadsWorker.find((threadsWorker) => threadsWorker.id === id);
            var t = setTimeout(iteration, 50);
            threadsWorker.iteration = t;
        }
    };
    let workerIteration = setTimeout(iteration, 50);
    return workerIteration;

}

function generatePyOnBrowserIterativeCode(code, sequentialVariables, result, PYONBROWSER_WHILE) {
    const codeSplitStart = code.split(START_USER_CODE);
    let startGeneralCode = codeSplitStart[0];
    let endGeneralCode = code.split(END_USER_CODE)[1];
    let userCode = codeSplitStart[1];
    userCode = userCode.split(END_USER_CODE)[0];
    const userCodeSplit = userCode.split(PYONBROWSER_WHILE);
    var loop = userCodeSplit[1];
    loop = loop.substring(2, loop.length);
    loop = loop.substring(0, loop.length - 2);
    let updatedVariables = "";
    updatedVariables += addUpdatedVariables(sequentialVariables, updatedVariables, result);
    loop = updatedVariables + loop;
    var subEndGeneralCode = endGeneralCode.substring(3, endGeneralCode.length);
    subEndGeneralCode = 'var result = ' + subEndGeneralCode + '\n';
    var iterativeCode = "async function myIterativeAlgorithm() {\n" + startGeneralCode + loop + 'return [' + sequentialVariables + '];}\n' + subEndGeneralCode + '\nreturn result;\n}\nmyIterativeAlgorithm();';
    return iterativeCode;
}

function addUpdatedVariables(variables, updatedVariables, result) {
    for (var j = 0; j < variables.length; j++) {
        if (result[j].__class__.name === '__PyStr__') {
            updatedVariables += addStringVariable(updatedVariables, variables[j], result[j])
        } else if (result[j].__class__.name === '__PyList__') {
            updatedVariables += addListVariable(updatedVariables, variables[j], result[j])
        } else if (result[j].__class__.name === '__PyDict__') {
            updatedVariables += addDictVariable(updatedVariables, variables[j], result[j])
        } else if (result[j].__class__.name === '__PyBool__') {
            updatedVariables += addBoolVariable(updatedVariables, variables[j], result[j])
        } else {
            updatedVariables += addIntegerVariable(updatedVariables, variables[j], result[j])
        }
    }
    return updatedVariables;
}

function addIntegerVariable(updatedVariables, variableName, result) {
    updatedVariables += '(' + variableName + ') = (new ' + result.__class__.name + '(' + result.x + '));\n';
    return updatedVariables;
}

function addBoolVariable(updatedVariables, variableName, result) {
    updatedVariables += '(' + variableName + ') = (new ' + result.__class__.name + '(' + result.x + '));\n';
    return updatedVariables;
}

function addStringVariable(updatedVariables, variableName, result) {
    updatedVariables += '(' + variableName + ') = (new ' + result.__class__.name + '("' + result.x + '"));\n';
    return updatedVariables;
}

function addListVariable(updatedVariables, variableName, result) {
    var listVariable = "";
    for (var i = 0; i < result.l.length; i++) {
        if (result.l[i].__class__.name === '__PyStr__') {
            listVariable += '(new ' + result.l[i].__class__.name + '("' + result.l[i].x + '"))';
        } else if (result.l[i].__class__.name === '__PyInt__') {
            listVariable += '(new ' + result.l[i].__class__.name + '(' + result.l[i].x + '))';
        } else if (result.l[i].__class__.name === '__PyList__') {
            var list = addInnerList(result.l[i]);
            listVariable += '(new ' + result.l[i].__class__.name + '([' + list + ']))';
        } else {
            listVariable += '(new ' + result.l[i].__class__.name + '(' + result.l[i].x + '))';
        }
        listVariable += ', '
    }
    updatedVariables += '(' + variableName + ') = (new ' + result.__class__.name + '([' + listVariable + ']));\n';
    return updatedVariables;
}

function addInnerList(result) {
    var listVariable = "";
    for (var i = 0; i < result.l.length; i++) {
        if (result.l[i].__class__.name === '__PyStr__') {
            listVariable += '(new ' + result.l[i].__class__.name + '("' + result.l[i].x + '"))';
        } else if (result.l[i].__class__.name === '__PyInt__') {
            listVariable += '(new ' + result.l[i].__class__.name + '(' + result.l[i].x + '))';
        } else if (result.l[i].__class__.name === '__PyDict__') {
            var dict = addInnerDict(result.l[i]);
            listVariable += '(new ' + result.l[i].__class__.name + '([' + dict[0] + '], [' + dict[1] + ']))';
        } else if (result.l[i].__class__.name === '__PyList__') {
            var list = addInnerList(result.l[i]);
            listVariable += '(new ' + result.l[i].__class__.name + '([' + list + ']))';
        } else {
            listVariable += '(new ' + result.l[i].__class__.name + '(' + result.l[i].x + '))';
        }
        listVariable += ', '
    }
    return listVariable;
}

function addDictVariable(updatedVariables, variableName, result) {
    var dictVariableKeys = "";
    var dictVariableValues = "";
    for (var i = 0; i < result.keys.length; i++) {
        if (result.keys[i].__class__.name === '__PyStr__') {
            dictVariableKeys += '(new ' + result.keys[i].__class__.name + '("' + result.keys[i].x + '"))';
        } else if (result.keys[i].__class__.name === '__PyInt__') {
            dictVariableKeys += '(new ' + result.keys[i].__class__.name + '(' + result.keys[i].x + '))';
        }
        dictVariableKeys += ', '
    }

    for (var i = 0; i < result.values.length; i++) {
        if (result.values[i].__class__.name === '__PyStr__') {
            dictVariableValues += '(new ' + result.values[i].__class__.name + '("' + result.values[i].x + '"))';
        } else if (result.values[i].__class__.name === '__PyInt__') {
            dictVariableValues += '(new ' + result.values[i].__class__.name + '(' + result.values[i].x + '))';
        } else if (result.values[i].__class__.name === '__PyList__') {
            var listVariable = addInnerList(result.values[i]);
            dictVariableValues += '(new ' + result.values[i].__class__.name + '([' + listVariable + ']))';
        } else if (result.values[i].__class__.name === '__PyDict__') {
            var dict = addInnerDict(result.values[i]);
            dictVariableValues += '(new ' + result.values[i].__class__.name + '([' + dict[0] + '], [' + dict[1] + ']))';
        } else {
            dictVariableValues += '(new ' + result.values[i].__class__.name + '(' + result.values[i].x + '))';
        }
        dictVariableValues += ', '
    }
    updatedVariables += '(' + variableName + ') = (new ' + result.__class__.name + '([' + dictVariableKeys + '], [' + dictVariableValues + ']));\n';
    return updatedVariables;
}


function addInnerDict(result) {
    var dictVariableKeys = "";
    var dictVariableValues = "";
    for (var i = 0; i < result.keys.length; i++) {
        if (result.keys[i].__class__.name === '__PyStr__') {
            dictVariableKeys += '(new ' + result.keys[i].__class__.name + '("' + result.keys[i].x + '"))';
        } else if (result.keys[i].__class__.name === '__PyInt__') {
            dictVariableKeys += '(new ' + result.keys[i].__class__.name + '(' + result.keys[i].x + '))';
        }
        dictVariableKeys += ', '
    }

    for (var i = 0; i < result.values.length; i++) {
        if (result.values[i].__class__.name === '__PyStr__') {
            dictVariableValues += '(new ' + result.values[i].__class__.name + '("' + result.values[i].x + '"))';
        } else if (result.values[i].__class__.name === '__PyInt__') {
            dictVariableValues += '(new ' + result.values[i].__class__.name + '(' + result.values[i].x + '))';
        } else if (result.values[i].__class__.name === '__PyList__') {
            var listVariable = addInnerList(result.values[i]);
            dictVariableValues += '(new ' + result.values[i].__class__.name + '([' + listVariable + ']))';
        } else {
            dictVariableValues += '(new ' + result.values[i].__class__.name + '(' + result.values[i].x + '))';
        }
        dictVariableValues += ', '
    }
    return [dictVariableKeys, dictVariableValues];
}

async function createArray(code, myRobot) {
    code = cleanCode(code);
    var robotID = myRobot.myRobotID;
    worker.threadsWorker.push({
        "id": robotID,
        "running": true,
        "iteration": createTimeoutWorker(code, myRobot, robotID),
        "codeRunning": code
    });
}

initializeWorker();
