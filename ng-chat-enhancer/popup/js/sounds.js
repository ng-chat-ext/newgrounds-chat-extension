(function() {

//------------------------------------------------------------
NGCE.Sounds = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var tblSounds;
var audioIDs;
var checkboxes = {};

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function refreshSoundsTable() {
	for (var property in NGCE.ChromeSync.Sounds.Data) {
		checkboxes[property].checked = NGCE.ChromeSync.Sounds.Data[property];
	}
};

function chkChange(audioID) {
	NGCE.ChromeSync.Sounds.Data[audioID] = checkboxes[audioID].checked;
	NGCE.ChromeSync.Sounds.save();
};

function generateTable() {
	audioIDs.forEach(function(audioID) {
		var row = document.createElement('div');
		var col1 = document.createElement('div');
		var col2 = document.createElement('div');
		var chk = document.createElement('input');
		
		col1.innerText = audioID;

		chk.type = "checkbox";
		chk.name = "chk-" + audioID;
		chk.checked = true;
		chk.addEventListener('change', function(e) { chkChange(audioID); });
		checkboxes[audioID] = chk;

		col2.appendChild(chk);
		row.appendChild(col1);
		row.appendChild(col2);
		tblSounds.appendChild(row);
	});
};

function initContinue(IDs) {
	audioIDs = IDs;
	if (!audioIDs)
		return;

	generateTable();
	NGCE.ChromeSync.Sounds.load(refreshSoundsTable);
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	tblSounds = document.getElementById('tblSounds');

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'Sounds'}, initContinue);
	});
};

//------------------------------------------------------------

}());