(function() {

//------------------------------------------------------------

function init() {
	chrome.storage.onChanged.addListener(storageChange);

	// Set badge background color.
	chrome.browserAction.setBadgeBackgroundColor({color: "#eeb211"});
};
init();

//------------------------------------------------------------

function storageChange(changes, namespace) {
	// Mentions
	if (changes['mentions']) {
		var data = changes['mentions'].newValue;
		
		var count = data.count;
		var badgeText = (count > 99) ? '99+' : count.toString();

		chrome.browserAction.setBadgeText({text: badgeText});
	}
};

//------------------------------------------------------------

}());