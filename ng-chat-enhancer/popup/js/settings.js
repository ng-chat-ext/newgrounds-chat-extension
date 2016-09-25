(function() {

//------------------------------------------------------------
NGCE.Settings = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

// Last Seen
var chkSetLastSeen;
// Font
var txtCustomFont;
var lblFontCurrent;
var btnFontClear;
var btnFontSet;
// Zornuzkull mode
var chkSetZornMode;

// var o = NGCE.ChromeSync.BlockList;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function chkSetLastSeenChange() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.lastSeen = chkSetLastSeen.checked;
	o.save();
};

function btnFontClearClick() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.customFont = '';
	o.save();

	lblFontCurrent.innerText = 'Default';
};

function btnFontSetClick() {
	var val = txtCustomFont.value.trim();
	if (!val)
		return;

	var o = NGCE.ChromeSync.Settings;
	o.Data.customFont = val;
	o.save();

	lblFontCurrent.innerText = val;
	txtCustomFont.value = '';
};

function chkSetZornModeChange() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.zornMode = chkSetZornMode.checked;
	o.save();
};

//------------------------------------------------------------

function refreshSettings() {
	var o = NGCE.ChromeSync.Settings.Data;

	chkSetLastSeen.checked = o.lastSeen;
	lblFontCurrent.innerText = o.customFont || 'Default';
	chkSetZornMode.checked = o.zornMode;
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	// Get elements.
	chkSetLastSeen = document.getElementById('chkSetLastSeen');
	//
	txtCustomFont = document.getElementById('txtCustomFont');
	lblFontCurrent = document.getElementById('lblFontCurrent');
	btnFontClear = document.getElementById('btnFontClear');
	btnFontSet = document.getElementById('btnFontSet');
	//
	chkSetZornMode = document.getElementById('chkSetZornMode');

	// Add events.
	chkSetLastSeen.addEventListener('change', chkSetLastSeenChange);
	btnFontClear.addEventListener('click', btnFontClearClick);
	btnFontSet.addEventListener('click', btnFontSetClick);
	chkSetZornMode.addEventListener('change', chkSetZornModeChange);

	NGCE.ChromeSync.Settings.load(refreshSettings);
};

//------------------------------------------------------------

}());