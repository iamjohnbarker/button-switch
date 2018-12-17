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
