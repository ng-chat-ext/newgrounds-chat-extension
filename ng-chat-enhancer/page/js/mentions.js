(function() {

//------------------------------------------------------------
NGCE.Mentions = {
	init: init,
	isMentioned: isMentioned,
	store: store
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function getRawText(node) {
	var full = '';
	node.childNodes.forEach(function(v) {
		if (v.nodeName === 'IMG')
			full += v.alt;
		else if (v.nodeName === '#text')
			full += v.nodeValue;
		else if (v.nodeName === 'SPAN')
			full += v.getAttribute('title');
		else
	        full += v.innerText;
	})
	return full;
}

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	NGCE.ChromeSync.Mentions.load();
};

function isMentioned(msgNode) {
	return (msgNode.querySelector('.msg-text-area.mention') != null || msgNode.querySelector('.me-message-text.mention') != null);
};

function store(msgNode) {
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
					   userNode.classList.contains('mod') ? 'mod' :
					   userNode.classList.contains('admin') ? 'admin' : '';
		obj.time = msgNode.querySelector('.msg-time').innerText;
		obj.text = msgNode.querySelector('.msg-text-dmtext').innerText + getRawText(msgNode.querySelector('.msg-text'));
	} else if (msgNode.querySelector('.me-message-text') != null) {
		obj.type = 2;
		obj.text = getRawText(msgNode.querySelector('.me-message-text'));
	}

	// Add object to sync.
	NGCE.ChromeSync.Mentions.add(JSON.stringify(obj), true);
};

//------------------------------------------------------------

}());