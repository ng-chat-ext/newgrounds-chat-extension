(function() {

//------------------------------------------------------------
NGCE.Mentions = {
	init: init,
	storeIfMentioned: storeIfMentioned
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function isMentioned(msgNode) {
	return (msgNode.querySelector('.msg-text-area.mention') != null || msgNode.querySelector('.me-message-text.mention') != null);
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	NGCE.ChromeSync.Mentions.load();
};

function storeIfMentioned(msgNode) {
	if (isMentioned(msgNode) !== true)
		return;

	// Create object for storage.
	var obj = {
		read: false, // Flag to indicate whether this mention has been marked as read/unread.
		channel: document.querySelector('.sub-header-channel-name').innerText // Channel name.
	};

	// Message type specific properties.
	if (msgNode.querySelector('.msg-text-area') != null) {
		obj.type = 1;
		var userNode = msgNode.querySelector('.msg-username');
		obj.username = userNode.innerText;
		obj.userType = userNode.classList.contains('supporter') ? 'supporter' :
					   userNode.classList.contains('mod') ? 'mod' : '';
		obj.time = msgNode.querySelector('.msg-time').innerText;
		obj.text = msgNode.querySelector('.msg-text-area').innerText;
	} else if (msgNode.querySelector('.me-message-text') != null) {
		obj.type = 2;
		obj.text = msgNode.querySelector('.me-message-text').innerText;
	}

	// Add object to sync.
	NGCE.ChromeSync.Mentions.add(obj, true);
};

//------------------------------------------------------------

}());