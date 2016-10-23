(function() {

//------------------------------------------------------------
NGCE.Mentions = {
	init: init,
	isMentioned: isMentioned
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------



//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
};

function storeIfMention(messageNode) {
};

function isMentioned(msgNode) {
	// console.log(msgNode);

	if (msgNode.querySelector('.msg-text-area.mention') != null || msgNode.querySelector('.msg-text-area.mention')) {
		// console.log('mentioned');
	}
	return;


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

}());