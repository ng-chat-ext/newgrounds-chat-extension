(function() {

//------------------------------------------------------------

function init() {
	// Set badge background color.
	browser.browserAction.setBadgeBackgroundColor({color: "#eeb211"});

	loadInitialCount();

	browser.storage.onChanged.addListener(storageChange);
};
init();

//------------------------------------------------------------

function loadInitialCount() {
	var mentions = browser.storage.local.get("mentions");

	mentions.then(
		function(result){
			if(!result.mentions)
				return;

			var count = result.mentions.unread;var badgeText = (count === 0) ? '' : count.toString();

			browser.browserAction.setBadgeText({text: badgeText});
		}
	);

	//	!!! Keeping this as a reference for now !!!
	// browser.storage.local.get('mentions', function(result) {
	// 	// Store in variable.
	// 	if (!result.mentions)
	// 		return;

	// 	var count = result.mentions.unread;
	// 	var badgeText = (count === 0) ? '' : count.toString();

	// 	browser.browserAction.setBadgeText({text: badgeText});
	// });
};

function storageChange(changes, namespace) {
	// Mentions
	if (changes['mentions']) {
		var data = changes['mentions'].newValue;
		
		var count = data.unread;
		var badgeText = (count === 0) ? '' : count.toString();

		browser.browserAction.setBadgeText({text: badgeText});
	}
};

//------------------------------------------------------------

}());