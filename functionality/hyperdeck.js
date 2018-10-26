var HyperdeckLib = require("hyperdeck-js-lib");
const storage = require("electron-json-storage");

const tally = require("./tally");

document
	.getElementById("ipAddressBtnHyperDeck")
	.addEventListener("click", () => {
		document.getElementById("hyperdeckConnectionLED").style.backgroundColor =
			"#ff4d4d";
		var hyperdeckIP = ipAddressInputHyperDeck.value;
		hyperdeck = new HyperdeckLib.Hyperdeck(hyperdeckIP);
		storage.set(
			"hyperdeck-ip-address",
			{ hyperdeckIPAddress: ipAddressInputHyperDeck.value },
			function(error) {
				if (error) throw error;
			}
		);
		hyperdeck
			.onConnected()
			.then(function() {
				hyperdeck
					.makeRequest("device info")
					.then(function(response) {
						console.log("Got response with code " + response.code + ".");
						console.log("Hyperdeck unique id: " + response.params["unique id"]);
						hyperdeckConnectionLED.style.backgroundColor = "#5cd65c";
					})
					.catch(function(errResponse) {
						if (!errResponse) {
							console.error(
								"The request failed because the hyperdeck connection was lost."
							);
						} else {
							console.error(
								"The hyperdeck returned an error with status code " +
									errResponse.code +
									"."
							);
						}
					});

				hyperdeck.getNotifier().on("asynchronousEvent", function(response) {
					console.log(
						"Got an asynchronous event with code " + response.code + "."
					);
					hyperdeck.transportInfo().then(responseJSON => {
						// console.log(responseJSON.params.status);
						const status = responseJSON.params.status;
						tally.hyperdeck(status);
						storage.set("hyperdeck", { status: status }, function(error) {
							if (error) throw error;
						});
					});
				});

				hyperdeck.getNotifier().on("connectionLost", function() {
					console.error("Connection lost.");
					atemConnectionLED.style.backgroundColor = "";
				});
			})
			.catch(function() {
				console.error("Failed to connect to hyperdeck.");
			});
	});

const record = () => {
	hyperdeck.transportInfo().then(responseJSON => {
		const recordStatus = responseJSON.params.status;
		if (recordStatus != "record") {
			hyperdeck.record();
		} else if (recordStatus == "record") {
			hyperdeck.stop();
		}
	});
};

const play = () => {
	hyperdeck.play();
};

const stop = () => {
	hyperdeck.stop();
};

const nextClip = () => {
	hyperdeck.nextClip();
};

const prevClip = () => {
	hyperdeck.prevClip();
};

module.exports = { record, play, stop, nextClip, prevClip };
