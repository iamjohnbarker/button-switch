const storage = require('electron-json-storage');

//CREATE DOCUMENT LISTS //

var sdArray = [4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 14, 13, 12, 11, 10];

for (var i = 0; i < sdArray.length; i++) {
  var div = document.createElement("DIV");
  var preappend = document.createElement("DIV");
  var select = document.createElement('select');
  var label = document.createElement('label');
  var iPlus = i + 1;

  preappend.setAttribute("class", "input-group-prepend");
  preappend.appendChild(label);
  label.setAttribute("class", "input-group-text");
  label.setAttribute("for", "sd");
  label.innerText = iPlus;
  div.setAttribute("class", "input-group mb-3");
  select.setAttribute("class", "custom-select");
  select.setAttribute("id", "sd"+sdArray[i]);
  div.appendChild(preappend);
  div.appendChild(select);
  document.getElementById('sdOptions').appendChild(div);

  var optionDisabled = document.createElement('option');
  optionDisabled.text = "Disabled";
  optionDisabled.setAttribute("class", "disabled");
  select.appendChild(optionDisabled);
  select.add(optionDisabled, select[1]);

  // OPTION GROUP ONE
  var optgroup1 = document.createElement('optgroup');
  optgroup1.setAttribute("label", "ATEM Transition");
  select.appendChild(optgroup1);

  var atemCut = document.createElement('option');
  atemCut.text = "Cut";
  atemCut.setAttribute("class", "atemCut");
  atemCut.setAttribute("value", "1");
  optgroup1.appendChild(atemCut);

  var atemAuto = document.createElement('option');
  atemAuto.text = "Auto";
  atemAuto.setAttribute("class", "atemAuto");
  atemAuto.setAttribute("value", "2");
  optgroup1.appendChild(atemAuto);

  // OPTION GROUP TWO
  var optgroup2 = document.createElement('optgroup');
  optgroup2.setAttribute("label", "ATEM Preview");
  select.appendChild(optgroup2);

  for (var j = 1; j < 9; j++) {
    var atemPreviewj = document.createElement('option');
    atemPreviewj.text = "Preview Input " + j;
    atemPreviewj.setAttribute("class", "atemPreview");
    atemPreviewj.setAttribute("value", j);
    optgroup2.appendChild(atemPreviewj);
  };

  // var atemPreviewCol3 = document.createElement('option');
  // atemPreviewCol3.text = "Preview Color Bars";
  // atemPreviewCol3.setAttribute("class", "atemPreview");
  // atemPreviewCol3.setAttribute("value", '1000');
  // optgroup2.appendChild(atemPreviewCol3);
  //
  // var atemPreviewCol1 = document.createElement('option');
  // atemPreviewCol1.text = "Preview Color 1";
  // atemPreviewCol1.setAttribute("class", "atemPreview");
  // atemPreviewCol1.setAttribute("value", '2001');
  // optgroup2.appendChild(atemPreviewCol1);
  //
  // var atemPreviewCol2 = document.createElement('option');
  // atemPreviewCol2.text = "Preview Color 2";
  // atemPreviewCol2.setAttribute("class", "atemPreview");
  // atemPreviewCol2.setAttribute("value", '2002');
  // optgroup2.appendChild(atemPreviewCol2);
  //
  // var atemPreviewMP1 = document.createElement('option');
  // atemPreviewMP1.text = "Preview Media Player 1";
  // atemPreviewMP1.setAttribute("class", "atemPreview");
  // atemPreviewMP1.setAttribute("value", '3010');
  // optgroup2.appendChild(atemPreviewMP1);
  //
  // var atemPreviewMP2 = document.createElement('option');
  // atemPreviewMP2.text = "Preview Media Player 2";
  // atemPreviewMP2.setAttribute("class", "atemPreview");
  // atemPreviewMP2.setAttribute("value", "3020");
  // optgroup2.appendChild(atemPreviewMP2);


  // OPTION GROUP THREE
  var optgroup3 = document.createElement('optgroup');
  optgroup3.setAttribute("label", "ATEM Program");
  select.appendChild(optgroup3);

  for (var k = 1; k < 9; k++) {
    var atemProgramk = document.createElement('option');
    atemProgramk.text = "Program Input " + k;
    atemProgramk.setAttribute("class", "atemProgram");
    atemProgramk.setAttribute("value", k);
    optgroup3.appendChild(atemProgramk);
  };

  // var atemProgramCol3 = document.createElement('option');
  // atemProgramCol3.text = "Program Color Bars";
  // atemProgramCol3.setAttribute("class", "atemProgram");
  // atemProgramCol3.setAttribute("value", '1000');
  // optgroup3.appendChild(atemProgramCol3);
  //
  // var atemProgramCol1 = document.createElement('option');
  // atemProgramCol1.text = "Program Color 1";
  // atemProgramCol1.setAttribute("class", "atemProgram");
  // atemProgramCol1.setAttribute("value", '2001');
  // optgroup3.appendChild(atemProgramCol1);
  //
  // var atemProgramCol2 = document.createElement('option');
  // atemProgramCol2.text = "Program Color 2";
  // atemProgramCol2.setAttribute("class", "atemProgram");
  // atemProgramCol2.setAttribute("value", '2002');
  // optgroup3.appendChild(atemProgramCol2);
  //
  // var atemProgramMP1 = document.createElement('option');
  // atemProgramMP1.text = "Program Media Player 1";
  // atemProgramMP1.setAttribute("class", "atemProgram");
  // atemProgramMP1.setAttribute("value", '3010');
  // optgroup3.appendChild(atemProgramMP1);
  //
  // var atemProgramMP2 = document.createElement('option');
  // atemProgramMP2.text = "Program Media Player 2";
  // atemProgramMP2.setAttribute("class", "atemProgram");
  // atemProgramMP2.setAttribute("value", "3020");
  // optgroup3.appendChild(atemProgramMP2);

  // OPTION GROUP FOUR
  var optgroup4 = document.createElement('optgroup');
  optgroup4.setAttribute("label", "ATEM Aux");
  select.appendChild(optgroup4);

  for (var l = 1; l < 9; l++) {
    var atemAuxl = document.createElement('option');
    atemAuxl.text = "Aux Input " + l;
    atemAuxl.setAttribute("class", "atemAux");
    atemAuxl.setAttribute("value", l);
    optgroup4.appendChild(atemAuxl);
  };

  var atemAuxCol3 = document.createElement('option');
  atemAuxCol3.text = "Aux Color Bars";
  atemAuxCol3.setAttribute("class", "atemAux");
  atemAuxCol3.setAttribute("value", '1000');
  optgroup4.appendChild(atemAuxCol3);

  var atemAuxCol1 = document.createElement('option');
  atemAuxCol1.text = "Aux Color 1";
  atemAuxCol1.setAttribute("class", "atemAux");
  atemAuxCol1.setAttribute("value", '2001');
  optgroup4.appendChild(atemAuxCol1);

  var atemAuxCol2 = document.createElement('option');
  atemAuxCol2.text = "Aux Color 2";
  atemAuxCol2.setAttribute("class", "atemAux");
  atemAuxCol2.setAttribute("value", '2002');
  optgroup4.appendChild(atemAuxCol2);

  var atemAuxMP1 = document.createElement('option');
  atemAuxMP1.text = "Aux Media Player 1";
  atemAuxMP1.setAttribute("class", "atemAux");
  atemAuxMP1.setAttribute("value", '3010');
  optgroup4.appendChild(atemAuxMP1);

  var atemAuxMP2 = document.createElement('option');
  atemAuxMP2.text = "Aux Media Player 2";
  atemAuxMP2.setAttribute("class", "atemAux");
  atemAuxMP2.setAttribute("value", "3020");
  optgroup4.appendChild(atemAuxMP2);

  // OPTION GROUP FIVE
  var optgroup5 = document.createElement('optgroup');
  optgroup5.setAttribute("label", "ATEM Macros");
  select.appendChild(optgroup5);

  for (var o = 1; o < 9; o++) {
    var atemMacroRun = document.createElement('option');
    var macroIndex = o - 1;
    atemMacroRun.text = "Run Macro " + o;
    atemMacroRun.setAttribute("class", "atemMacroRun");
    atemMacroRun.setAttribute("value", macroIndex);
    optgroup5.appendChild(atemMacroRun);
  };


  // OPTION GROUP SIX
  var optgroup6 = document.createElement('optgroup');
  optgroup6.setAttribute("label", "HyperDeck");
  select.appendChild(optgroup6);

  var hyperdeckRecord = document.createElement('option');
  hyperdeckRecord.text = "Record Start/Stop";
  hyperdeckRecord.setAttribute("class", "hyperdeckRec");
  hyperdeckRecord.setAttribute("value", "1");
  optgroup6.appendChild(hyperdeckRecord);

  var hyperdeckMark = document.createElement('option');
  hyperdeckMark.text = "Add Marker";
  hyperdeckMark.setAttribute("class", "hyperdeckMark");
  hyperdeckMark.setAttribute("value", "1");
  optgroup6.appendChild(hyperdeckMark);

  var hyperdeckPlay = document.createElement('option');
  hyperdeckPlay.text = "Play";
  hyperdeckPlay.setAttribute("class", "hyperdeckPlay");
  hyperdeckPlay.setAttribute("value", "1");
  optgroup6.appendChild(hyperdeckPlay);

  var hyperdeckStop = document.createElement('option');
  hyperdeckStop.text = "Stop";
  hyperdeckStop.setAttribute("class", "hyperdeckStop");
  hyperdeckStop.setAttribute("value", "1");
  optgroup6.appendChild(hyperdeckStop);

  var hyperdeckPrevious = document.createElement('option');
  hyperdeckPrevious.text = "Previous Clip";
  hyperdeckPrevious.setAttribute("class", "hyperdeckPrevious");
  hyperdeckPrevious.setAttribute("value", "1");
  optgroup6.appendChild(hyperdeckPrevious);

  var hyperdeckNext = document.createElement('option');
  hyperdeckNext.text = "Next Clip";
  hyperdeckNext.setAttribute("class", "hyperdeckNext");
  hyperdeckNext.setAttribute("value", "1");
  optgroup6.appendChild(hyperdeckNext);


};



document.getElementById('sdOptions').addEventListener('change', function (e) {
  console.log(e.target.selectedOptions[0].className+" - "+e.target.value);
});



// CUSTOMISE STREAM DECK //
// BUTTON 0
storage.get('sd0-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd0').selectedIndex = data.index;
});
document.getElementById('sd0').addEventListener('change', function (e) {
  storage.set('sd0-button', {name: '0', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 1
storage.get('sd1-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd1').selectedIndex = data.index;
});
document.getElementById('sd1').addEventListener('change', function (e) {
  storage.set('sd1-button', {name: '1', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 2
storage.get('sd2-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd2').selectedIndex = data.index;
});
document.getElementById('sd2').addEventListener('change', function (e) {
  storage.set('sd2-button', {name: '2', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 3
storage.get('sd3-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd3').selectedIndex = data.index;
});
document.getElementById('sd3').addEventListener('change', function (e) {
  storage.set('sd3-button', {name: '3', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 4
storage.get('sd4-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd4').selectedIndex = data.index;
});
document.getElementById('sd4').addEventListener('change', function (e) {
  storage.set('sd4-button', {name: '4', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 5
storage.get('sd5-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd5').selectedIndex = data.index;
});
document.getElementById('sd5').addEventListener('change', function (e) {
  storage.set('sd5-button', {name: '5', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 6
storage.get('sd6-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd6').selectedIndex = data.index;
});
document.getElementById('sd6').addEventListener('change', function (e) {
  storage.set('sd6-button', {name: '6', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 7
storage.get('sd7-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd7').selectedIndex = data.index;
});
document.getElementById('sd7').addEventListener('change', function (e) {
  storage.set('sd7-button', {name: '7', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 8
storage.get('sd8-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd8').selectedIndex = data.index;
});
document.getElementById('sd8').addEventListener('change', function (e) {
  storage.set('sd8-button', {name: '8', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 9
storage.get('sd9-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd9').selectedIndex = data.index;
});
document.getElementById('sd9').addEventListener('change', function (e) {
  storage.set('sd9-button', {name: '9', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 10
storage.get('sd10-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd10').selectedIndex = data.index;
});
document.getElementById('sd10').addEventListener('change', function (e) {
  storage.set('sd10-button', {name: '10', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 11
storage.get('sd11-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd11').selectedIndex = data.index;
});
document.getElementById('sd11').addEventListener('change', function (e) {
  storage.set('sd11-button', {name: '11', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 12
storage.get('sd12-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd12').selectedIndex = data.index;
});
document.getElementById('sd12').addEventListener('change', function (e) {
  storage.set('sd12-button', {name: '12', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 13
storage.get('sd13-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd13').selectedIndex = data.index;
});
document.getElementById('sd13').addEventListener('change', function (e) {
  storage.set('sd13-button', {name: '13', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});

// BUTTON 14
storage.get('sd14-button', function(error, data) {
  if (error) throw error;
  document.getElementById('sd14').selectedIndex = data.index;
});
document.getElementById('sd14').addEventListener('change', function (e) {
  storage.set('sd14-button', {name: '14', value: e.target.value, class: e.target.selectedOptions[0].className, index: e.target.selectedIndex}, function(error) {
    if (error) throw error;
  });
});
