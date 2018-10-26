const ATEM = require("applest-atem");
const objChange = require("object-change");
const storage = require("electron-json-storage");
const path = require("path");
const fs = require("fs");
const homedir = require("homedir");

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

module.exports = { atem, connect, transition, source, macro };

// // ALL TALLY //
// // TALLY 1
// var tally1 = {};
// var proxyObj1 = objChange(tally1, ["tally1Change"]);
// proxyObj1.on("change:tally1Change", function(e, args) {
// 	//console.log('Tally 1: ' + args.newValue);
// 	if (args.newValue == 1) {
// 		tallyOne.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "1") {
// 					var sdTallyOne = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdTallyOne,
// 							path.resolve(__dirname, "assets/stream-deck/1-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "1") {
// 					var sdTallyOne = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdTallyOne,
// 							path.resolve(__dirname, "assets/stream-deck/1-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 2) {
// 		tallyOne.style.backgroundColor = "#5cd65c";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "1") {
// 					var sdTallyOnePrev = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdTallyOnePrev,
// 							path.resolve(__dirname, "assets/stream-deck/1-green.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "1") {
// 					var sdTallyOne = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdTallyOne,
// 							path.resolve(__dirname, "assets/stream-deck/1-green.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 3) {
// 		tallyOne.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "1") {
// 					var sdTallyOne = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdTallyOne,
// 							path.resolve(__dirname, "assets/stream-deck/1-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "1") {
// 					var sdTallyOne = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdTallyOne,
// 							path.resolve(__dirname, "assets/stream-deck/1-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		tallyOne.style.backgroundColor = "";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "1") {
// 					var sdTallyOne = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdTallyOne,
// 							path.resolve(__dirname, "assets/stream-deck/1-clear.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "1") {
// 					var sdTallyOne = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdTallyOne,
// 							path.resolve(__dirname, "assets/stream-deck/1-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// });

// // TALLY 2
// var tally2 = {};
// var proxyObj2 = objChange(tally2, ["tally2Change"]);
// proxyObj2.on("change:tally2Change", function(e, args) {
// 	//console.log('Tally 2: ' + args.newValue);
// 	if (args.newValue == 1) {
// 		tallyTwo.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "2") {
// 					var sdtallyTwo = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyTwo,
// 							path.resolve(__dirname, "assets/stream-deck/2-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "2") {
// 					var sdtallyTwo = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyTwo,
// 							path.resolve(__dirname, "assets/stream-deck/2-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 2) {
// 		tallyTwo.style.backgroundColor = "#5cd65c";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "2") {
// 					var sdtallyTwoPrev = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyTwoPrev,
// 							path.resolve(__dirname, "assets/stream-deck/2-green.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "2") {
// 					var sdtallyTwo = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyTwo,
// 							path.resolve(__dirname, "assets/stream-deck/2-green.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 3) {
// 		tallyTwo.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "2") {
// 					var sdtallyTwo = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyTwo,
// 							path.resolve(__dirname, "assets/stream-deck/2-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "2") {
// 					var sdtallyTwo = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyTwo,
// 							path.resolve(__dirname, "assets/stream-deck/2-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		tallyTwo.style.backgroundColor = "";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "2") {
// 					var sdtallyTwo = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyTwo,
// 							path.resolve(__dirname, "assets/stream-deck/2-clear.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "2") {
// 					var sdtallyTwo = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyTwo,
// 							path.resolve(__dirname, "assets/stream-deck/2-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// });

// // TALLY 3
// var tally3 = {};
// var proxyObj3 = objChange(tally3, ["tally3Change"]);
// proxyObj3.on("change:tally3Change", function(e, args) {
// 	//console.log('Tally 3: ' + args.newValue);
// 	if (args.newValue == 1) {
// 		tallyThree.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "3") {
// 					var sdtallyThree = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyThree,
// 							path.resolve(__dirname, "assets/stream-deck/3-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "3") {
// 					var sdtallyThree = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyThree,
// 							path.resolve(__dirname, "assets/stream-deck/3-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 2) {
// 		tallyThree.style.backgroundColor = "#5cd65c";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "3") {
// 					var sdtallyThreePrev = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyThreePrev,
// 							path.resolve(__dirname, "assets/stream-deck/3-green.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "3") {
// 					var sdtallyThree = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyThree,
// 							path.resolve(__dirname, "assets/stream-deck/3-green.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 3) {
// 		tallyThree.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "3") {
// 					var sdtallyThree = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyThree,
// 							path.resolve(__dirname, "assets/stream-deck/3-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "3") {
// 					var sdtallyThree = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyThree,
// 							path.resolve(__dirname, "assets/stream-deck/3-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		tallyThree.style.backgroundColor = "";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				if (data.class == "atemPreview" && data.value == "3") {
// 					var sdtallyThree = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyThree,
// 							path.resolve(__dirname, "assets/stream-deck/3-clear.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "3") {
// 					var sdtallyThree = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyThree,
// 							path.resolve(__dirname, "assets/stream-deck/3-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// });

// // TALLY 4
// var tally4 = {};
// var proxyObj4 = objChange(tally4, ["tally4Change"]);
// proxyObj4.on("change:tally4Change", function(e, args) {
// 	//console.log('Tally 4: ' + args.newValue);
// 	if (args.newValue == 1) {
// 		tallyFour.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "4") {
// 					var sdtallyFour = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFour,
// 							path.resolve(__dirname, "assets/stream-deck/4-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "4") {
// 					var sdtallyFour = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFour,
// 							path.resolve(__dirname, "assets/stream-deck/4-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 2) {
// 		tallyFour.style.backgroundColor = "#5cd65c";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "4") {
// 					var sdtallyFourPrev = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFourPrev,
// 							path.resolve(__dirname, "assets/stream-deck/4-green.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "4") {
// 					var sdtallyFour = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFour,
// 							path.resolve(__dirname, "assets/stream-deck/4-green.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 3) {
// 		tallyFour.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "4") {
// 					var sdtallyFour = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFour,
// 							path.resolve(__dirname, "assets/stream-deck/4-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "4") {
// 					var sdtallyFour = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFour,
// 							path.resolve(__dirname, "assets/stream-deck/4-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		tallyFour.style.backgroundColor = "";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "4") {
// 					var sdtallyFour = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFour,
// 							path.resolve(__dirname, "assets/stream-deck/4-clear.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "4") {
// 					var sdtallyFour = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFour,
// 							path.resolve(__dirname, "assets/stream-deck/4-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// });

// // TALLY 5
// var tally5 = {};
// var proxyObj5 = objChange(tally5, ["tally5Change"]);
// proxyObj5.on("change:tally5Change", function(e, args) {
// 	//console.log('Tally 5: ' + args.newValue);
// 	if (args.newValue == 1) {
// 		tallyFive.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "5") {
// 					var sdtallyFive = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFive,
// 							path.resolve(__dirname, "assets/stream-deck/5-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "5") {
// 					var sdtallyFive = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFive,
// 							path.resolve(__dirname, "assets/stream-deck/5-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 2) {
// 		tallyFive.style.backgroundColor = "#5cd65c";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "5") {
// 					var sdtallyFivePrev = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFivePrev,
// 							path.resolve(__dirname, "assets/stream-deck/5-green.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "5") {
// 					var sdtallyFive = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFive,
// 							path.resolve(__dirname, "assets/stream-deck/5-green.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 3) {
// 		tallyFive.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "5") {
// 					var sdtallyFive = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFive,
// 							path.resolve(__dirname, "assets/stream-deck/5-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "5") {
// 					var sdtallyFive = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFive,
// 							path.resolve(__dirname, "assets/stream-deck/5-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		tallyFive.style.backgroundColor = "";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "5") {
// 					var sdtallyFive = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFive,
// 							path.resolve(__dirname, "assets/stream-deck/5-clear.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "5") {
// 					var sdtallyFive = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyFive,
// 							path.resolve(__dirname, "assets/stream-deck/5-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// });

// // TALLY 6
// var tally6 = {};
// var proxyObj6 = objChange(tally6, ["tally6Change"]);
// proxyObj6.on("change:tally6Change", function(e, args) {
// 	//console.log('Tally 6: ' + args.newValue);
// 	if (args.newValue == 1) {
// 		tallySix.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "6") {
// 					var sdtallySix = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySix,
// 							path.resolve(__dirname, "assets/stream-deck/6-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "6") {
// 					var sdtallySix = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySix,
// 							path.resolve(__dirname, "assets/stream-deck/6-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 2) {
// 		tallySix.style.backgroundColor = "#5cd65c";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "6") {
// 					var sdtallySixPrev = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySixPrev,
// 							path.resolve(__dirname, "assets/stream-deck/6-green.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "6") {
// 					var sdtallySix = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySix,
// 							path.resolve(__dirname, "assets/stream-deck/6-green.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 3) {
// 		tallySix.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "6") {
// 					var sdtallySix = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySix,
// 							path.resolve(__dirname, "assets/stream-deck/6-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "6") {
// 					var sdtallySix = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySix,
// 							path.resolve(__dirname, "assets/stream-deck/6-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		tallySix.style.backgroundColor = "";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "6") {
// 					var sdtallySix = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySix,
// 							path.resolve(__dirname, "assets/stream-deck/6-clear.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "6") {
// 					var sdtallySix = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySix,
// 							path.resolve(__dirname, "assets/stream-deck/6-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// });

// // TALLY 7
// var tally7 = {};
// var proxyObj7 = objChange(tally7, ["tally7Change"]);
// proxyObj7.on("change:tally7Change", function(e, args) {
// 	//console.log('Tally 7: ' + args.newValue);
// 	if (args.newValue == 1) {
// 		tallySeven.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "7") {
// 					var sdtallySeven = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySeven,
// 							path.resolve(__dirname, "assets/stream-deck/7-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "7") {
// 					var sdtallySeven = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySeven,
// 							path.resolve(__dirname, "assets/stream-deck/7-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 2) {
// 		tallySeven.style.backgroundColor = "#5cd65c";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "7") {
// 					var sdtallySevenPrev = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySevenPrev,
// 							path.resolve(__dirname, "assets/stream-deck/7-green.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "7") {
// 					var sdtallySeven = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySeven,
// 							path.resolve(__dirname, "assets/stream-deck/7-green.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 3) {
// 		tallySeven.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "7") {
// 					var sdtallySeven = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySeven,
// 							path.resolve(__dirname, "assets/stream-deck/7-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "7") {
// 					var sdtallySeven = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySeven,
// 							path.resolve(__dirname, "assets/stream-deck/7-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		tallySeven.style.backgroundColor = "";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "7") {
// 					var sdtallySeven = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySeven,
// 							path.resolve(__dirname, "assets/stream-deck/7-clear.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "7") {
// 					var sdtallySeven = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallySeven,
// 							path.resolve(__dirname, "assets/stream-deck/7-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// });

// // TALLY 8
// var tally8 = {};
// var proxyObj8 = objChange(tally8, ["tally8Change"]);
// proxyObj8.on("change:tally8Change", function(e, args) {
// 	//console.log('Tally 8: ' + args.newValue);
// 	if (args.newValue == 1) {
// 		tallyEight.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "8") {
// 					var sdtallyEight = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyEight,
// 							path.resolve(__dirname, "assets/stream-deck/8-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "8") {
// 					var sdtallyEight = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyEight,
// 							path.resolve(__dirname, "assets/stream-deck/8-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 2) {
// 		tallyEight.style.backgroundColor = "#5cd65c";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "8") {
// 					var sdtallyEightPrev = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyEightPrev,
// 							path.resolve(__dirname, "assets/stream-deck/8-green.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "8") {
// 					var sdtallyEight = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyEight,
// 							path.resolve(__dirname, "assets/stream-deck/8-green.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else if (args.newValue == 3) {
// 		tallyEight.style.backgroundColor = "#ff4d4d";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "8") {
// 					var sdtallyEight = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyEight,
// 							path.resolve(__dirname, "assets/stream-deck/8-red.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "8") {
// 					var sdtallyEight = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyEight,
// 							path.resolve(__dirname, "assets/stream-deck/8-red.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	} else {
// 		tallyEight.style.backgroundColor = "";
// 		// STREAM DECK TALLY
// 		for (var i = 0; i < 15; i++) {
// 			storage.get("sd" + i + "-button", function(error, data) {
// 				if (error) throw error;
// 				//console.log(data);
// 				if (data.class == "atemPreview" && data.value == "8") {
// 					var sdtallyEight = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyEight,
// 							path.resolve(__dirname, "assets/stream-deck/8-clear.png")
// 						)
// 						.then(() => {});
// 				} else if (data.class == "atemProgram" && data.value == "8") {
// 					var sdtallyEight = data.name - 1 + 1;
// 					streamdeck
// 						.fillImageFromFile(
// 							sdtallyEight,
// 							path.resolve(__dirname, "assets/stream-deck/8-clear.png")
// 						)
// 						.then(() => {});
// 				}
// 			});
// 		}
// 	}
// });
