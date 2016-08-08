//------------------------------------------------------------
// Variables
//------------------------------------------------------------

var mentions = [];

//------------------------------------------------------------

function onLoad() {
	// Set badge background color.
	chrome.browserAction.setBadgeBackgroundColor({color: [255, 255, 255, 1]});

	getMentions(function(mentions) {
		var count = mentions.length;
		var badgeText = (count > 99) ? '99+' : count.toString();

		chrome.browserAction.setBadgeText({text: badgeText});
	});
}();

//------------------------------------------------------------

function getMentions(callback) {
	chrome.storage.sync.get('mentions', function(result) {
		// Execute callback.
		callback(result.mentions || []);
	});
};

//------------------------------------------------------------
