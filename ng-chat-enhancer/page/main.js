//------------------------------------------------------------
// Variables
//------------------------------------------------------------

// Mutation observers.
var obsULCtn, obsMLCtn;
// After welcome
var afterWelcome = false;

//------------------------------------------------------------



//------------------------------------------------------------
// Initialize
//------------------------------------------------------------

document.addEventListener('DOMContentLoaded', init, false);
function init() {
	// Add events.
	chrome.runtime.onMessage.addListener(runtimeMessage);

	// Initialize mutation observers.
	initObserve();

	// Remove airhorn overlay.
	var overlayShame = document.querySelector('.overlay-shame-message') || null;
	if (overlayShame)
		overlayShame.parentNode.parentNode.removeChild(overlayShame.parentNode);

	// Initialize components.
	NGCE.ChromeSync.init();
	NGCE.Block.init();
	NGCE.Emoticons.init();
	NGCE.KeyCommands.init();
	NGCE.LastSeen.init();
	NGCE.LoveJin.init();
	// NGCE.Mentions.init();
	NGCE.Settings.init();	
	NGCE.Sounds.init();
	NGCE.Stats.init();
};

//------------------------------------------------------------



//------------------------------------------------------------
// Observe
//------------------------------------------------------------

// Initializes mutation observers on the user-list and message-list.
function initObserve() {
	// Observe user-list.
	//------------------------------------------------------------
	var ULCtn = document.querySelector('user-list');
	obsULCtn = new WebKitMutationObserver(function(mutations) { mutations.forEach(userListCtnObserve); });
	obsULCtn.observe(ULCtn, { childList: true });

	function userListCtnObserve(mutation) {
		var node = mutation.addedNodes[0];

		if (!node || node.nodeName !== "UL" || !node.classList.contains('user-list'))
			return;

		// Observe the generated class list.
		var obsUL = new WebKitMutationObserver(function(mutations) { mutations.forEach(userListObserve); });
		obsUL.observe(node, { childList: true });

		// Clean up.
		obsULCtn.disconnect();
		obsULCtn = null;
	};
	//------------------------------------------------------------



	// Observe message-list.
	//------------------------------------------------------------
	var MLCtn = document.querySelector('messages-list');
	obsMLCtn = new WebKitMutationObserver(function(mutations) { mutations.forEach(messagesListCtnObserve); });
	obsMLCtn.observe(MLCtn, { childList: true });

	function messagesListCtnObserve(mutation) {
		var node = mutation.addedNodes[0];

		if (!node || node.nodeName !== "UL" || !node.classList.contains('messages-list'))
			return;

		// Observe the generated class list.
		var obsML = new WebKitMutationObserver(function(mutations) { mutations.forEach(messagesListObserve); });
		obsML.observe(node, { childList: true });

		// Clean up.
		obsMLCtn.disconnect();
		obsMLCtn = null;
	};
	//------------------------------------------------------------
};

function userListObserve(mutation) {
	var node = mutation.addedNodes[0];
	if (!node || node.nodeName !== "LI")
		return;

	// Modify node.
	changeUserListNodeStructure(node);
	removeHref(node);

	NGCE.Block.applyToUserNode(node);
};

function messagesListObserve(mutation) {
	var node = mutation.addedNodes[0];
	if (!node || node.nodeName !== "LI")
		return;

	// Modify node.
	removeHref(node);

	NGCE.Block.applyToMessageNode(node);
	NGCE.LastSeen.update(node);

	// Actions that should only be performed after the server welcome message.
	if (afterWelcome) {
		if (NGCE.Mentions.isMentioned(node)) {
			NGCE.Mentions.store(node);
			NGCE.Stats.mentioned();
		}
	} else
		afterWelcome = node.querySelector(".server-message-text") !== null;
};



function changeUserListNodeStructure(node) {
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

	try	{
		node.replaceChild(wrapper, usernameNode);
		wrapper.appendChild(firstLine);
		wrapper.appendChild(statusNode);
		firstLine.appendChild(actionToggleNode);
		firstLine.appendChild(usernameNode);
	}
	catch (err) {
		console.error(err, node, usernameNode);
	}
};

function removeHref(node) {
	var usernameNode = node.querySelector('.msg-username, .user-list-username');
	if (usernameNode)
		usernameNode.removeAttribute('href');
};

//------------------------------------------------------------



//------------------------------------------------------------
// 
//------------------------------------------------------------

function runtimeMessage(msg, sender, response) {
	if (msg.from === 'popup' && msg.subject === 'Sounds') {
		var audioIDs = [];		
		var audioElems = document.querySelectorAll('audio');
		audioElems.forEach(function(e) {
			audioIDs.push(e.id);
		});
		response(audioIDs);
	}
};

//------------------------------------------------------------