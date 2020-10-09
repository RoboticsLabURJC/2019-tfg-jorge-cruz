const utils = require('../../simcore/utils');
const sleep = utils.sleep;

export function printConsole(text) {
  let oldLog = console.log;
  console.log = function(message) {
    const errorRegex = /\[ERROR]/g;
    if (typeof message === 'string' && message.match(errorRegex) !== null) {
      document.getElementById('console_web').innerHTML += '<p style="color:red">[ERROR]</p>';
      document.getElementById('console_web').innerHTML += '<p>' + message.split(errorRegex)[1] + '</p>';
    } else {
      document.getElementById('console_web').innerHTML += '<p>' + message + '</p>';
    }
  };
  console.log(text);
  var consoleWeb = document.getElementById('console_web');
  consoleWeb.scrollTop = consoleWeb.scrollHeight;
  console.log = oldLog;
}

export async function inputConsole(text, myRobot, brains, worker) {
  let oldLog = console.log;
  var inputValue = "";
  console.log = function(message) {
      document.getElementById('console_web').innerHTML += '<p>' + message + '</p>';
  };
  console.log(text + '<input id ="myInput" type="text" style="background-color:transparent;outline:none;border:none;">');
  var consoleWeb = document.getElementById('console_web');
  consoleWeb.scrollTop = consoleWeb.scrollHeight;
  console.log = oldLog;
  var enterKeyPressed = false;
  function keydownHandler(e) {
      if (e.keyCode === 13) {
          inputValue = document.getElementById("myInput").value;
          $('#myInput').remove();
          let oldLog = console.log;
          console.log = function(message) {
              document.getElementById('console_web').innerHTML += '<p>' + message + '</p>';
          };
          console.log(inputValue);
          var consoleWeb = document.getElementById('console_web');
          consoleWeb.scrollTop = consoleWeb.scrollHeight;
          console.log = oldLog;
          document.removeEventListener('keydown', keydownHandler, false);
          enterKeyPressed = true;
      }
  }
  let brainStatus = brains.getBrainStatus(myRobot.myRobotID);
  brainStatus.blocking_instruction=true;
  document.addEventListener('keydown', keydownHandler, false);
  while(brains.getBrainStatus(myRobot.myRobotID).status !== "RELOADING" && !enterKeyPressed) {
      await sleep(0.1);
  }
  worker.postMessage({message:"finished"});
  brainStatus.blocking_instruction=false;
  return inputValue;
}