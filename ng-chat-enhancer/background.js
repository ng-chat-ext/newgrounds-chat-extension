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
	console.log(changes);
	// Mentions
	if (changes['mentions']) {
		var mentions = changes['mentions'].newValue;
		
		var count = mentions.length;
		var badgeText = (count > 99) ? '99+' : count.toString();

		chrome.browserAction.setBadgeText({text: badgeText});
	}
};

//------------------------------------------------------------

}());