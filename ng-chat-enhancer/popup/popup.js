//------------------------------------------------------------
// Variables
//------------------------------------------------------------

// Block List
var txtUsername;
var btnBlockUser;
var olNameList;
// Last Seen
var chkSetLastSeen;
// Font
var txtCustomFont;
var lblFontCurrent;
var btnFontClear;
var btnFontSet;

// Data
var blockList = [];
var settings = {};
var mentions = [];

//------------------------------------------------------------

document.addEventListener('DOMContentLoaded', DOMLoaded);

function DOMLoaded() {
	// Get elements.
	txtUsername = document.getElementById('txtUsername');
	btnBlockUser = document.getElementById('btnBlockUser');
	olNameList = document.getElementById('olNameList');
	chkSetLastSeen = document.getElementById('chkSetLastSeen');
	txtCustomFont = document.getElementById('txtCustomFont');
	lblFontCurrent = document.getElementById('lblFontCurrent');
	btnFontClear = document.getElementById('btnFontClear');
	btnFontSet = document.getElementById('btnFontSet');
	
	// Add events.
	btnBlockUser.addEventListener('click', btnBlockUserClick);
	chkSetLastSeen.addEventListener('change', chkSetLastSeenChange);
	btnFontClear.addEventListener('click', btnFontClearClick);
	btnFontSet.addEventListener('click', btnFontSetClick);

	// Initialize.
	init();
};

//------------------------------------------------------------
//------------------------------------------------------------



//------------------------------------------------------------
//------------------------------------------------------------

function init() {
	getSettings();
	getBlockList();
};

//------------------------------------------------------------
// Event Handlers
//------------------------------------------------------------

function btnBlockUserClick() {
	blockUser(txtUsername.value);
	txtUsername.value = '';
};

function chkSetLastSeenChange() {
	settings.lastSeen = chkSetLastSeen.checked;
	saveSettings();
};

function btnFontClearClick() {
	settings.customFont = '';
	lblFontCurrent.innerText = 'Default';
	saveSettings();
};

function btnFontSetClick() {
	var val = txtCustomFont.value.trim();
	if (!val)
		return;

	settings.customFont = val;
	lblFontCurrent.innerText = val;
	txtCustomFont.value = '';
	saveSettings();
};

//------------------------------------------------------------
// Block List
//------------------------------------------------------------

function blockUser(username) {
	var tmp = username.trim();

	if (!tmp) {
		showStatus('Please enter a username.');
		return;
	}

	if (blockList.indexOf(tmp) !== -1) {
		showStatus('User already blocked.');
		return;
	}

	// Add name to list.
	blockList.push(tmp);

	// Save list.
	saveBlockList(function() {
		showStatus('User blocked: ' + tmp);
		addListItem(tmp, tmp);
	});
};

function unblockUser(username) {
	// Remove name from list.
	var index = blockList.indexOf(username);
	if (index !== -1)
		blockList.splice(index, 1);


	saveBlockList(function() {
		showStatus('User unblocked: ' + username);
		removeListItem(username, username);
	});
};



function addListItem(value, text) {
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(text));
	li.setAttribute("name", value);
	li.addEventListener('click', function() { unblockUser(value); });
	olNameList.appendChild(li);
};

function removeListItem(value) {
	var li = document.querySelector('li[name="' + value + '"]');
	olNameList.removeChild(li);
};

function showStatus(statusText) {
	
	document.getElementById('status').textContent = statusText;
};

//------------------------------------------------------------
// Chrome Sync
//------------------------------------------------------------

function getSettings() {
	chrome.storage.sync.get('settings', function(result) {
		// Store in variable.
		settings = result.settings || {};

		// Update UI.
		chkSetLastSeen.checked = settings.lastSeen;
		lblFontCurrent.innerText = settings.customFont || 'Default';
	});
};

function saveSettings() {

	chrome.storage.sync.set({ 'settings': settings });
};


function getBlockList() {
	chrome.storage.sync.get('blockList', function(result) {
		// Store in variable.
		blockList = result.blockList || [];

		// Update UI.
		blockList.forEach(function(value) {
			addListItem(value, value);
		});
	});
};

function saveBlockList(callback) {

	chrome.storage.sync.set({ 'blockList': blockList }, callback);
};

//------------------------------------------------------------
