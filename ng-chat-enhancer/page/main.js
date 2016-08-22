//------------------------------------------------------------
// Variables
//------------------------------------------------------------

var userList;
var userListObserver;

var messagesList;
var messagesListObserver;

var dingdongDefaultVolume = 0.5;
var dingdongSound;

var airhornSound;

var chatInputTextArea;



var settings = {};
var blockList = [];
var lastSeenTimes = [];

//------------------------------------------------------------

var onLoad = function() {
	// Get elements.
	userList = document.querySelector('ul.user-list');
	messagesList = document.querySelector('ul.messages-list');
	dingdongSound = document.getElementById('alert-sound');
	airhornSound = document.getElementById('airhorn-sound');
	chatInputTextArea = document.getElementById('chat-input-textarea');


	// Add events.
	chrome.storage.onChanged.addListener(storageChange);
	userListObserver = new WebKitMutationObserver(function(mutations) { mutations.forEach(userListObserve); });
	userListObserver.observe(userList, { childList: true });
	messagesListObserver = new WebKitMutationObserver(function(mutations) { mutations.forEach(messagesListObserve); });
	messagesListObserver.observe(messagesList, { childList: true });
	dingdongSound.addEventListener('play', dingdongSoundPlay);
	dingdongSound.addEventListener('ended', dingdongSoundEnded);
	airhornSound.addEventListener('play', airhornSoundPlay);

	// Initialize.
	init();
}();

//------------------------------------------------------------
//------------------------------------------------------------






//------------------------------------------------------------
// Initialize
//------------------------------------------------------------

function init() {
	getSettings();
	getBlockList();
	emoteListener();
	getChatCSS();

	// Remove airhorn overlay.
	var overlayShame = document.getElementById('overlay-shame');
	overlayShame.parentNode.removeChild(overlayShame);

	// Start clock timer.
	setInterval(timeSinceTimer, 5000);

	// Get emoticon list.
	for (var i = document.styleSheets.length - 1; i >= 0; i--) {
		// Find chat stylesheet.
		if (document.styleSheets[i].href && document.styleSheets[i].href.substr(0, 38) === "https://chat.newgrounds.com/build/chat")
			console.log('test');
	}
};

//------------------------------------------------------------
// User List
//------------------------------------------------------------

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

		statusNode.innerText = 'last seen: -';

		node.replaceChild(wrapper, usernameNode);
		wrapper.appendChild(firstLine);
		wrapper.appendChild(statusNode);
		firstLine.appendChild(actionToggleNode);
		firstLine.appendChild(usernameNode);

	// Apply block effect.
		applyUserListBlock(node);
};

function refreshUserList() {
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
	for (var i = blockList.length - 1; i >= 0; i--) {
		if (item.innerHTML.indexOf(blockList[i]) === 80) {
			item.classList.add('client-block');
			break;
		}
	}
}

//------------------------------------------------------------
// Messages List
//------------------------------------------------------------

function messagesListObserve(mutation) {
	var node = mutation.addedNodes[0];
	if (!node || node.nodeName !== "LI")
		return;

	applyMessagesListBlock(node);

	updateLastSeenTime(node);
};

function refreshMessagesList() {
	var items = document.querySelectorAll('.messages-list li');


	for (var i = items.length - 1; i >= 0; i--) {
		// Remove block class.
		items[i].classList.remove('client-block');

		// Re-apply block class if qualify.
		for (var j = blockList.length - 1; j >= 0; j--) {
			applyMessagesListBlock(items[i]);
		}
	}

	// Update messages area scroll position.
	var area = document.querySelector('.messages-area');
	area.scrollTop = 0;
	area.scrollTop = area.scrollHeight - area.clientHeight;
};

function applyMessagesListBlock(messageNode) {

	var usernameNode = messageNode.querySelector('.msg-username');
	if (!usernameNode)
		return;

	// Remove messages from user.
	if (blockList.indexOf(usernameNode.innerText) !== -1) {
		messageNode.classList.add('client-block');
		return;
	}

	// Remove messages mentioning user.
	if (isMessageContainsBlockedMention(messageNode))
		messageNode.classList.add('client-block');
};

function isMessageContainsBlockedMention(messageNode) {
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
// Sounds
//------------------------------------------------------------

function dingdongSoundPlay() {

	// Remove notification sound if @'d by a blocked user.
	var usernameNode = document.querySelector('.messages-list li:last-child .msg-username');
	if (!usernameNode)
		return;
	if (blockList.indexOf(usernameNode.innerText.trim()) !== -1)
		dingdongSound.pause();
	else
		dingdongSound.volume = dingdongDefaultVolume;
};

function dingdongSoundEnded() {
	
	dingdongSound.volume = 0;
};

function airhornSoundPlay() {
	chatInputTextArea.disabled = false;
};

//------------------------------------------------------------






//------------------------------------------------------------
// Settings
//------------------------------------------------------------

function refreshSettings() {
	refreshLastSeen();
	refreshFont(settings.customFont);
};

//------------------------------------------------------------
// Mentions
//------------------------------------------------------------

function storeIfMention(messageNode) {

};

function isWatchedMention(messageNode) {
	var links = messageNode.querySelectorAll('.msg-text a');
	if (links.length === 0)
		return false;

	for (var i = 0; i < links.length; i++) {
		if (links[i].innerText.charAt(0) !== '@')
			continue;

		if (links[i].innerText.substr(1).toLowerCase() === settings.watchedName.toLowerCase())
			return true;
	}

	return false;
};

//------------------------------------------------------------
// Time Since
//------------------------------------------------------------

function timeSinceTimer() {

	var nodes = userList.querySelectorAll('li[style*="display: inline-block;"]');
	var usernameNode, statusNode;
	var lastSeenTime;
	var dateNow = new Date();

	for (var i = nodes.length - 1; i >= 0; i--) {
		// Get username.
		usernameNode = nodes[i].querySelector('.user-list-username');
		statusNode = nodes[i].querySelector('.user-list-status');

		// Find last seen time.
		lastSeenTime = '-';
		for (var j = lastSeenTimes.length - 1; j >= 0; j--) {
			if (lastSeenTimes[j].username === usernameNode.getAttribute('alt').split("'")[0])
				lastSeenTime = getTimeSinceText(dateNow, lastSeenTimes[j].date);
		}

		// Set last seen text.
		if (statusNode)
			statusNode.innerText = 'last seen: ' + lastSeenTime;
	}
};

function updateLastSeenTime(messageNode) {

	var usernameNode = messageNode.querySelector('.msg-username');
	if (!usernameNode)
		return;

	var username = usernameNode.innerText;
	var found = false;

	// Update last seen time.
	for (var i = lastSeenTimes.length - 1; i >= 0; i--) {
		if (lastSeenTimes[i].username === username) {
			lastSeenTimes[i].date = new Date();
			found = true;
			break;
		}
	}

	// Insert new if user not found.
	if (!found)
		lastSeenTimes.push({ username: username, date: new Date() })
};

function getTimeSinceText(dateNow, date) {

	var seconds = Math.floor((dateNow - date) / 1000);

	var interval = Math.floor(seconds / 31536000);

	if (interval >= 1)
		return interval + " yr" + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 2592000);
	if (interval >= 1)
		return interval + " mth" + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 86400);
	if (interval >= 1)
		return interval + " day" + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 3600);
	if (interval >= 1)
		return interval + " hr" + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 60);
	if (interval >= 1)
		return interval + " min" + (interval > 1 ? 's' : '');
	return "just now";
};

function refreshLastSeen() {
	if (settings.lastSeen === true)
		userList.classList.add('show-status');
	else if (settings.lastSeen === false)
		userList.classList.remove('show-status');
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

function getBlockList() {
	chrome.storage.sync.get('blockList', function(result) {
		// Store in variable.
		blockList = result.blockList || [];
	});
};

function getSettings() {
	chrome.storage.sync.get('settings', function(result) {
		// Store in variable.
		settings = result.settings || {};

		// Update UI.
		refreshSettings();
	});
};

function storageChange(changes, namespace) {
	// Settings
	if (changes['settings']) {
		settings = changes['settings'].newValue;

		refreshSettings();
	}

	// Block List
	if (changes['blockList']) {
		blockList = changes['blockList'].newValue;
		refreshUserList();
		refreshMessagesList();	
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
	    	document.getElementById("chat-input-textarea").value += request.greeting;
	  });
}

function getChatCSS(){
	var css = document.querySelector('link[rel="stylesheet"][type="text/css"]');
	

	chrome.storage.sync.set({'css-url': css.getAttribute('href')}, function(){
		console.log(css.getAttribute('href'));
	});
}





