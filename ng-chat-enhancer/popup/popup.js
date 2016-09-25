//------------------------------------------------------------
// Variables
//------------------------------------------------------------

// Menu
var menuBtns = [];
var menuCurr = -1;

// Last Seen
var chkSetLastSeen;
// Font
var txtCustomFont;
var lblFontCurrent;
var btnFontClear;
var btnFontSet;
// Zornuzkull mode
var chkSetZornMode

// Data
var settings = {};
var mentions = [];

//------------------------------------------------------------

document.addEventListener('DOMContentLoaded', init);

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

	// Menu
	var tmp;
	for (var i = 4; i >= 1; i--) {
		tmp = document.getElementById('btnMenu' + i);
		(function(i) { tmp.addEventListener('click', function() { switchMenu(i-1) }); }(i));
		menuBtns.unshift(tmp);
	}
	switchMenu(0);

	// Initialize.
	NGCE.Block.init();
	NGCE.ChromeSync.Settings.load(refreshSettings);
};

//------------------------------------------------------------
//------------------------------------------------------------



//------------------------------------------------------------
// Event Handlers
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
// Other
//------------------------------------------------------------

function switchMenu(index) {
	console.log(index);

	if (menuCurr != -1)
		document.querySelector('.menu.show').classList.remove('show');

	menuCurr = index;
	document.querySelectorAll('.menu')[menuCurr].classList.add('show');
};

//------------------------------------------------------------
// Chrome Sync
//------------------------------------------------------------

function refreshSettings() {
	var o = NGCE.ChromeSync.Settings.Data;

	chkSetLastSeen.checked = o.lastSeen;
	lblFontCurrent.innerText = o.customFont || 'Default';
	chkSetZornMode.checked = o.zornMode;
};

//------------------------------------------------------------