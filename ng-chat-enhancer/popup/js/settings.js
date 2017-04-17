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
// Emoticons
var ddlEmoteHide;
// Density
var ddlDensity;
// Full Width
var chkFullWidth;
// "More Messages" Button
var ddlMoreMessages;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function chkSetLastSeenChange() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.lastSeen = chkSetLastSeen.checked;
	o.save();
}

function chkSetZornModeChange() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.zornMode = chkSetZornMode.checked;
	o.save();
}

function chkFullWidthChange() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.fullWidth = chkFullWidth.checked;
	o.save();
}

function btnFontClearClick() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.customFont = '';
	o.save();

	lblFontCurrent.innerText = 'Default';
}

function btnFontSetClick() {
	var val = txtCustomFont.value.trim();
	if (!val)
		return;

	var o = NGCE.ChromeSync.Settings;
	o.Data.customFont = val;
	o.save();

	lblFontCurrent.innerText = val;
	txtCustomFont.value = '';
}

function ddlEmoteHideChange() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.emoteHide = ddlEmoteHide.value;
	o.save();
}

function ddlDensityChange() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.density = ddlDensity.value;
	o.save();
}

function ddlMoreMessagesChange() {
	var o = NGCE.ChromeSync.Settings;
	o.Data.moreMessages = ddlMoreMessages.value;
	o.save();
}



//------------------------------------------------------------

function refreshSettings() {
	var o = NGCE.ChromeSync.Settings.Data;

	chkSetLastSeen.checked = o.lastSeen;
	chkSetZornMode.checked = o.zornMode;
	chkFullWidth.checked = o.fullWidth;
	lblFontCurrent.innerText = o.customFont || 'Default';
	ddlEmoteHide.value = o.emoteHide || 0;
	ddlDensity.value = o.density || 0;
	ddlMoreMessages.value = o.moreMessages || 0;
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	// Get elements.
	chkSetLastSeen = document.getElementById('chkSetLastSeen');
	//
	chkSetZornMode = document.getElementById('chkSetZornMode');
	//
	chkFullWidth = document.getElementById('chkFullWidth');
	//
	txtCustomFont = document.getElementById('txtCustomFont');
	lblFontCurrent = document.getElementById('lblFontCurrent');
	btnFontClear = document.getElementById('btnFontClear');
	btnFontSet = document.getElementById('btnFontSet');
	//
	ddlEmoteHide = document.getElementById('ddlEmoteHide');
	//
	ddlDensity = document.getElementById('ddlDensity');
	//
	ddlMoreMessages = document.getElementById('ddlMoreMessages');

	// Add events.
	chkSetLastSeen.addEventListener('change', chkSetLastSeenChange);
	chkSetZornMode.addEventListener('change', chkSetZornModeChange);
	chkFullWidth.addEventListener('change', chkFullWidthChange);
	btnFontClear.addEventListener('click', btnFontClearClick);
	btnFontSet.addEventListener('click', btnFontSetClick);
	ddlEmoteHide.addEventListener('change', ddlEmoteHideChange);
	ddlDensity.addEventListener('change', ddlDensityChange);
	ddlMoreMessages.addEventListener('change', ddlMoreMessagesChange);

	NGCE.ChromeSync.Settings.load(refreshSettings);
};

//------------------------------------------------------------

}());