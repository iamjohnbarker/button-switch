const change = tallys => {
	const tallyOne = document.getElementById("tallyOne");
	const tallyTwo = document.getElementById("tallyTwo");
	const tallyThree = document.getElementById("tallyThree");
	const tallyFour = document.getElementById("tallyFour");
	const tallyFive = document.getElementById("tallyFive");
	const tallySix = document.getElementById("tallySix");
	const tallySeven = document.getElementById("tallySeven");
	const tallyEight = document.getElementById("tallyEight");

	const tallyArray = [
		tallyOne,
		tallyTwo,
		tallyThree,
		tallyFour,
		tallyFive,
		tallySix,
		tallySeven,
		tallyEight
	];

	for (let i = 0; i < tallyArray.length; i++) {
		if (tallys[i] == 1) {
			tallyArray[i].style.backgroundColor = "#ff4d4d";
			// streamdeckTally(i + 1, tallys[i]);
		} else if (tallys[i] == 2) {
			tallyArray[i].style.backgroundColor = "#5cd65c";
			// streamdeck.streamdeckTally(i + 1, tallys[i]);
		} else if (tallys[i] == 3) {
			tallyArray[i].style.backgroundColor = "#ff4d4d";
			// streamdeck.streamdeckTally(i + 1, tallys[i]);
		} else {
			tallyArray[i].style.backgroundColor = "";
		}
	}
};

const hyperdeck = status => {
	const tallyRecord = document.getElementById("tallyRecord");
	const tallyPlay = document.getElementById("tallyPlay");
	const tallyStop = document.getElementById("tallyStop");

	tallyRecord.style.backgroundColor = "";
	tallyRecord.innerText = "●";
	tallyPlay.style.backgroundColor = "";
	tallyStop.style.backgroundColor = "";

	if (status == "record") {
		tallyRecord.style.backgroundColor = "#ff4d4d";
		tallyRecord.innerText = "■";
	} else if (status == "play") {
		tallyPlay.style.backgroundColor = "#5cd65c";
	} else if (status == "stopped") {
		tallyStop.style.backgroundColor = "#5cd65c";
	}
};

module.exports = { change, hyperdeck };
