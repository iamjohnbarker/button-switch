const electron = require('electron');
const GamePad = require( 'node-gamepad' );
const wirecast = require( 'wirecast-applescript' );
const {ipcRenderer} = require('electron');
const midi = require('midi');
const midiOutput = require('midi');
const ATEM = require('applest-atem');
const HyperdeckLib = require("hyperdeck-js-lib");
const storage = require('electron-json-storage');
const path = require('path');
const StreamDeck = require('elgato-stream-deck');
const fs = require('fs');
const homedir = require('homedir');
const objChange = require('object-change');


// CREATE TXT FILE FOR MARKERS
var tcToTxt = fs.createWriteStream(homedir()+'/desktop/button-switch-log.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
});


// SETTINGS JSON FILE //
// GRAB SAVED IP ADDRESS FROM STORAGE
const dataPath = storage.getDataPath();
//console.log(dataPath);
storage.get('atem-ip-address', function(error, data) {
  if (error) throw error;
  if (data.atemIPAddress === undefined) {
    document.getElementById('idAddressInput').value = "";
  } else {
    document.getElementById('idAddressInput').value = data.atemIPAddress;
  };
});
storage.get('hyperdeck-ip-address', function(error, data) {
  if (error) throw error;
  if (data.hyperdeckIPAddress === undefined) {
    document.getElementById('ipAddressInputHyperDeck').value = "";
  } else {
    document.getElementById('ipAddressInputHyperDeck').value = data.hyperdeckIPAddress;
  };
});

// CONNECT TO AND GRAB THE IP ADDRESS OF ATEM //
var atem = new ATEM();
//console.log(atem);
var ipAddress = document.getElementsByClassName('idAddressInput');
var button = document.getElementById('ipAddressBtn').addEventListener ('click', atemConnect);
function atemConnect(e) {
  e.preventDefault();
  storage.set('atem-ip-address', {atemIPAddress: idAddressInput.value}, function(error) {
    if (error) throw error;
  });
  console.log(idAddressInput.value);
  // IPC SEND AND REPLY
  ipcRenderer.send('asynchronous-message', idAddressInput.value);
  var atemIP = idAddressInput.value;
  atem.connect(atemIP);
  console.log(atem.state);
};
atem.on('connect', function() {
  atemConnectionLED.style.backgroundColor = "#5cd65c";
  //console.log(atem.state.tallys);
});
atem.on('disconnect', function() {
  atemConnectionLED.style.backgroundColor = "";
});


// HYPERDECK CONNECT AND STATUS //
var hyperdeck;

var ipAddressHyperdeck = document.getElementById('ipAddressInputHyperDeck');
var button2 = document.getElementById('ipAddressBtnHyperDeck').addEventListener ('click', hyperdeckConnect);
function hyperdeckConnect(record, stop, start, goToClip, transportInfo, e) {
  //e.preventDefault();
  var hyperdeckIP = ipAddressInputHyperDeck.value;
  hyperdeck = new HyperdeckLib.Hyperdeck(hyperdeckIP);
  storage.set('hyperdeck-ip-address', {hyperdeckIPAddress: ipAddressInputHyperDeck.value}, function(error) {
    if (error) throw error;
  });
  hyperdeck.onConnected().then(function() {
      hyperdeck.makeRequest("device info").then(function(response) {
        console.log("Got response with code "+response.code+".");
        console.log("Hyperdeck unique id: "+response.params["unique id"]);
        hyperdeckConnectionLED.style.backgroundColor = "#5cd65c";
      }).catch(function(errResponse) {
        if (!errResponse) {
          console.error("The request failed because the hyperdeck connection was lost.");
        }
        else {
          console.error("The hyperdeck returned an error with status code "+errResponse.code+".");
        }
      });

      hyperdeck.getNotifier().on("asynchronousEvent", function(response) {
        console.log("Got an asynchronous event with code "+response.code+".");
      });

      hyperdeck.getNotifier().on("connectionLost", function() {
        console.error("Connection lost.");
        atemConnectionLED.style.backgroundColor = "";
      });
  }).catch(function() {
      console.error("Failed to connect to hyperdeck.");
  });
};



// ALL TALLY //
// TALLY 1
var tally1 = {};
var proxyObj1 = objChange(tally1, ['tally1Change']);
proxyObj1.on('change:tally1Change', function (e, args) {
  //console.log('Tally 1: ' + args.newValue);
  if (args.newValue == 1) {
    tallyOne.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "1") {
          var sdTallyOne = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdTallyOne, path.resolve(__dirname, 'assets/stream-deck/1-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "1") {
          var sdTallyOne = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdTallyOne, path.resolve(__dirname, 'assets/stream-deck/1-red.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 2) {
    tallyOne.style.backgroundColor = "#5cd65c";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "1") {
          var sdTallyOnePrev = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdTallyOnePrev, path.resolve(__dirname, 'assets/stream-deck/1-green.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "1") {
          var sdTallyOne = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdTallyOne, path.resolve(__dirname, 'assets/stream-deck/1-green.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 3) {
    tallyOne.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "1") {
          var sdTallyOne = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdTallyOne, path.resolve(__dirname, 'assets/stream-deck/1-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "1") {
          var sdTallyOne = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdTallyOne, path.resolve(__dirname, 'assets/stream-deck/1-red.png')).then(() => {
          });
        }
      });
    };
  } else {
    tallyOne.style.backgroundColor = "";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "1") {
          var sdTallyOne = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdTallyOne, path.resolve(__dirname, 'assets/stream-deck/1-clear.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "1") {
          var sdTallyOne = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdTallyOne, path.resolve(__dirname, 'assets/stream-deck/1-clear.png')).then(() => {
          });
        }
      });
    };
  };
});

// TALLY 2
var tally2 = {};
var proxyObj2 = objChange(tally2, ['tally2Change']);
proxyObj2.on('change:tally2Change', function (e, args) {
  //console.log('Tally 2: ' + args.newValue);
  if (args.newValue == 1) {
    tallyTwo.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "2") {
          var sdtallyTwo = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyTwo, path.resolve(__dirname, 'assets/stream-deck/2-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "2") {
          var sdtallyTwo = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyTwo, path.resolve(__dirname, 'assets/stream-deck/2-red.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 2) {
    tallyTwo.style.backgroundColor = "#5cd65c";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "2") {
          var sdtallyTwoPrev = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyTwoPrev, path.resolve(__dirname, 'assets/stream-deck/2-green.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "2") {
          var sdtallyTwo = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyTwo, path.resolve(__dirname, 'assets/stream-deck/2-green.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 3) {
    tallyTwo.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "2") {
          var sdtallyTwo = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyTwo, path.resolve(__dirname, 'assets/stream-deck/2-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "2") {
          var sdtallyTwo = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyTwo, path.resolve(__dirname, 'assets/stream-deck/2-red.png')).then(() => {
          });
        }
      });
    };

  } else {
    tallyTwo.style.backgroundColor = "";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "2") {
          var sdtallyTwo = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyTwo, path.resolve(__dirname, 'assets/stream-deck/2-clear.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "2") {
          var sdtallyTwo = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyTwo, path.resolve(__dirname, 'assets/stream-deck/2-clear.png')).then(() => {
          });
        }
      });
    };

  }
});

// TALLY 3
var tally3 = {};
var proxyObj3 = objChange(tally3, ['tally3Change']);
proxyObj3.on('change:tally3Change', function (e, args) {
  //console.log('Tally 3: ' + args.newValue);
  if (args.newValue == 1) {
    tallyThree.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "3") {
          var sdtallyThree = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyThree, path.resolve(__dirname, 'assets/stream-deck/3-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "3") {
          var sdtallyThree = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyThree, path.resolve(__dirname, 'assets/stream-deck/3-red.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 2) {
    tallyThree.style.backgroundColor = "#5cd65c";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "3") {
          var sdtallyThreePrev = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyThreePrev, path.resolve(__dirname, 'assets/stream-deck/3-green.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "3") {
          var sdtallyThree = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyThree, path.resolve(__dirname, 'assets/stream-deck/3-green.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 3) {
    tallyThree.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "3") {
          var sdtallyThree = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyThree, path.resolve(__dirname, 'assets/stream-deck/3-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "3") {
          var sdtallyThree = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyThree, path.resolve(__dirname, 'assets/stream-deck/3-red.png')).then(() => {
          });
        }
      });
    };

  } else {
    tallyThree.style.backgroundColor = "";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "atemPreview" && data.value == "3") {
          var sdtallyThree = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyThree, path.resolve(__dirname, 'assets/stream-deck/3-clear.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "3") {
          var sdtallyThree = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyThree, path.resolve(__dirname, 'assets/stream-deck/3-clear.png')).then(() => {
          });
        }
      });
    };

  }
});

// TALLY 4
var tally4 = {};
var proxyObj4 = objChange(tally4, ['tally4Change']);
proxyObj4.on('change:tally4Change', function (e, args) {
  //console.log('Tally 4: ' + args.newValue);
  if (args.newValue == 1) {
    tallyFour.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "4") {
          var sdtallyFour = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFour, path.resolve(__dirname, 'assets/stream-deck/4-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "4") {
          var sdtallyFour = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFour, path.resolve(__dirname, 'assets/stream-deck/4-red.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 2) {
    tallyFour.style.backgroundColor = "#5cd65c";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "4") {
          var sdtallyFourPrev = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFourPrev, path.resolve(__dirname, 'assets/stream-deck/4-green.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "4") {
          var sdtallyFour = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFour, path.resolve(__dirname, 'assets/stream-deck/4-green.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 3) {
    tallyFour.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "4") {
          var sdtallyFour = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFour, path.resolve(__dirname, 'assets/stream-deck/4-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "4") {
          var sdtallyFour = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFour, path.resolve(__dirname, 'assets/stream-deck/4-red.png')).then(() => {
          });
        }
      });
    };

  } else {
    tallyFour.style.backgroundColor = "";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "4") {
          var sdtallyFour = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFour, path.resolve(__dirname, 'assets/stream-deck/4-clear.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "4") {
          var sdtallyFour = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFour, path.resolve(__dirname, 'assets/stream-deck/4-clear.png')).then(() => {
          });
        }
      });
    };

  }
});

// TALLY 5
var tally5 = {};
var proxyObj5 = objChange(tally5, ['tally5Change']);
proxyObj5.on('change:tally5Change', function (e, args) {
  //console.log('Tally 5: ' + args.newValue);
  if (args.newValue == 1) {
    tallyFive.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "5") {
          var sdtallyFive = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFive, path.resolve(__dirname, 'assets/stream-deck/5-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "5") {
          var sdtallyFive = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFive, path.resolve(__dirname, 'assets/stream-deck/5-red.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 2) {
    tallyFive.style.backgroundColor = "#5cd65c";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "5") {
          var sdtallyFivePrev = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFivePrev, path.resolve(__dirname, 'assets/stream-deck/5-green.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "5") {
          var sdtallyFive = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFive, path.resolve(__dirname, 'assets/stream-deck/5-green.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 3) {
    tallyFive.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "5") {
          var sdtallyFive = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFive, path.resolve(__dirname, 'assets/stream-deck/5-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "5") {
          var sdtallyFive = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFive, path.resolve(__dirname, 'assets/stream-deck/5-red.png')).then(() => {
          });
        }
      });
    };

  } else {
    tallyFive.style.backgroundColor = "";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "5") {
          var sdtallyFive = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFive, path.resolve(__dirname, 'assets/stream-deck/5-clear.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "5") {
          var sdtallyFive = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyFive, path.resolve(__dirname, 'assets/stream-deck/5-clear.png')).then(() => {
          });
        }
      });
    };

  }
});

// TALLY 6
var tally6 = {};
var proxyObj6 = objChange(tally6, ['tally6Change']);
proxyObj6.on('change:tally6Change', function (e, args) {
  //console.log('Tally 6: ' + args.newValue);
  if (args.newValue == 1) {
    tallySix.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "6") {
          var sdtallySix = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySix, path.resolve(__dirname, 'assets/stream-deck/6-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "6") {
          var sdtallySix = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySix, path.resolve(__dirname, 'assets/stream-deck/6-red.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 2) {
    tallySix.style.backgroundColor = "#5cd65c";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "6") {
          var sdtallySixPrev = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySixPrev, path.resolve(__dirname, 'assets/stream-deck/6-green.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "6") {
          var sdtallySix = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySix, path.resolve(__dirname, 'assets/stream-deck/6-green.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 3) {
    tallySix.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "6") {
          var sdtallySix = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySix, path.resolve(__dirname, 'assets/stream-deck/6-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "6") {
          var sdtallySix = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySix, path.resolve(__dirname, 'assets/stream-deck/6-red.png')).then(() => {
          });
        }
      });
    };

  } else {
    tallySix.style.backgroundColor = "";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "6") {
          var sdtallySix = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySix, path.resolve(__dirname, 'assets/stream-deck/6-clear.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "6") {
          var sdtallySix = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySix, path.resolve(__dirname, 'assets/stream-deck/6-clear.png')).then(() => {
          });
        }
      });
    };
  }
});

// TALLY 7
var tally7 = {};
var proxyObj7 = objChange(tally7, ['tally7Change']);
proxyObj7.on('change:tally7Change', function (e, args) {
  //console.log('Tally 7: ' + args.newValue);
  if (args.newValue == 1) {
    tallySeven.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "7") {
          var sdtallySeven = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySeven, path.resolve(__dirname, 'assets/stream-deck/7-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "7") {
          var sdtallySeven = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySeven, path.resolve(__dirname, 'assets/stream-deck/7-red.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 2) {
    tallySeven.style.backgroundColor = "#5cd65c";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "7") {
          var sdtallySevenPrev = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySevenPrev, path.resolve(__dirname, 'assets/stream-deck/7-green.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "7") {
          var sdtallySeven = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySeven, path.resolve(__dirname, 'assets/stream-deck/7-green.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 3) {
    tallySeven.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "7") {
          var sdtallySeven = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySeven, path.resolve(__dirname, 'assets/stream-deck/7-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "7") {
          var sdtallySeven = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySeven, path.resolve(__dirname, 'assets/stream-deck/7-red.png')).then(() => {
          });
        }
      });
    };

  } else {
    tallySeven.style.backgroundColor = "";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "7") {
          var sdtallySeven = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySeven, path.resolve(__dirname, 'assets/stream-deck/7-clear.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "7") {
          var sdtallySeven = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallySeven, path.resolve(__dirname, 'assets/stream-deck/7-clear.png')).then(() => {
          });
        }
      });
    };

  }
});

// TALLY 8
var tally8 = {};
var proxyObj8 = objChange(tally8, ['tally8Change']);
proxyObj8.on('change:tally8Change', function (e, args) {
  //console.log('Tally 8: ' + args.newValue);
  if (args.newValue == 1) {
    tallyEight.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "8") {
          var sdtallyEight = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyEight, path.resolve(__dirname, 'assets/stream-deck/8-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "8") {
          var sdtallyEight = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyEight, path.resolve(__dirname, 'assets/stream-deck/8-red.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 2) {
    tallyEight.style.backgroundColor = "#5cd65c";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "8") {
          var sdtallyEightPrev = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyEightPrev, path.resolve(__dirname, 'assets/stream-deck/8-green.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "8") {
          var sdtallyEight = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyEight, path.resolve(__dirname, 'assets/stream-deck/8-green.png')).then(() => {
          });
        }
      });
    };

  } else if (args.newValue == 3) {
    tallyEight.style.backgroundColor = "#ff4d4d";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "8") {
          var sdtallyEight = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyEight, path.resolve(__dirname, 'assets/stream-deck/8-red.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "8") {
          var sdtallyEight = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyEight, path.resolve(__dirname, 'assets/stream-deck/8-red.png')).then(() => {
          });
        }
      });
    };

  } else {
    tallyEight.style.backgroundColor = "";
    // STREAM DECK TALLY
    for (var i = 0; i < 15; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "atemPreview" && data.value == "8") {
          var sdtallyEight = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyEight, path.resolve(__dirname, 'assets/stream-deck/8-clear.png')).then(() => {
          });
        } else if (data.class == "atemProgram" && data.value == "8") {
          var sdtallyEight = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sdtallyEight, path.resolve(__dirname, 'assets/stream-deck/8-clear.png')).then(() => {
          });
        }
      });
    };

  }
});


// ATEM TALLY PUSH TO INFERFACE
atem.on('stateChanged', function(err, state) {

  //console.log(atem.state);

proxyObj1.tally1Change = atem.state.tallys[0];
proxyObj2.tally2Change = atem.state.tallys[1];
proxyObj3.tally3Change = atem.state.tallys[2];
proxyObj4.tally4Change = atem.state.tallys[3];
proxyObj5.tally5Change = atem.state.tallys[4];
proxyObj6.tally6Change = atem.state.tallys[5];
proxyObj7.tally7Change = atem.state.tallys[6];
proxyObj8.tally8Change = atem.state.tallys[7];

});

// APP INTERFACE BUTTONS //
// TALLY RECORD
document.getElementById('tallyRecord').addEventListener('click', function () {
  recordStopStart();
});
// TALLY MARK
document.getElementById('tallyMark').addEventListener('click', function () {
  addMarker();
});
document.getElementById('tallyMark').addEventListener('mouseout', function () {
  tallyMark.style.backgroundColor = "";
});
// TALLY CUT
document.getElementById('tallyCut').addEventListener('click', function () {
  atem.cutTransition();
  tallyCut.style.backgroundColor = "#ff4d4d";
  console.log('ATEM Cut');
});
document.getElementById('tallyCut').addEventListener('mouseout', function () {
  tallyCut.style.backgroundColor = "";
});
// TALLY AUTO
document.getElementById('tallyAuto').addEventListener('click', function () {
  atem.autoTransition();
  tallyAuto.style.backgroundColor = "#ff4d4d";
  console.log('ATEM Auto');
});
document.getElementById('tallyAuto').addEventListener('mouseout', function () {
  tallyAuto.style.backgroundColor = "";
});
// TALLY ONE
document.getElementById('tallyOne').addEventListener('click', function () {
  atem.changePreviewInput(1);
  console.log('ATEM Preview 1');
});
// TALLY TWO
document.getElementById('tallyTwo').addEventListener('click', function () {
  atem.changePreviewInput(2);
  console.log('ATEM Preview 2');
});
// TALLY THREE
document.getElementById('tallyThree').addEventListener('click', function () {
  atem.changePreviewInput(3);
  console.log('ATEM Preview 3');
});
// TALLY FOUR
document.getElementById('tallyFour').addEventListener('click', function () {
atem.changePreviewInput(4);
console.log('ATEM Preview 4');
});
// TALLY FIVE
document.getElementById('tallyFive').addEventListener('click', function () {
  atem.changePreviewInput(5);
  console.log('ATEM Preview 5');
});
// TALLY SIX
document.getElementById('tallySix').addEventListener('click', function () {
  atem.changePreviewInput(6);
  console.log('ATEM Preview 6');
});
// TALLY SEVEN
document.getElementById('tallySeven').addEventListener('click', function () {
  atem.changePreviewInput(7);
  console.log('ATEM Preview 7');
});
// TALLY EIGHT
document.getElementById('tallyEight').addEventListener('click', function () {
  atem.changePreviewInput(8);
  console.log('ATEM Preview 8');
});


// RECORDING NAME //
document.getElementById('recordingNameSet').addEventListener('click', function () {
  var recordingName = document.getElementById('recordingRecordingName').value;
  storage.set('recording-name', { recordingName: recordingName }, function(error) {
    if (error) throw error;
  });
});


// RECORD START/STOP and START TIMECODE //
var recordingState = 0;
// var stopwatch = new Stopwatch();
function recordStopStart() {
  if (recordingState == 0) {
    //wirecast.wirecastStartRecord();
    hyperdeck.record();
    //stopwatch.start();
    console.log( 'Started Recording' );
    recordingState = 1;
    tallyRecord.style.backgroundColor = "#ff4d4d";
    tallyRecord.innerText = "Stop";
    var d = new Date();
    var d2 = d.toISOString().slice(0,10);
    storage.get('recording-name', function(error, data) {
      if (error) throw error;
      tcToTxt.write(data.recordingName+" - "+d2+"\n");
    });
    for (var i = 0; i < 14; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        if (data.class == "hyperdeckRec") {
          var sd = data.name - 1 + 1;
          myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/stop-red.png')).then(() => {
          });
        }
      });
    };

  } else {
    // STOP RECORDING
    //wirecast.wirecastStopRecord();
    hyperdeck.stop();
    console.log( 'Stopped Recording' );
    recordingState = 0;
    tallyRecord.style.backgroundColor = "";
    tallyRecord.innerText = "Rec ";
    // STOP AND RESET STOPWATCH
    // stopwatch.stop();
    // stopwatch.reset();
    // CLOSE OUT LI AND CREATE A NEW ONE
    // var node = document.createElement("li");
    // var textnode = document.createTextNode('- - - - - - - -');
    // node.appendChild(textnode);
    // document.getElementById("addMarkers").appendChild(node);
    tcToTxt.write("- - - - - - \n");
    for (var i = 0; i < 14; i++) {
      storage.get('sd'+i+'-button', function(error, data) {
        if (error) throw error;
        //console.log(data);
        if (data.class == "hyperdeckRec") {
          //console.log(data);
          var sd = data.name - 1 + 1;
          // STREAM DECK TALLY
          myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/rec-clear.png')).then(() => {
          });
        }
      });
    };
  }
};

// ADD MARKERS BASED ON TIME ELAPSED //
function addMarker() {
  if (recordingState == 1) {
    var timecodeHyperDeck = hyperdeck.transportInfo().then((responseJSON) => {
       // do stuff with responseJSON here...
       console.dir(responseJSON.params.timecode);
       tcToTxt.write(responseJSON.params.timecode+"\n");
       });
     let notificationMarkerAdded = new Notification('Marker Added!', {
         body: 'Marker added to log file'
       })
    //notificationMarkerAdded.onclick();
  }
};

// SELECT CONTROLLER //
var select = document.querySelector('select');
var controller;
select.addEventListener('change', contollerConnect);

function contollerConnect(e) {
  ipcRenderer.send('asynchronous-message', e.target.value)
  var controller = new GamePad(e.target.value);
  controller.connect();
  controllerConnectionLED.style.backgroundColor = "#5cd65c";

  // R1 and  R2
  controller.on( 'r1:press', function() {
    storage.get('cbr1-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        tallyCut.style.backgroundColor = "#ff4d4d";
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        tallyAuto.style.backgroundColor = "#ff4d4d";
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cbr1-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( 'r1:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });
  controller.on( 'r2:press', function() {
    storage.get('cbr2-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cbr2-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( 'r2:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });
  // L1 and  L2
  controller.on( 'l1:press', function() {
    storage.get('cbl1-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        tallyCut.style.backgroundColor = "#ff4d4d";
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        tallyAuto.style.backgroundColor = "#ff4d4d";
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cbl1-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( 'l1:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });
  controller.on( 'l2:press', function() {
    storage.get('cbl2-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cbl2-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( 'l2:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });

  // ATEM PREVIEW ROW 1 to 4
  controller.on( '1:press', function() {
    storage.get('cb1-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cb1-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( '1:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });
  controller.on( '2:press', function() {
    storage.get('cb2-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cb2-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( '2:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });
  controller.on( '3:press', function() {
    storage.get('cb3-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cb3-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( '3:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });
  controller.on( '4:press', function() {
    storage.get('cb4-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cb4-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( '4:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });

  // START BUTTON
  controller.on( 'start:press', function () {
    storage.get('cbstart-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cbstart-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( 'start:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });
  // SELECT BUTTON
  controller.on( 'select:press', function() {
    storage.get('cbselect-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
    storage.get('cbselect-button-midi', function(error, data) {
      if (error) throw error;
      output.sendMessage([176,data.note,127]);
      controller.on( 'select:release', function() {
        output.sendMessage([176,data.note,0]);
        tallyCut.style.backgroundColor = "";
        tallyAuto.style.backgroundColor = "";
      });
    });
  });

  // CONTROLLERMATE OUTPUT BUTTONS //
  // ZOOM IN and OUT
  // L1 and L2
  storage.get('cbl1-button-midi', function(error, data) {
    if (error) throw error;
    controller.on( 'l1:press', function() {
        output.sendMessage([176,data.note,127]);
    });
    controller.on( 'l1:release', function() {
      output.sendMessage([176,data.note,0]);
    });
  });
  storage.get('cbl2-button-midi', function(error, data) {
    if (error) throw error;
    controller.on( 'l2:press', function() {
        output.sendMessage([176,data.note,127]);
    });
    controller.on( 'l2:release', function() {
      output.sendMessage([176,data.note,0]);
    });
  });
  // HATSWITCH
  controller.on( 'dpadUp:press', function() {
    output.sendMessage([176,52,2]);
  });
  controller.on( 'dpadUp:release', function() {
    output.sendMessage([176,52,0]);
  });
  controller.on( 'dpadRight:press', function() {
    output.sendMessage([176,52,4]);
  });
  controller.on( 'dpadRight:release', function() {
    output.sendMessage([176,52,0]);
  });
  controller.on( 'dpadDown:press', function() {
    output.sendMessage([176,52,6]);
  });
  controller.on( 'dpadDown:release', function() {
    output.sendMessage([176,52,0]);
  });
  controller.on( 'dpadLeft:press', function() {
    output.sendMessage([176,52,8]);
  });
  controller.on( 'dpadLeft:release', function() {
    output.sendMessage([176,52,0]);
  });
  // LEFT JOYSTICK
  controller.on( 'left:move', function() {
    output.sendMessage([176,53,controller._states.left.x]);
    output.sendMessage([176,54,controller._states.left.y]);
  });
  // RIGHT JOYSTICK
  controller.on( 'right:move', function() {
    output.sendMessage([176,55,controller._states.right.x]);
    output.sendMessage([176,56,controller._states.right.y]);
  });
};


document.getElementById('streamDeckConnect').addEventListener('click', streamDeckConnect);



const myStreamDeck = new StreamDeck();

// STREAM DECK CONNECT //
function streamDeckConnect() {

  streamDeckConnectLED.style.backgroundColor = "#5cd65c";

  myStreamDeck.on('error', error => {
      console.error(error);
      streamDeckConnectLED.style.backgroundColor = "#ff4d4d";
  });
  // KEY UP TO REST CUT/AUTO TALLY
  myStreamDeck.on('up', keyIndex => {
    tallyCut.style.backgroundColor = "";
    tallyAuto.style.backgroundColor = "";
  });

  // ALL STREAM DECK BUTTON FUNCTIONS
  myStreamDeck.on('down', keyIndex => {
    storage.get('sd'+keyIndex+'-button', function(error, data) {
      if (error) throw error;
      if (data.class == 'atemCut') {
        atem.cutTransition();
        tallyCut.style.backgroundColor = "#ff4d4d";
        console.log('ATEM Cut');
      } else if (data.class == 'atemAuto') {
        atem.autoTransition();
        tallyAuto.style.backgroundColor = "#ff4d4d";
        console.log('ATEM Auto');
      } else if (data.class == 'atemPreview') {
        atem.changePreviewInput(data.value);
        console.log('ATEM Preview '+data.value);
      } else if (data.class == 'atemProgram') {
        atem.changeProgramInput(data.value);
        console.log('ATEM Program '+data.value);
      } else if (data.class == 'atemAux') {
        atem.changeAuxInput(0, data.value);
        console.log('ATEM Aux '+data.value);
      } else if (data.class == 'atemMacroRun') {
        atem.runMacro(data.value);
        console.log('ATEM Macro '+data.value);
      } else if (data.class == 'hyperdeckMark') {
        addMarker();
      } else if (data.class == 'hyperdeckRec') {
        recordStopStart();
      } else if (data.class == 'hyperdeckPlay') {
        hyperdeck.play();
        console.log('HyperDeck Play');
      } else if (data.class == 'hyperdeckStop') {
        hyperdeck.stop();
        console.log('HyperDeck Stop');
      } else if (data.class == 'hyperdeckNext') {
        hyperdeck.goToClip("+", 1);
        console.log('HyperDeck Next');
      } else if (data.class == 'hyperdeckPrevious') {
        hyperdeck.goToClip("-", 1);
        console.log('HyperDeck Previous');
      };
    });
  });


  // ALL STREAM DECK BUTTON IMAGES
  for (var i = 0; i < 15; i++) {
    storage.get('sd'+i+'-button', function(error, data) {
      if (error) throw error;
      var sd = data.name - 1 + 1;
      if (data.class == 'disabled') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/clear.png')).then(() => {
        });
      } else if (data.class == 'atemCut') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/cut-clear.png')).then(() => {
        });
      } else if (data.class == 'atemAuto') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/auto-clear.png')).then(() => {
        });
      } else if (data.class == 'atemAux') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/'+data.value+'-clear.png')).then(() => {
        });
      } else if (data.class == 'atemMacroRun') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/'+data.value+'-macro-clear.png')).then(() => {
        });
      } else if (data.class == 'hyperdeckRec') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/rec-clear.png')).then(() => {
        });
      } else if (data.class == 'hyperdeckMark') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/mark-clear.png')).then(() => {
        });
      } else if (data.class == 'hyperdeckPlay') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/play-clear.png')).then(() => {
        });
      } else if (data.class == 'hyperdeckStop') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/stop-clear.png')).then(() => {
        });
      } else if (data.class == 'hyperdeckNext') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/forward-clear.png')).then(() => {
        });
      } else if (data.class == 'hyperdeckPrevious') {
        myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, 'assets/stream-deck/back-clear.png')).then(() => {
        });
      };
    });
  };
};



// MIDI //
// Set up a new input.
var input = new midi.input();

// Configure a callback.
input.on('message', function(deltaTime, message) {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log('m:' + message);

  // Cut Auto
  if (message == '176,95,127') {
    atem.cutTransition();
  };
  if (message == '176,95,0') {
    tallyCut.style.backgroundColor = "";
  };
  if (message == '176,96,127') {
    atem.autoTransition();
  };
  if (message == '176,96,0') {
    tallyAuto.style.backgroundColor = "";
  };


  if (message == '176,80,127') {
  hyperdeck.goToClip("-", 1);
  };
  if (message == '176,81,127') {
  hyperdeck.goToClip("+", 1);
  };
  if (message == '176,82,127') {
  hyperdeck.stop();
  };
  if (message == '176,83,127') {
  hyperdeck.play();
  };
  if (message == '176,84,127') {
    recordStopStart();
  };
  if (message == '176,84,0') {
    recordStopStart();
  };
  if (message == '176,85,0') {
    addMarker();
  };

  // ATEM Preview
  // Preview 1
  if (message == '176,1,127') {
    atem.changePreviewInput(1);
  };
  // Preview 2
  if (message == '176,2,127') {
    atem.changePreviewInput(2);
  };
  // Preview 3
  if (message == '176,3,127') {
    atem.changePreviewInput(3);
  };
  // Preview 4
  if (message == '176,4,127') {
    atem.changePreviewInput(4);
  };
  // Preview 5
  if (message == '176,5,127') {
    atem.changePreviewInput(5);
  };
  // Preview 6
  if (message == '176,6,127') {
    atem.changePreviewInput(6);
  };
  // Preview 7
  if (message == '176,7,127') {
    atem.changePreviewInput(7);
  };
  // Preview 8
  if (message == '176,8,127') {
    atem.changePreviewInput(8);
  };

  // ATEM Program
  // Program 1
  if (message == '176,9,127') {
    atem.changeProgramInput(1);
  };
  // Program 2
  if (message == '176,10,127') {
    atem.changeProgramInput(2);
  };
  // Program 3
  if (message == '176,11,127') {
    atem.changeProgramInput(3);
  };
  // Program 4
  if (message == '176,12,127') {
    atem.changeProgramInput(4);
  };
  // Program 5
  if (message == '176,13,127') {
    atem.changeProgramInput(5);
  };
  // Program 6
  if (message == '176,14,127') {
    atem.changeProgramInput(6);
  };
  // Program 7
  if (message == '176,15,127') {
    atem.changeProgramInput(7);
  };
  // Program 8
  if (message == '176,16,127') {
    atem.changeProgramInput(8);
  };

  // ATEM Macro Run
  // Macro 0
  if (message == '176,17,127') {
    atem.runMacro(0);
  };
  // Macro 1
  if (message == '176,18,127') {
    atem.runMacro(1);
  };
  // Macro 2
  if (message == '176,19,127') {
    atem.runMacro(2);
  };
  // Macro 3
  if (message == '176,20,127') {
    atem.runMacro(3);
  };
  // Macro 4
  if (message == '176,21,127') {
    atem.runMacro(4);
  };
  // Macro 5
  if (message == '176,22,127') {
    atem.runMacro(5);
  };
  // Macro 6
  if (message == '176,23,127') {
    atem.runMacro(6);
  };
  // Macro 7
  if (message == '176,24,127') {
    atem.runMacro(7);
  };


});

// TURN INPUT MIDI ON
var midiOn = document.getElementById('inputMidiOn').addEventListener ('click', turnMidiOn);
function turnMidiOn(e) {
  console.log(inputMidiOn.value);
  input.getPortCount();
  input.getPortName(0);
  input.openPort(0);
  input.ignoreTypes(false, false, false);
};

// TURN INPUT OFF
var midiOff = document.getElementById('inputMidiOff').addEventListener ('click', turnMidiOff);
function turnMidiOff(e) {
  console.log(inputMidiOff.value);
  input.closePort(0);
}

// MIDI OUTPUT //
var output = new midi.output();

// TURN OUTPUT MIDI ON
var midiOuputOn = document.getElementById('outputMidiOn').addEventListener ('click', turnOuputMidiOn);
function turnOuputMidiOn(e) {
  console.log('Output MIDI On');
  output.openVirtualPort("ATEM USB MIDI OUTPUT");

  output.sendMessage([176,22,1]);
};

// TURN OUTPUT OFF
var midiOuputOff = document.getElementById('outputMidiOff').addEventListener ('click', turnOuputMidiOff);
function turnOuputMidiOff(e) {
  console.log('Output MIDI Off');
  output.closePort();
}





//
