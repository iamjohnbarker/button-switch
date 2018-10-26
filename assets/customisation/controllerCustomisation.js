const storage = require("electron-json-storage");

// CUSTOMISE CONTROLLER //
// BUTTON R1
storage.get("cbr1-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cbr1").selectedIndex = data.index;
});
document.getElementById("cbr1").addEventListener("change", function(e) {
	storage.set(
		"cbr1-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON R1 MIDI
// storage.get('cbr1-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cbr1-midi').value = "";
//   } else {
//     document.getElementById('cbr1-midi').value = data.note;
//   };
// });
// document.getElementById('cbr1-midi').addEventListener('change', function (e) {
//   storage.set('cbr1-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
// BUTTON R2
storage.get("cbr2-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cbr2").selectedIndex = data.index;
});
document.getElementById("cbr2").addEventListener("change", function(e) {
	storage.set(
		"cbr2-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON R2 MIDI
// storage.get('cbr2-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cbr2-midi').value = "";
//   } else {
//     document.getElementById('cbr2-midi').value = data.note;
//   };
// });
// document.getElementById('cbr2-midi').addEventListener('change', function (e) {
//   storage.set('cbr2-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
// BUTTON L1
storage.get("cbl1-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cbl1").selectedIndex = data.index;
});
document.getElementById("cbl1").addEventListener("change", function(e) {
	storage.set(
		"cbl1-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON L1 MIDI
// storage.get('cbl1-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cbl1-midi').value = "";
//   } else {
//     document.getElementById('cbl1-midi').value = data.note;
//   };
// });
// document.getElementById('cbl1-midi').addEventListener('change', function (e) {
//   storage.set('cbl1-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
// BUTTON L2
storage.get("cbl2-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cbl2").selectedIndex = data.index;
});
document.getElementById("cbl2").addEventListener("change", function(e) {
	storage.set(
		"cbl2-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON L2 MIDI
// storage.get('cbl2-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cbl2-midi').value = "";
//   } else {
//     document.getElementById('cbl2-midi').value = data.note;
//   };
// });
// document.getElementById('cbl2-midi').addEventListener('change', function (e) {
//   storage.set('cbl2-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });

// BUTTON 1
storage.get("cb1-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cb1").selectedIndex = data.index;
});
document.getElementById("cb1").addEventListener("change", function(e) {
	storage.set(
		"cb1-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON 1 MIDI
// storage.get('cb1-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cb1-midi').value = "";
//   } else {
//     document.getElementById('cb1-midi').value = data.note;
//   };
// });
// document.getElementById('cb1-midi').addEventListener('change', function (e) {
//   storage.set('cb1-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
// BUTTON 2
storage.get("cb2-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cb2").selectedIndex = data.index;
});
document.getElementById("cb2").addEventListener("change", function(e) {
	storage.set(
		"cb2-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON 2 MIDI
// storage.get('cb2-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cb2-midi').value = "";
//   } else {
//     document.getElementById('cb2-midi').value = data.note;
//   };
// });
// document.getElementById('cb2-midi').addEventListener('change', function (e) {
//   storage.set('cb2-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
// BUTTON 3
storage.get("cb3-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cb3").selectedIndex = data.index;
});
document.getElementById("cb3").addEventListener("change", function(e) {
	storage.set(
		"cb3-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON 3 MIDI
// storage.get('cb3-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cb3-midi').value = "";
//   } else {
//     document.getElementById('cb3-midi').value = data.note;
//   };
// });
// document.getElementById('cb3-midi').addEventListener('change', function (e) {
//   storage.set('cb3-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
// BUTTON 4
storage.get("cb4-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cb4").selectedIndex = data.index;
});
document.getElementById("cb4").addEventListener("change", function(e) {
	storage.set(
		"cb4-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON 4 MIDI
// storage.get('cb4-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cb4-midi').value = "";
//   } else {
//     document.getElementById('cb4-midi').value = data.note;
//   };
// });
// document.getElementById('cb4-midi').addEventListener('change', function (e) {
//   storage.set('cb4-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
// BUTTON START
storage.get("cbstart-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cbstart").selectedIndex = data.index;
});
document.getElementById("cbstart").addEventListener("change", function(e) {
	storage.set(
		"cbstart-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON START MIDI
// storage.get('cbstart-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cbstart-midi').value = "";
//   } else {
//     document.getElementById('cbstart-midi').value = data.note;
//   };
// });
// document.getElementById('cbstart-midi').addEventListener('change', function (e) {
//   storage.set('cbstart-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
// BUTTON SELECT
storage.get("cbselect-button", function(error, data) {
	if (error) throw error;
	document.getElementById("cbselect").selectedIndex = data.index;
});
document.getElementById("cbselect").addEventListener("change", function(e) {
	storage.set(
		"cbselect-button",
		{
			value: e.target.value,
			class: e.target.selectedOptions[0].className,
			index: e.target.selectedIndex
		},
		function(error) {
			if (error) throw error;
		}
	);
});
// // BUTTON SELECT MIDI
// storage.get('cbselect-button-midi', function(error, data) {
//   if (error) throw error;
//   if (data.note === undefined) {
//     document.getElementById('cbselect-midi').value = "";
//   } else {
//     document.getElementById('cbselect-midi').value = data.note;
//   };
// });
// document.getElementById('cbselect-midi').addEventListener('change', function (e) {
//   storage.set('cbselect-button-midi', {note: e.target.value}, function(error) {
//     if (error) throw error;
//   });
// });
