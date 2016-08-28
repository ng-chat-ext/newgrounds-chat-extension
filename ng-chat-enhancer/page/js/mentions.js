(function() {

//------------------------------------------------------------
NGCE.Mentions = {
	init: init
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

}());