(function() {

//------------------------------------------------------------
NGCE.Block = {
	init: init,
	refresh: refresh,
	applyToUserNode: applyToUserNode,
	applyToMessageNode: applyToMessageNode
}
//------------------------------------------------------------



//------------------------------------------------------------
// Private Variables
//------------------------------------------------------------

var _bl;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function isMessageContainsBlockedMention(mentions) {
	for (var i = 0; i < mentions.length; i++) {
		if (_bl.Data.indexOf(mentions[i]) === -1)
			continue;
		return true;
	}

	return false;
}

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	_bl = NGCE.ChromeSync.BlockList;

	_bl.load(refresh);
	NGCE.Helper.Watch.watch('user', NGCE.Block.applyToUserNode);
	NGCE.Helper.Watch.watch('message', NGCE.Block.applyToMessageNode);
}

function refresh() {
	refreshUserList();
	refreshMessagesList();
}

//------------------------------------------------------------

function refreshUserList() {
	var items = document.querySelectorAll('.chat-area .user-list li');

	for (var i = items.length - 1; i >= 0; i--) {
		// Remove block class.
		items[i].classList.remove('client-block');
		
		// Re-apply block class if qualify.
		for (var j = _bl.Data.length - 1; j >= 0; j--) {
			applyToUserNode(items[i]);
		}
	}
}

function applyToUserNode(obj) {
	if (isBlocked(obj.username))
		obj.node.classList.add('client-block');
}

//------------------------------------------------------------

function refreshMessagesList() {
	var items = document.querySelectorAll('.messages-list li');

	for (var i = items.length - 1; i >= 0; i--) {
		// Remove block class.
		items[i].classList.remove('client-block');

		// Re-apply block class if qualify.
		for (var j = _bl.Data.length - 1; j >= 0; j--) {
			applyToMessageNode(new NGCE.Obj.MessageInfo(items[i]));
		}
	}

	// Update messages area scroll position. (Not working!)
	var area = document.querySelector('.messages-area');
	area.scrollTop = 0;
	area.scrollTop = area.scrollHeight - area.clientHeight;
}

function applyToMessageNode(obj) {
	if (!obj.username)
		return;

	// Remove messages from user.
	// Remove messages mentioning user.
	if (isBlocked(obj.username) || isMessageContainsBlockedMention(obj.mentions))
		obj.node.classList.add('client-block');
}

//------------------------------------------------------------

function isBlocked(username) {
	for (var i = _bl.Data.length - 1; i >= 0; i--) {
		if (_bl.Data[i].toLowerCase() === username.toLowerCase())
			return true;
	}

	return false;
}

//------------------------------------------------------------

}());