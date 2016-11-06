(function() {

//------------------------------------------------------------

function init() {
	// Set badge background color.
	chrome.browserAction.setBadgeBackgroundColor({color: "#eeb211"});

	loadInitialCount();

	chrome.storage.onChanged.addListener(storageChange);
};
init();

//------------------------------------------------------------

function loadInitialCount() {
	chrome.storage.sync.get('mentions', function(result) {
		// Store in variable.
		if (!result.mentions)
			return;

		var count = result.mentions.unread;
		var badgeText = (count === 0) ? '' : count.toString();

		chrome.browserAction.setBadgeText({text: badgeText});
	});
};

function storageChange(changes, namespace) {
	// Mentions
	if (changes['mentions']) {
		var data = changes['mentions'].newValue;
		
		var count = data.unread;
		var badgeText = (count === 0) ? '' : count.toString();

		chrome.browserAction.setBadgeText({text: badgeText});
	}
};

//------------------------------------------------------------

}());