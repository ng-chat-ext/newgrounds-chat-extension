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
	Settings: Settings
};
//------------------------------------------------------------

}());