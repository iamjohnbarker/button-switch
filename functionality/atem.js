var ATEM = require("applest-atem");
const objChange = require("object-change");
const storage = require("electron-json-storage");
const path = require("path");
const fs = require("fs");
const homedir = require("homedir");

console.log(homedir());

const tally = require("./tally");

var atem = new ATEM();

document.getElementById("ipAddressBtn").addEventListener("click", e => {
	e.preventDefault();
	storage.set("atem-ip", { atemIPAddress: atemIPAddress.value }, function(
		error
	) {
		if (error) throw error;
	});
	console.log(atemIPAddress.value);
	var atemIP = atemIPAddress.value;
	connect(atemIP);
});

const connect = ip => {
	document.getElementById("atemConnectionLED").style.backgroundColor =
		"#ff4d4d";
	console.log("conecting to atem at", ip);
	atem.connect(ip);

	atem.on("connect", () => {
		console.log("Connected to ATEM");
		console.log("ATEM STATE:", atem.state);
		atemConnectionLED.style.backgroundColor = "#5cd65c";
	});
};

atem.on("disconnect", () => {
	console.log("Disconnected from ATEM");
	atemConnectionLED.style.backgroundColor = "";
});

const transition = tranisitionType => {
	if (tranisitionType == "cut") {
		atem.cutTransition();
		console.log("ATEM Cut");
	}
	if (tranisitionType == "auto") {
		atem.autoTransition();
		console.log("ATEM Auto");
	}
};

const source = (type, source) => {
	if (type == "preview") {
		atem.changePreviewInput(source);
		console.log("ATEM Preview " + source);
	} else if (type == "program") {
		atem.changeProgramInput(source);
		console.log("ATEM Program " + source);
	} else if (type == "aux") {
		atem.changeAuxInput(0, source);
		console.log("ATEM AUX 1 " + source);
	}
};

const macro = macro => {
	atem.runMacro(macro);
	console.log("ATEM Macro " + macro);
};

const masterAudio = gain => {
	atem.changeAudioMasterGain(gain);
};

// TALLYS //
atem.on("stateChanged", function(err, state) {
	// console.log(atem.state.tallys);
	proxyObj.tallyChange = atem.state.tallys;
});
var tallys = {};
var proxyObj = objChange(tallys, ["tallyChange"]);
proxyObj.on("change:tallyChange", function(e, args) {
	tally.change(atem.state.tallys);
	storage.set("tallys.json", { tallys: atem.state.tallys }, function(error) {
		if (error) throw error;
	});
});

module.exports = {
	atem,
	connect,
	transition,
	source,
	macro,
	masterAudio
};
