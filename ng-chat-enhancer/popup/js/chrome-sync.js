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
	Data: {},



	load: function(callback) {
		chrome.storage.sync.get('mentions', function(result) {
			var o = NGCE.ChromeSync.Mentions;
			// Store in variable.
			o.Data = result.mentions || {};
			o.Data.mentions = JSON.parse(LZString.decompressFromUTF16(o.Data.mentions));

			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	},



	save: function() {
		var o = NGCE.ChromeSync.Mentions;
		
		// Keep array structure, save compressed data.
		var arr = o.Data.mentions.slice(0);
		o.Data.mentions = LZString.compressToUTF16(JSON.stringify(o.Data.mentions));
		chrome.storage.sync.set({ 'mentions': o.Data });
		o.Data.mentions = arr;
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



var Stats = {
	Data: {},
	Watchers: [],



	save: function() {
		chrome.storage.sync.set({ 'stats': NGCE.ChromeSync.Stats.Data });
	},



	load: function(callback) {
		chrome.storage.sync.get('stats', function(result) {
			// Store in variable.
			NGCE.ChromeSync.Stats.Data = result.stats || {};
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	},



	addWatch: function(callback) {
		NGCE.ChromeSync.Stats.Watchers.push(callback);
	}
};

//------------------------------------------------------------



//------------------------------------------------------------
NGCE.ChromeSync = {
	BlockList: BlockList,
	Mentions: Mentions,
	Settings: Settings,
	Sounds: Sounds,
	Stats: Stats,

	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	chrome.storage.onChanged.addListener(storageChange);
};

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function storageChange(changes, namespace) {
	var o = NGCE.ChromeSync;

	// Settings
	if (changes['stats']) {
		o.Stats.Data = changes['stats'].newValue;
		o.Stats.Watchers.forEach(function(f) { f(); });
	}

};

//------------------------------------------------------------

}());