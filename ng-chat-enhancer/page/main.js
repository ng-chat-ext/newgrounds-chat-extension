/// <reference path="js/chrome-sync.js" />

//------------------------------------------------------------
// Variables
//------------------------------------------------------------

var userListCtn;
var userListCtnObserver;
var userList;
var userListObserver;

var messagesListCtn;
var messagesListCtnObserver;
var messagesList;
var messagesListObserver;

var chatInputTextArea;

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
	dingdongSound = document.getElementById('alert-sound');
	airhornSound = document.getElementById('airhorn-sound');
	chatInputTextArea = document.getElementById('chat-input-textarea');

	// Add events.
	//------------------------------------------------------------
	chrome.storage.onChanged.addListener(storageChange);
	// These only watch for the actual lists to be generated.
	userListCtnObserver = new WebKitMutationObserver(function(mutations) { mutations.forEach(userListCtnObserve); });
	userListCtnObserver.observe(userListCtn, { childList: true });
	messagesListCtnObserver = new WebKitMutationObserver(function(mutations) { mutations.forEach(messagesListCtnObserve); });
	messagesListCtnObserver.observe(messagesListCtn, { childList: true });
	// Textarea
	chatInputTextArea.addEventListener('keydown', chatInputKeyPress);

	// Remove airhorn overlay.
	var overlayShame = document.getElementById('overlay-shame');
	overlayShame.parentNode.removeChild(overlayShame);

	NGCE.ChromeSync.Settings.load(refreshSettings);
	NGCE.ChromeSync.BlockList.load();
	NGCE.Sounds.init();	
	NGCE.LastSeen.init();

	// // Get emoticon list.
	// for (var i = document.styleSheets.length - 1; i >= 0; i--) {
	// 	// Find chat stylesheet.
	// 	if (document.styleSheets[i].href && document.styleSheets[i].href.substr(0, 38) === "https://chat.newgrounds.com/build/chat")
	// 		console.log('test');
	// }
	emoteListener();
	getChatCSS();
};


//------------------------------------------------------------
// Input
//------------------------------------------------------------

function chatInputKeyPress(e) {
    // Only accept enter key.
    if (e.keyCode !== 13) return;

    // Check if text is a command.
    if (chatInputTextArea.value[0] !== '/') return;

    // Get command text.
    var command = chatInputTextArea.value.split(' ')[0].substr(1);
    var args = chatInputTextArea.value.split(' ').shift();

    // !!!
	return;
	console.dir(NGCE);

	// Check if command was found.
    if (!NGCE.KeyCommands.execute(command))
    	return;

    // Stop propagation if command is successfully executed.
	e.stopImmediatePropagation();

	// Also clear textarea.
	chatInputTextArea.value = '';
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
		applyUserListBlock(node);
};

function refreshUserList(blockList) {
	var items = document.querySelectorAll('.user-list li');

	for (var i = items.length - 1; i >= 0; i--) {
		// Remove block class.
		items[i].classList.remove('client-block');

		// Re-apply block class if qualify.
		for (var j = blockList.length - 1; j >= 0; j--) {
			applyUserListBlock(items[i]);
		}
	}
};

function applyUserListBlock(item) {
	var bl = NGCE.ChromeSync.BlockList.Data;

	for (var i = bl.length - 1; i >= 0; i--) {
		if (item.innerHTML.indexOf(bl[i]) === 80) {
			item.classList.add('client-block');
			break;
		}
	}
}

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

	applyMessagesListBlock(node, NGCE.ChromeSync.BlockList.Data);

	NGCE.LastSeen.update(node);
};

function refreshMessagesList(blockList) {
	var items = document.querySelectorAll('.messages-list li');


	for (var i = items.length - 1; i >= 0; i--) {
		// Remove block class.
		items[i].classList.remove('client-block');

		// Re-apply block class if qualify.
		for (var j = blockList.length - 1; j >= 0; j--) {
			applyMessagesListBlock(items[i], blockList);
		}
	}

	// Update messages area scroll position.
	var area = document.querySelector('.messages-area');
	area.scrollTop = 0;
	area.scrollTop = area.scrollHeight - area.clientHeight;
};

function applyMessagesListBlock(messageNode, blockList) {

	var usernameNode = messageNode.querySelector('.msg-username');
	if (!usernameNode)
		return;

	// Remove messages from user.
	if (blockList.indexOf(usernameNode.innerText) !== -1) {
		messageNode.classList.add('client-block');
		return;
	}

	// Remove messages mentioning user.
	if (isMessageContainsBlockedMention(messageNode, blockList))
		messageNode.classList.add('client-block');
};

function isMessageContainsBlockedMention(messageNode, blockList) {
	var links = messageNode.querySelectorAll('.msg-text a');
	if (links.length === 0)
		return false;

	for (var i = 0; i < links.length; i++) {
		if (blockList.indexOf(links[i].innerText.substr(1)) === -1)
			continue;

		return true;
	}

	return false;
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
		refreshUserList(NGCE.ChromeSync.BlockList.Data);
		refreshMessagesList(NGCE.ChromeSync.BlockList.Data);	
	}
};

//------------------------------------------------------------
//------------------------------------------------------------
// Helper
//------------------------------------------------------------


//------------------------------------------------------------
//------------------------------------------------------------


//------------------------------------------------------------
// Emoticons
//------------------------------------------------------------


function emoteListener(){
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    	document.getElementById("chat-input-textarea").value += request.name;
	  });
}

function getChatCSS(){
	var css = document.querySelector('link[rel="stylesheet"][type="text/css"]');
	
	chrome.storage.sync.set({'css-url': css.getAttribute('href')});
}





