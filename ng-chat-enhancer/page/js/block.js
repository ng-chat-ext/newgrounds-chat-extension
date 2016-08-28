(function() {

//------------------------------------------------------------
NGCE.Block = {
	init: init,
	refresh: refresh,
	refreshUserList: refreshUserList,
	applyToUserNode: applyToUserNode,
	refreshMessagesList: refreshMessagesList,
	applyToMessageNode: applyToMessageNode
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function isMessageContainsBlockedMention(messageNode) {
	var o = NGCE.ChromeSync.BlockList.Data;
	var links = messageNode.querySelectorAll('.msg-text a');

	if (links.length === 0)
		return false;

	for (var i = 0; i < links.length; i++) {
		if (o.indexOf(links[i].innerText.substr(1)) === -1)
			continue;

		return true;
	}

	return false;
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
};

function refresh() {
	refreshUserList();
};

function refreshUserList() {
	var o = NGCE.ChromeSync.BlockList.Data;
	var items = document.querySelectorAll('.user-list li');

	for (var i = items.length - 1; i >= 0; i--) {
		// Remove block class.
		items[i].classList.remove('client-block');

		// Re-apply block class if qualify.
		for (var j = o.length - 1; j >= 0; j--) {
			applyToUserNode(items[i]);
		}
	}
};

function applyToUserNode(node) {
	var o = NGCE.ChromeSync.BlockList.Data;

	for (var i = o.length - 1; i >= 0; i--) {
		if (node.innerHTML.indexOf(o[i]) === 80) {
			node.classList.add('client-block');
			break;
		}
	}
};

//------------------------------------------------------------

function refreshMessagesList() {
	var o = NGCE.ChromeSync.BlockList.Data;
	var items = document.querySelectorAll('.messages-list li');

	for (var i = items.length - 1; i >= 0; i--) {
		// Remove block class.
		items[i].classList.remove('client-block');

		// Re-apply block class if qualify.
		for (var j = o.length - 1; j >= 0; j--) {
			applyToMessageNode(items[i], o);
		}
	}

	// Update messages area scroll position.
	var area = document.querySelector('.messages-area');
	area.scrollTop = 0;
	area.scrollTop = area.scrollHeight - area.clientHeight;
};

function applyToMessageNode(messageNode) {
	var o = NGCE.ChromeSync.BlockList.Data;
	var usernameNode = messageNode.querySelector('.msg-username');

	if (!usernameNode)
		return;

	// Remove messages from user.
	if (o.indexOf(usernameNode.innerText) !== -1) {
		messageNode.classList.add('client-block');
		return;
	}

	// Remove messages mentioning user.
	if (isMessageContainsBlockedMention(messageNode))
		messageNode.classList.add('client-block');
};

//------------------------------------------------------------

}());