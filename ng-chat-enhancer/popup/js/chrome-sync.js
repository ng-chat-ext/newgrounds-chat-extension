(function() {

//------------------------------------------------------------
// Public variables
//------------------------------------------------------------

var BlockList = {
	Data: [],



	load: function(callback) {
		chrome.storage.sync.get('blockList', function(result) {
			// Store in variable.
			NGCE.ChromeSync.BlockList.Data = result.blockList || [];
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	},



	save: function(callback) {
		chrome.storage.sync.set({ 'blockList': NGCE.ChromeSync.BlockList.Data }, callback);
	},



	add: function(username, save) {
		var o = NGCE.ChromeSync.BlockList;

		o.Data.push(username);

		if (save === true)
			o.save();
	},



	remove: function(username, save) {
		var o = NGCE.ChromeSync.BlockList;

		var index = o.Data.indexOf(username);
		if (index !== -1)
			o.Data.splice(index, 1);
		
		if (save === true)
			o.save();
	}
};



var Mentions = {
	Data: [],



	load: function(callback) {
		chrome.storage.sync.get('mentions', function(result) {
			// Store in variable.
			NGCE.ChromeSync.Mentions.Data = result.mentions || {};
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	},



	save: function() {
		chrome.storage.sync.set({ 'mentions': NGCE.ChromeSync.Mentions.Data });
	}
};



var Settings = {
	Data: {},



	save: function() {
		chrome.storage.sync.set({ 'settings': NGCE.ChromeSync.Settings.Data });
	},



	load: function(callback) {
		chrome.storage.sync.get('settings', function(result) {
			// Store in variable.
			NGCE.ChromeSync.Settings.Data = result.settings || {};
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	}
};



var Sounds = {
	Data: {},



	save: function() {
		chrome.storage.sync.set({ 'sounds': NGCE.ChromeSync.Sounds.Data });
	},



	load: function(callback) {
		chrome.storage.sync.get('sounds', function(result) {
			// Store in variable.
			NGCE.ChromeSync.Sounds.Data = result.sounds || {};
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	}
};

//------------------------------------------------------------



//------------------------------------------------------------
NGCE.ChromeSync = {
	BlockList: BlockList,
	Mentions: Mentions,
	Settings: Settings,
	Sounds: Sounds,

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