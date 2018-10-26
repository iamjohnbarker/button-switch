const GamePad = require("node-gamepad");
const storage = require("electron-json-storage");
const { ipcRenderer } = require("electron");

const atem = require("./atem");
const hyperdeck = require("./hyperdeck");

var controller;

document.getElementById("gamepadConfigure").addEventListener("click", () => {
	ipcRenderer.send("gamepad-configure", "Open the Gamepage Config window");
});

document.getElementById("controllerSelect").addEventListener("change", e => {
	controllerConnectionLED.style.backgroundColor = "red";
	// ipcRenderer.send("asynchronous-message", e.target.value);
	var controller = new GamePad(e.target.value);
	controller.connect();
	controllerConnectionLED.style.backgroundColor = "#5cd65c";

	// R1
	controller.on("r1:press", function() {
		storage.get("cbr1-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	// R2
	controller.on("r2:press", function() {
		storage.get("cbr2-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	// L1
	controller.on("l1:press", function() {
		storage.get("cbl1-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	// L2
	controller.on("l2:press", function() {
		storage.get("cbl2-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});

	// 1,2,3,4
	controller.on("1:press", function() {
		storage.get("cb1-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	controller.on("2:press", function() {
		storage.get("cb2-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	controller.on("3:press", function() {
		storage.get("cb3-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	controller.on("4:press", function() {
		storage.get("cb4-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	// Square, X, O, Triangle
	controller.on("square:press", function() {
		storage.get("cb1-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	controller.on("x:press", function() {
		storage.get("cb2-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	controller.on("circle:press", function() {
		storage.get("cb3-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	controller.on("triangle:press", function() {
		storage.get("cb4-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});

	// START
	controller.on("start:press", function() {
		storage.get("cbstart-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	// OPTIONS
	controller.on("options:press", function() {
		storage.get("cbstart-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	// SELECT
	controller.on("select:press", function() {
		storage.get("cbselect-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
	// SHARE
	controller.on("share:press", function() {
		storage.get("cbselect-button", function(error, data) {
			if (error) throw error;
			checkButtonFunction(data.class, data.value);
		});
	});
});

const checkButtonFunction = (data, value) => {
	if (data == "atemCut") {
		atem.transition("cut");
	} else if (data == "atemAuto") {
		atem.transition("auto");
	} else if (data == "atemPreview") {
		atem.source("preview", value);
	} else if (data == "atemProgram") {
		atem.source("program", value);
	} else if (data == "atemAux") {
		atem.source("aux", value);
	} else if (data == "atemMacroRun") {
		atem.macro(value);
		// } else if (data == "hyperdeckMark") {
		// 	addMarker();
	} else if (data == "hyperdeckRec") {
		hyperdeck.record();
	} else if (data == "hyperdeckPlay") {
		hyperdeck.play();
	} else if (data == "hyperdeckStop") {
		hyperdeck.stop();
	} else if (data == "hyperdeckNext") {
		hyperdeck.nextClip();
	} else if (data == "hyperdeckPrevious") {
		hyperdeck.prevClip();
	}
};
