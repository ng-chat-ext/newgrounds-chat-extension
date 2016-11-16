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



	save: function() {
		chrome.storage.sync.set({ 'blockList': NGCE.ChromeSync.BlockList.Data });
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
			o.Data = (!!result.mentions && result.mentions.v === '1') ? result.mentions : { v: '1', unread: 0, mentions: LZString.compressToUTF16('[]') };
			// Decompress and parse data into object.
			o.Data.mentions = JSON.parse(LZString.decompressFromUTF16(o.Data.mentions));
			
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		});
	},



	save: function() {
		var o = NGCE.ChromeSync.Mentions;

		// Convert data into string and compress.
		o.Data.mentions = LZString.compressToUTF16(JSON.stringify(o.Data.mentions));

		chrome.storage.sync.set({ 'mentions': o.Data }, function() {
			if (chrome.runtime.lastError)
				console.log('Error detected:', chrome.runtime.lastError.message);
		});
	},



	add: function(mention, save) {
		var o = NGCE.ChromeSync.Mentions;

		// Always fetch the updated list before adding to mentions.
		o.load(function() {
			o.Data.unread++;

			if (o.Data.mentions.length === 0)
				mention.id = 1;
			else
				mention.id = (o.Data.mentions[o.Data.mentions.length - 1].id || 0) + 1;

			o.Data.mentions.push(mention);

			if (save === true)
				o.save();
		});
	}
};



var Settings = {
	Data: {},



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
	// Settings
	if (changes['settings']) {
		NGCE.ChromeSync.Settings.Data = changes['settings'].newValue;
		NGCE.Settings.refresh();
	}

	// Block List
	if (changes['blockList']) {
		NGCE.ChromeSync.BlockList.Data = changes['blockList'].newValue;
		NGCE.Block.refresh();
	}

	// Sounds
	if (changes['sounds']) {
		NGCE.ChromeSync.Sounds.Data = changes['sounds'].newValue;
		NGCE.Sounds.refreshSounds();
	}
};

//------------------------------------------------------------

}());