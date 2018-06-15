(function() {

//------------------------------------------------------------
NGCE.Mentions = {
	init: init,
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
	NGCE.Helper.Watch.watch('mentioned', NGCE.Mentions.store);
};

function store(obj) {
	// Create object for storage.
	var mObj = {
		read: false, // Flag to indicate whether this mention has been marked as read/unread.
		channel: document.getElementsByTagName('title')[0].innerText.split(' ')[0], // Channel name.
		type: obj.type
	};

	// Message type specific properties.
	switch(mObj.type) {
		case 1:
			mObj.username = obj.username;
			mObj.userType = obj.node.classList.contains('supporter') ? 'supporter' :
							obj.node.classList.contains('mod') ? 'mod' :
							obj.node.classList.contains('admin') ? 'admin' : '';
			mObj.time = obj.node.querySelector('.msg-time').innerText;
			mObj.text = obj.node.querySelector('.msg-text-dmtext').innerText + getRawText(obj.node.querySelector('.msg-text'));
			break;
		case 2:
			mObj.text = getRawText(obj.node.querySelector('.me-message-text'));
			break;
	}
	
	// Ignore system messages (sent by 'Chat').
	if (mObj.type === 1 && mObj.username === 'Chat')
		return;

	// Add object to sync.
	NGCE.ChromeSync.Mentions.add(mObj, true);
};

//------------------------------------------------------------

}());