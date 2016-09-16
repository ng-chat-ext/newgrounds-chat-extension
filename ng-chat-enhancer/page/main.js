//------------------------------------------------------------
// Variables
//------------------------------------------------------------

var userListCtn, userListCtnObserver, userList, userListObserver;
var messagesListCtn, messagesListCtnObserver, messagesList, messagesListObserver;

//------------------------------------------------------------



//------------------------------------------------------------
// Initialize
//------------------------------------------------------------
document.addEventListener('DOMContentLoaded', init, false);
function init() {
	// Get elements.
	//------------------------------------------------------------
	userListCtn = document.querySelector('user-list');
	messagesListCtn = document.querySelector('messages-list');

	// Add events.
	//------------------------------------------------------------
	chrome.storage.onChanged.addListener(storageChange);
	// These only watch for the actual lists to be generated.
	userListCtnObserver = new WebKitMutationObserver(function(mutations) { mutations.forEach(userListCtnObserve); });
	userListCtnObserver.observe(userListCtn, { childList: true });
	messagesListCtnObserver = new WebKitMutationObserver(function(mutations) { mutations.forEach(messagesListCtnObserve); });
	messagesListCtnObserver.observe(messagesListCtn, { childList: true });

	// Remove airhorn overlay.
	var overlayShame = document.querySelector('.overlay-shame-message') || null;
	if (overlayShame)
		overlayShame.parentNode.parentNode.removeChild(overlayShame.parentNode);

	// Initialize components.
	NGCE.ChromeSync.init();
	// NGCE.Block.init();
	NGCE.Emoticons.init();
	NGCE.KeyCommands.init();
	NGCE.LastSeen.init();
	NGCE.LoveJin.init();
	// NGCE.Mentions.init();
	NGCE.Sounds.init();	

	NGCE.ChromeSync.Settings.load(refreshSettings);
	NGCE.ChromeSync.BlockList.load();
};

//------------------------------------------------------------
// User List
//------------------------------------------------------------

function userListCtnObserve(mutation) {
	var node = mutation.addedNodes[0];

	if (!node || node.nodeName !== "UL" || !node.classList.contains('user-list'))
		return;

	// Set user-list.
	userList = node;

	// Observe the generated class list.
	userListObserver = new WebKitMutationObserver(function(mutations) { mutations.forEach(userListObserve); });
	userListObserver.observe(userList, { childList: true });

	// Clean up.
	userListCtnObserver.disconnect();
	userListCtnObserver = null;
};

function userListObserve(mutation) {
	// Get Node
	var node = mutation.addedNodes[0];
	if (!node || node.nodeName !== "LI")
		return;

	// Change element structure.
	var wrapper = document.createElement('div');
	var firstLine = document.createElement('div');
	var statusNode = document.createElement('div');
	var actionToggleNode = document.createElement('span');
	var usernameNode = node.querySelector('.user-list-username');

	actionToggleNode.classList.add('user-list-action');
	statusNode.classList.add('user-list-status');

	usernameNode.setAttribute('ngce-name', usernameNode.getAttribute('alt').split("'")[0]);
	statusNode.innerText = 'last seen: -';

	node.replaceChild(wrapper, usernameNode);
	wrapper.appendChild(firstLine);
	wrapper.appendChild(statusNode);
	firstLine.appendChild(actionToggleNode);
	firstLine.appendChild(usernameNode);

	// Apply block effect.
	NGCE.Block.applyToUserNode(node);
};

//------------------------------------------------------------
// Messages List
//------------------------------------------------------------

function messagesListCtnObserve(mutation) {
	var node = mutation.addedNodes[0];

	if (!node || node.nodeName !== "UL" || !node.classList.contains('messages-list'))
		return;

	// Set user-list.
	messagesList = node;

	// Observe the generated class list.
	messagesListObserver = new WebKitMutationObserver(function(mutations) { mutations.forEach(messagesListObserve); });
	messagesListObserver.observe(messagesList, { childList: true });

	// Clean up.
	messagesListCtnObserver.disconnect();
	messagesListCtnObserver = null;
};

function messagesListObserve(mutation) {
	var node = mutation.addedNodes[0];
	if (!node || node.nodeName !== "LI")
		return;

	NGCE.Block.applyToMessageNode(node);
	NGCE.LastSeen.update(node);
};

//------------------------------------------------------------






//------------------------------------------------------------
// Settings
//------------------------------------------------------------

function refreshSettings() {
	NGCE.LastSeen.showAll(NGCE.ChromeSync.Settings.Data.lastSeen);
	refreshFont(NGCE.ChromeSync.Settings.Data.customFont);
};

//------------------------------------------------------------
// Font
//------------------------------------------------------------

function refreshFont(fontName) {

	document.getElementsByTagName("body")[0].style.fontFamily = (fontName) ? fontName : null;
}

//------------------------------------------------------------
// Data
//------------------------------------------------------------

function storageChange(changes, namespace) {
	// Settings
	if (changes['settings']) {
		NGCE.ChromeSync.Settings.Data = changes['settings'].newValue;

		refreshSettings();
	}

	// Block List
	if (changes['blockList']) {
		NGCE.ChromeSync.BlockList.Data = changes['blockList'].newValue;
		NGCE.Block.refreshUserList();
		NGCE.Block.refreshMessagesList();
	}
};

//------------------------------------------------------------