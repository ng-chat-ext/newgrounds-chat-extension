(function() {

//------------------------------------------------------------
// Public variables
//------------------------------------------------------------

var BlockList = {
	//------------------------------------------------------------
	Data: [],
	//------------------------------------------------------------



	//------------------------------------------------------------
	// Loads data.
	//------------------------------------------------------------
	load: function(callback) {
		chrome.storage.sync.get('blockList', function(result) {
			// Store in variable.
			NGCE.ChromeSync.BlockList.Data = result.blockList || [];
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	}
	//------------------------------------------------------------
};

var Settings = {
	//------------------------------------------------------------
	Data: {},
	//------------------------------------------------------------



	//------------------------------------------------------------
	// Loads data.
	//------------------------------------------------------------
	load: function(callback) {
		chrome.storage.sync.get('settings', function(result) {
			// Store in variable.
			NGCE.ChromeSync.Settings.Data = result.settings || {};
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	}
	//------------------------------------------------------------
};

//------------------------------------------------------------



//------------------------------------------------------------
NGCE.ChromeSync = {
	BlockList: BlockList,
	Settings: Settings,

	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	// chrome.storage.onChanged.addListener(storageChange);
};

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

// function storageChange(changes, namespace) {
// 	var o = NGCE.ChromeSync;

// 	// Settings
// 	if (changes['settings']) {
// 		o.Settings.Data = changes['settings'].newValue;

// 		refreshSettings();
// 	}

// 	// Block List
// 	if (changes['blockList']) {
// 		o.BlockList.Data = changes['blockList'].newValue;
// 		refreshUserList(NGCE.ChromeSync.BlockList.Data);
// 		refreshMessagesList(NGCE.ChromeSync.BlockList.Data);
// 	}
// };

//------------------------------------------------------------

}());