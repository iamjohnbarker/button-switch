const electron = require("electron");
const { ipcRenderer } = require("electron");
const unhandled = require("electron-unhandled");

const storage = require("electron-json-storage");
const path = require("path");
const fs = require("fs");
const homedir = require("homedir");

const atem = require("./functionality/atem");
const controller = require("./functionality/controller");
const hyperdeck = require("./functionality/hyperdeck");
const streamdeck = require("./functionality/streamdeck");

// unhandled({
// 	logger: error => {
// 		console.log("Unhandled: ", error.message);
// 		if (error.message.includes("device with path")) {
// 			document.getElementById("streamdeck__error").innerText =
// 				"Quit the official Stream Deck application";
// 		} else if (error.message.includes("No Stream Decks are connected")) {
// 			document.getElementById("streamdeck__error").innerText =
// 				"No Stream Decks connected";
// 		} else if (error.message.includes("device with vendor id")) {
// 			document.getElementById("gamepad__error").innerText =
// 				"No Gamepads connected";
// 		} else if (error.message.includes("hyperdeck is not defined")) {
// 			document.getElementById("hyperdeckConnectionLED").style.backgroundColor =
// 				"#ff4d4d";
// 		}
// 	},
// 	showDialog: false
// });

// SETTINGS JSON FILE //
// const dataPath = storage.getDataPath();
// console.log(dataPath);

// FILL ATEM IP FROM FILE //
storage.get("atem-ip", function(error, data) {
	if (error) throw error;
	if (data.atemIPAddress === undefined) {
		document.getElementById("atemIPAddress").value = "";
	} else {
		document.getElementById("atemIPAddress").value = data.atemIPAddress;
	}
});

// FILL HYPERDECK IP FROM FILE //
storage.get("hyperdeck-ip-address", function(error, data) {
	if (error) throw error;
	if (data.hyperdeckIPAddress === undefined) {
		document.getElementById("ipAddressInputHyperDeck").value = "";
	} else {
		document.getElementById("ipAddressInputHyperDeck").value =
			data.hyperdeckIPAddress;
	}
});

// STREAM DECK //
document
	.getElementById("streamDeckConnect")
	.addEventListener("click", streamdeck.connect);

document.getElementById("streamDeckConfigure").addEventListener("click", () => {
	ipcRenderer.send(
		"streamdeck-configure",
		"Open the Stream Deck Config window"
	);
});

// APP INTERFACE BUTTONS //
// TALLY RECORD
document.getElementById("tallyRecord").addEventListener("click", function() {
	hyperdeck.record();
});
// TALLY PLAY
document.getElementById("tallyPlay").addEventListener("click", function() {
	hyperdeck.play();
});
// TALLY STOP
document.getElementById("tallyStop").addEventListener("click", function() {
	hyperdeck.stop();
});
// TALLY PREV CLIP
document.getElementById("tallyPrevClip").addEventListener("click", function() {
	hyperdeck.prevClip();
});
// TALLY NEXT CLIP
document.getElementById("tallyNextClip").addEventListener("click", function() {
	hyperdeck.nextClip();
});

// TALLY MARK
// document.getElementById("tallyMark").addEventListener("click", function() {
// 	addMarker();
// });
// TALLY CUT
document.getElementById("tallyCut").addEventListener("click", function() {
	atem.transition("cut");
});
// TALLY AUTO
document.getElementById("tallyAuto").addEventListener("click", function() {
	atem.transition("auto");
});
// TALLY ONE
document.getElementById("tallyOne").addEventListener("click", function() {
	atem.source("preview", 1);
});
// TALLY TWO
document.getElementById("tallyTwo").addEventListener("click", function() {
	atem.source("preview", 2);
});
// TALLY THREE
document.getElementById("tallyThree").addEventListener("click", function() {
	atem.source("preview", 3);
});
// TALLY FOUR
document.getElementById("tallyFour").addEventListener("click", function() {
	atem.source("preview", 4);
});
// TALLY FIVE
document.getElementById("tallyFive").addEventListener("click", function() {
	atem.source("preview", 5);
});
// TALLY SIX
document.getElementById("tallySix").addEventListener("click", function() {
	atem.source("preview", 6);
});
// TALLY SEVEN
document.getElementById("tallySeven").addEventListener("click", function() {
	atem.source("preview", 7);
});
// TALLY EIGHT
document.getElementById("tallyEight").addEventListener("click", function() {
	atem.source("preview", 8);
});

/*




// CREATE TXT FILE FOR MARKERS
// var tcToTxt = fs.createWriteStream(
// 	homedir() + "/desktop/button-switch-log.txt",
// 	{
// 		flags: "a" // 'a' means appending (old data will be preserved)
// 	}
// );




// RECORDING NAME //
document
	.getElementById("recordingNameSet")
	.addEventListener("click", function() {
		var recordingName = document.getElementById("recordingRecordingName").value;
		storage.set("recording-name", { recordingName: recordingName }, function(
			error
		) {
			if (error) throw error;
		});
	});

*/

// RECORD START/STOP and START TIMECODE //
// var recordingState = 0;
// // var stopwatch = new Stopwatch();
// function recordStopStart() {
// 	if (recordingState == 0) {
// 		//wirecast.wirecastStartRecord();
// 		hyperdeck.record();
// 		//stopwatch.start();
// 		console.log("Started Recording");
// 		recordingState = 1;
// 		tallyRecord.style.backgroundColor = "#ff4d4d";
// 		tallyRecord.innerText = "Stop";
// 		var d = new Date();
// 		var d2 = d.toISOString().slice(0, 10);
// 		storage.get("recording-name", function(error, data) {
// 			if (error) throw error;
// 			tcToTxt.write(data.recordingName + " - " + d2 + "\n");
// 		});
// 		for (var i = 0; i < 14; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "hyperdeckRec") {
// 					var sd = data.name - 1 + 1;
// 					myStreamDeck
// 						.fillImageFromFile(
// 							sd,
// 							path.resolve(__dirname, "assets/stream-deck/stop-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		// STOP RECORDING
// 		//wirecast.wirecastStopRecord();
// 		hyperdeck.stop();
// 		console.log("Stopped Recording");
// 		recordingState = 0;
// 		tallyRecord.style.backgroundColor = "";
// 		tallyRecord.innerText = "Rec ";
// 		// STOP AND RESET STOPWATCH
// 		// stopwatch.stop();
// 		// stopwatch.reset();
// 		// CLOSE OUT LI AND CREATE A NEW ONE
// 		// var node = document.createElement("li");
// 		// var textnode = document.createTextNode('- - - - - - - -');
// 		// node.appendChild(textnode);
// 		// document.getElementById("addMarkers").appendChild(node);
// 		tcToTxt.write("- - - - - - \n");
// 		for (var i = 0; i < 14; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "hyperdeckRec") {
// 					//console.log(data);
// 					var sd = data.name - 1 + 1;
// 					// STREAM DECK TALLY
// 					myStreamDeck
// 						.fillImageFromFile(
// 							sd,
// 							path.resolve(__dirname, "assets/stream-deck/rec-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// }

// ADD MARKERS BASED ON TIME ELAPSED //
// function addMarker() {
// 	if (recordingState == 1) {
// 		var timecodeHyperDeck = hyperdeck.transportInfo().then(responseJSON => {
// 			// do stuff with responseJSON here...
// 			console.dir(responseJSON.params.timecode);
// 			tcToTxt.write(responseJSON.params.timecode + "\n");
// 		});
// 		let notificationMarkerAdded = new Notification("Marker Added!", {
// 			body: "Marker added to log file"
// 		});
// 		//notificationMarkerAdded.onclick();
// 	}
// }

/*
// MIDI //
// Set up a new input.
var input = new midi.input();

// Configure a callback.
input.on("message", function(deltaTime, message) {
	// The message is an array of numbers corresponding to the MIDI bytes:
	//   [status, data1, data2]
	// https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
	// information interpreting the messages.
	console.log("m:" + message);

	// Cut Auto
	if (message == "176,95,127") {
		atem.cutTransition();
	}
	if (message == "176,95,0") {
		tallyCut.style.backgroundColor = "";
	}
	if (message == "176,96,127") {
		atem.autoTransition();
	}
	if (message == "176,96,0") {
		tallyAuto.style.backgroundColor = "";
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
	if (message == "176,1,127") {
		atem.changePreviewInput(1);
	}
	// Preview 2
	if (message == "176,2,127") {
		atem.changePreviewInput(2);
	}
	// Preview 3
	if (message == "176,3,127") {
		atem.changePreviewInput(3);
	}
	// Preview 4
	if (message == "176,4,127") {
		atem.changePreviewInput(4);
	}
	// Preview 5
	if (message == "176,5,127") {
		atem.changePreviewInput(5);
	}
	// Preview 6
	if (message == "176,6,127") {
		atem.changePreviewInput(6);
	}
	// Preview 7
	if (message == "176,7,127") {
		atem.changePreviewInput(7);
	}
	// Preview 8
	if (message == "176,8,127") {
		atem.changePreviewInput(8);
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

// TURN INPUT MIDI ON
input.getPortCount();
console.log(input.getPortCount());

var midiPortCount = input.getPortCount();
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
	console.log(e.target.value);
	var portNum = parseInt(e.target.value);
	input.openPort(portNum);
	input.ignoreTypes(false, false, false);
}

// MIDI OUTPUT //
var output = new midi.output();

// TURN OUTPUT MIDI ON
var midiOuputOn = document
	.getElementById("outputMidiOn")
	.addEventListener("click", turnOuputMidiOn);
function turnOuputMidiOn(e) {
	console.log("Output MIDI On");
	output.openVirtualPort("BUTTON SWITCH MIDI OUTPUT");
	output.sendMessage([176, 22, 1]);
}

// TURN OUTPUT OFF
var midiOuputOff = document
	.getElementById("outputMidiOff")
	.addEventListener("click", turnOuputMidiOff);
function turnOuputMidiOff(e) {
	console.log("Output MIDI Off");
	output.closePort();
}
*/

// const midi = require("midi");
// const midiOutput = require("midi");
