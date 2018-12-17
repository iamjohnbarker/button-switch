const StreamDeck = require("elgato-stream-deck");
const { ipcRenderer } = require("electron");
const storage = require("electron-json-storage");
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const dataPath = storage.getDataPath();

const atem = require("./atem");
const hyperdeck = require("./hyperdeck");

// STREAM DECK CONNECT //

let myStreamDeck;

ipcRenderer.on("streamdeck-reboot", (event, arg) => {
	images();
});

const connect = () => {
	streamDeckConnectLED.style.backgroundColor = "#ff4d4d";

	myStreamDeck = new StreamDeck();

	streamDeckConnectLED.style.backgroundColor = "#5cd65c";
	document.getElementById("streamdeck__error").innerText = "";
	streamDeckConnect.disabled = true;
	streamDeckConnect.innerText = "Connected";

	chokidar
		.watch(dataPath + "/tallys.json", { ignored: /(^|[\/\\])\../ })
		.on("all", (event, path) => {
			storage.get("tallys", function(error, data) {
				if (error) throw error;
				tally(data.tallys);
			});
		});
	chokidar
		.watch(dataPath + "/hyperdeck.json", { ignored: /(^|[\/\\])\../ })
		.on("all", (event, path) => {
			storage.get("hyperdeck", function(error, data) {
				if (error) throw error;
				hyperdeckStatus(data.status);
			});
		});

	myStreamDeck.on("error", error => {
		console.log(error);
		streamDeckConnectLED.style.backgroundColor = "#ff4d4d";
	});
	// KEY UP TO REST CUT/AUTO TALLY
	myStreamDeck.on("up", keyIndex => {
		tallyCut.style.backgroundColor = "";
		tallyAuto.style.backgroundColor = "";
	});

	// ALL STREAM DECK BUTTON FUNCTIONS
	myStreamDeck.on("down", keyIndex => {
		storage.get("sd" + keyIndex + "-button", function(error, data) {
			if (error) throw error;
			if (data.class == "atemCut") {
				atem.transition("cut");
				tallyCut.style.backgroundColor = "#ff4d4d";
			} else if (data.class == "atemAuto") {
				atem.transition("auto");
				tallyAuto.style.backgroundColor = "#ff4d4d";
			} else if (data.class == "atemPreview") {
				atem.source("preview", data.value);
			} else if (data.class == "atemProgram") {
				atem.source("program", data.value);
			} else if (data.class == "atemAux") {
				atem.source("aux", data.value);
			} else if (data.class == "atemMacroRun") {
				atem.macro(data.value);
				// } else if (data.class == "hyperdeckMark") {
				// 	addMarker();
			} else if (data.class == "hyperdeckRec") {
				hyperdeck.record();
			} else if (data.class == "hyperdeckPlay") {
				hyperdeck.play();
				console.log("HyperDeck Play");
			} else if (data.class == "hyperdeckStop") {
				hyperdeck.stop();
				console.log("HyperDeck Stop");
			} else if (data.class == "hyperdeckNext") {
				hyperdeck.nextClip();
				console.log("HyperDeck Next");
			} else if (data.class == "hyperdeckPrevious") {
				hyperdeck.prevClip();
				console.log("HyperDeck Previous");
			}
		});
	});

	images();
};

const images = () => {
	// ALL STREAM DECK BUTTON IMAGES
	for (var i = 0; i < 15; i++) {
		storage.get("sd" + i + "-button", function(error, data) {
			if (error) throw error;
			var sd = data.name - 1 + 1;
			if (data.class == "disabled") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/clear.png")
				);
			} else if (data.class == "atemCut") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/cut-clear.png")
				);
			} else if (data.class == "atemAuto") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/auto-clear.png")
				);
			} else if (data.class == "atemPreview") {
				const url = `../assets/stream-deck/${data.value}-clear.png`;
				myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
			} else if (data.class == "atemAux") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(
						__dirname,
						"../assets/stream-deck/" + data.value + "-clear.png"
					)
				);
			} else if (data.class == "atemMacroRun") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(
						__dirname,
						"../assets/stream-deck/" + data.value + "-macro-clear.png"
					)
				);
			} else if (data.class == "hyperdeckRec") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/rec-clear.png")
				);
			} else if (data.class == "hyperdeckMark") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/mark-clear.png")
				);
			} else if (data.class == "hyperdeckPlay") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/play-clear.png")
				);
			} else if (data.class == "hyperdeckStop") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/stop-clear.png")
				);
			} else if (data.class == "hyperdeckNext") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/forward-clear.png")
				);
			} else if (data.class == "hyperdeckPrevious") {
				myStreamDeck.fillImageFromFile(
					sd,
					path.resolve(__dirname, "../assets/stream-deck/back-clear.png")
				);
			}
		});
	}
};

const tally = tallys => {
	tallys.forEach((tallyStatus, index) => {
		const indexPlus = index + 1;
		if (tallyStatus != 0) {
			console.log("position", indexPlus);
			console.log("tallyStatus", tallyStatus);

			for (var i = 0; i < 15; i++) {
				storage.get("sd" + i + "-button", function(error, data) {
					if (error) throw error;
					var sd = data.name - 1 + 1;
					if (data.class == "atemPreview") {
						let valuePlus = parseInt(data.value) - 1;
						let valueString = valuePlus.toString();
						if (tallys[valueString] == 0) {
							const url = `../assets/stream-deck/${data.value}-clear.png`;
							myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
						} else if (tallys[valueString] == 1) {
							const url = `../assets/stream-deck/${data.value}-red.png`;
							myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
						} else if (tallys[valueString] == 2) {
							const url = `../assets/stream-deck/${data.value}-green.png`;
							myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
						} else if (tallys[valueString] == 3) {
							const url = `../assets/stream-deck/${data.value}-red.png`;
							myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
						}
					}
					if (data.class == "atemProgram") {
						let valuePlus = parseInt(data.value) - 1;
						let valueString = valuePlus.toString();
						if (tallys[valueString] == 0) {
							const url = `../assets/stream-deck/${data.value}-clear.png`;
							myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
						} else if (tallys[valueString] == 1) {
							const url = `../assets/stream-deck/${data.value}-red.png`;
							myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
						} else if (tallys[valueString] == 2) {
							const url = `../assets/stream-deck/${data.value}-clear.png`;
							myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
						} else if (tallys[valueString] == 3) {
							const url = `../assets/stream-deck/${data.value}-red.png`;
							myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
						}
					}
				});
			}
		}
	});
};

const hyperdeckStatus = status => {
	for (var i = 0; i < 15; i++) {
		storage.get("sd" + i + "-button", function(error, data) {
			if (error) throw error;
			var sd = data.name - 1 + 1;
			if (data.class == "hyperdeckRec" && status == "record") {
				const url = `../assets/stream-deck/rec-red.png`;
				myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
			} else if (data.class == "hyperdeckRec" && status != "record") {
				const url = `../assets/stream-deck/rec-clear.png`;
				myStreamDeck.fillImageFromFile(sd, path.resolve(__dirname, url));
			}
		});
	}
};

module.exports = { connect, tally };
