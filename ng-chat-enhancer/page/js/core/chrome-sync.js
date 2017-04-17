(function() {

//------------------------------------------------------------
NGCE.ChromeSync = {
	BlockList: new BlockList(),
	Mentions: new Mentions(),
	Settings: new Settings(),
	Sounds: new Sounds(),
	Stats: new Stats(),

	init: init
}
//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {

	chrome.storage.onChanged.addListener(storageChange);
}

function BlockList() {
	var self = this;
	self.Data = null;
	self.save = save;
	self.load = load;
	self.add = add;
	self.remove = remove;

	function save() {
		chrome.storage.sync.set({ 'blockList': self.Data });
	}

	function load(callback) {
		chrome.storage.sync.get('blockList', syncCallback);
		function syncCallback(result) {
			self.Data = result.blockList || [];
			if (typeof callback === 'function')
				callback();
		}
	}

	function add(username, save) {
		self.Data.push(username);
		if (save === true)
			self.save();
	}

	function remove(username, save) {
		var index = self.Data.indexOf(username);
		if (index !== -1)
			self.Data.splice(index, 1);
		
		if (save === true)
			self.save();
	}
}

function Mentions() {
	var self = this;
	self.Data = null;
	self.save = save;
	self.load = load;
	self.add = add;

	function load(callback) {
		chrome.storage.sync.get('mentions', syncCallback);
		function syncCallback(result) {
			// Store in variable.
			self.Data = (!!result.mentions && result.mentions.v === '1') ? result.mentions : { v: '1', unread: 0, mentions: LZString.compressToUTF16('[]') };
			// Decompress and parse data into object.
			self.Data.mentions = JSON.parse(LZString.decompressFromUTF16(self.Data.mentions));
			
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		}
	}

	function save() {
		// Convert data into string and compress.
		self.Data.mentions = LZString.compressToUTF16(JSON.stringify(self.Data.mentions));

		chrome.storage.sync.set({ 'mentions': self.Data }, syncCallback);
		function syncCallback() {
			if (chrome.runtime.lastError)
				console.log('Error detected:', chrome.runtime.lastError.message);
		}
	}

	function add(mention, save) {
		// Always fetch the updated list before adding to mentions.
		self.load(loadCallback);
		function loadCallback() {
			self.Data.unread++;

			mention.id = (self.Data.mentions.length === 0) ? 1 : (self.Data.mentions[self.Data.mentions.length - 1].id || 0) + 1;

			self.Data.mentions.push(mention);

			if (save === true)
				self.save();
		}
	}
}

function Settings() {
	var self = this;
	self.Data = null;
	self.load = load;

	function load(callback) {
		chrome.storage.sync.get('settings', syncCallback);
		function syncCallback(result) {
			// Store in variable.
			self.Data = result.settings || {};
			// Execute callback.
			if (typeof callback === 'function') 
				callback();
		}
	}
}

function Sounds() {
	var self = this;
	self.Data = null;
	self.save = save;
	self.load = load;

	function save() {
		chrome.storage.sync.set({ 'sounds': self.Data });
	}

	function load(callback) {
		chrome.storage.sync.get('sounds', getCallback);

		function getCallback(result) {
			// Store in variable.
			self.Data = result.sounds || {};
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		}
	}
}

function Stats() {
	var self = this;
	self.Data = null;
	self.save = save;
	self.load = load;

	function save() {
		chrome.storage.sync.set({ 'stats': self.Data });
	}

	function load(callback) {
		chrome.storage.sync.get('stats', syncCallback);

		function syncCallback(result) {
			// Store in variable.
			self.Data = result.stats || {};
			// Execute callback.
			if (typeof callback === 'function')
				callback();
		}
	}
}

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
		NGCE.Sounds.refresh();
	}
}

//------------------------------------------------------------

}());
