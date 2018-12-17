var midi = require("midi");
const storage = require("electron-json-storage");
const chokidar = require("chokidar");
// const midiOutput = require("midi");

const atem = require("./atem");
const tally = require("./tally");

// MIDI //
// MIDI OUTPUT //
// var output = new midi.output();

// function turnOuputMidiOn(e) {
// 	console.log("Output MIDI On");

// 	console.log(output.getPortCount(), output.getPortName(0));

// 	output.openPort(0);
// }

// MIDI TALLY //

const dataPath = storage.getDataPath();

const midiLEDArray = [8, 9, 10, 11, 12, 13, 14, 15];
// console.log(midiLEDArray);
// chokidar
// 	.watch(dataPath + "/tallys.json", { ignored: /(^|[\/\\])\../ })
// 	.on("all", (event, path) => {
// 		storage.get("tallys", function(error, data) {
// 			if (error) throw error;
// 			console.log(data.tallys);
// 			midiLEDArray.forEach((element, index) => {
// 				if (data.tallys[index] == 2 || data.tallys[index] == 3) {
// 					output.sendMessage([154, element, 1]);
// 				} else if (data.tallys[index] == 0 || data.tallys[index] == 1) {
// 					output.sendMessage([154, element, 0]);
// 				}
// 			});
// 		});
// 	});

// Set up a new input.
var input = new midi.input();

// TURN INPUT MIDI ON
input.getPortCount();
var midiPortCount = input.getPortCount();

const select = document.getElementById("midiSelect");

for (var i = 0; i < midiPortCount; i++) {
	console.log(input.getPortName(i));

	var midiControlleri = document.createElement("option");
	midiControlleri.text = input.getPortName(i);
	midiControlleri.setAttribute("value", i);
	select.appendChild(midiControlleri);
	document.getElementById("midiSelect").appendChild(midiControlleri);
}

document.getElementById("midiSelect").addEventListener("change", openMidiPort);
function openMidiPort(e) {
	var portNum = parseInt(e.target.value);
	input.openPort(portNum);
	input.ignoreTypes(false, false, false);

	// turnOuputMidiOn();
}

// Configure a callback.
input.on("message", function(deltaTime, message) {
	// The message is an array of numbers corresponding to the MIDI bytes:
	//   [status, data1, data2]
	// https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
	// information interpreting the messages.
	console.log("m:" + message);

	// Cut Auto
	if (message == "154,23,127") {
		atem.transition("cut");
	}
	if (message == "176,80,127") {
		atem.transition("auto");
	}

	// AUDIO //
	// Master Audio //
	if (message[0] == "186" && message[1] == "18") {
		const audioVol = message[2] / 127;
		atem.masterAudio(audioVol);
	}

	if (message == "176,80,127") {
		hyperdeck.goToClip("-", 1);
	}
	if (message == "176,81,127") {
		hyperdeck.goToClip("+", 1);
	}
	if (message == "176,82,127") {
		hyperdeck.stop();
	}
	if (message == "176,83,127") {
		hyperdeck.play();
	}
	if (message == "176,84,127") {
		recordStopStart();
	}
	if (message == "176,84,0") {
		recordStopStart();
	}
	if (message == "176,85,0") {
		addMarker();
	}

	// ATEM Preview
	// Preview 1
	if (message == "154,8,127") {
		atem.source("preview", 1);
	}
	// Preview 2
	if (message == "154,9,127") {
		atem.source("preview", 2);
	}
	// Preview 3
	if (message == "154,10,127") {
		atem.source("preview", 3);
	}
	// Preview 4
	if (message == "154,11,127") {
		atem.source("preview", 4);
	}
	// Preview 5
	if (message == "154,12,127") {
		atem.source("preview", 5);
	}
	// Preview 6
	if (message == "154,13,127") {
		atem.source("preview", 6);
	}
	// Preview 7
	if (message == "154,14,127") {
		atem.source("preview", 7);
	}
	// Preview 8
	if (message == "154,15,127") {
		atem.source("preview", 8);
	}

	// ATEM Program
	// Program 1
	if (message == "176,9,127") {
		atem.changeProgramInput(1);
	}
	// Program 2
	if (message == "176,10,127") {
		atem.changeProgramInput(2);
	}
	// Program 3
	if (message == "176,11,127") {
		atem.changeProgramInput(3);
	}
	// Program 4
	if (message == "176,12,127") {
		atem.changeProgramInput(4);
	}
	// Program 5
	if (message == "176,13,127") {
		atem.changeProgramInput(5);
	}
	// Program 6
	if (message == "176,14,127") {
		atem.changeProgramInput(6);
	}
	// Program 7
	if (message == "176,15,127") {
		atem.changeProgramInput(7);
	}
	// Program 8
	if (message == "176,16,127") {
		atem.changeProgramInput(8);
	}

	// ATEM Macro Run
	// Macro 0
	if (message == "176,17,127") {
		atem.runMacro(0);
	}
	// Macro 1
	if (message == "176,18,127") {
		atem.runMacro(1);
	}
	// Macro 2
	if (message == "176,19,127") {
		atem.runMacro(2);
	}
	// Macro 3
	if (message == "176,20,127") {
		atem.runMacro(3);
	}
	// Macro 4
	if (message == "176,21,127") {
		atem.runMacro(4);
	}
	// Macro 5
	if (message == "176,22,127") {
		atem.runMacro(5);
	}
	// Macro 6
	if (message == "176,23,127") {
		atem.runMacro(6);
	}
	// Macro 7
	if (message == "176,24,127") {
		atem.runMacro(7);
	}
});
