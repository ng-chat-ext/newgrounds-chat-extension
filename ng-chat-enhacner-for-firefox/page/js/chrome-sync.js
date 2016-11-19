/*
	Browser-Sync
	Author - Jin
	Co-Author - Mykei

	TODO - Think of a thorough yet witty description
*/

(function() {

/*
	For the firefox edition the following API is incompatatible 
	with this browser:
		chrome.storage.sync
		chrome.storage.<storage_area>.getBytesInUse

	Which is saddening, but not end of world.  Syntax also differs
	from chromes :tired_face:.  The promise object is firefox's
	prefered methoed of reading and writting towards the storage.

	TODO - change chrome.storage.sync to browser.storage.local.

	New syntax relies more on Promise object than an anon func
	for a callback... me thinks I could integrate that into the
	each of the objects' properties	(does that make sense?)
*/

//------------------------------------------------------------
// Public variables
//------------------------------------------------------------


/*
	
*/
var BlockList = {
	Data: [],	//	The data that will store every user that has been blocked
				//	by the client.  If you're Amarunthus then you're most likely
				//	on here.


	/*
		Collects the block list
			callback - TODO find out what callback is for
	*/
	load: function(callback) {
		var blockData = browser.storage.local.get("blocklist");
		//	TODO - Instructable?
		blockData.then(
			function(result){

			// Store in variable.
			NGCE.ChromeSync.BlockList.Data = result.blockList || [];
			// Execute callback.
			if (typeof callback === 'function')
				callback();	//	TODO - WHAT IS YOUR FUNCTION NUMBUTZ?!?

			},

			function(err){
				console.log("Error: " + err);
				//	Perhaps implement error towards the user via UI
				//	although I'm lazy; TODO - should check with author if
				//	this is appropriate.
			}
		);

		//	!!! Keeping this as a reference for now !!!
		// chrome.storage.sync.get('blockList', function(result) {
		// 	// Store in variable.
		// 	NGCE.ChromeSync.BlockList.Data = result.blockList || [];
		// 	// Execute callback.
		// 	if (typeof callback === 'function')
		// 		callback();
		// });
	},


	/*
		Saves the current state of the block list.
	*/
	save: function() {
		var blockSync = browser.storage.local.set({"blocklist": NGCE.ChromeSync.BlockList.Data});	//

		blockSync.then(null, function(err){
			console.log("Error: " + err);	// Anomoly has been detected, abandon all hope.
		});

		//	!!! Keeping this as a reference for now !!!
		// chrome.storage.sync.set({ 'blockList': NGCE.ChromeSync.BlockList.Data });
	},


	/*
		Adds user to the block list.  Gone.     Forever...
	*/
	add: function(username, save) {
		var o = NGCE.ChromeSync.BlockList;

		o.Data.push(username);
		//	TODO - Still newb progremer, does this expect chrome.storage.sync
		//	to return !null?  Will ask author what her intentions were l8r
		if (save === true)
			o.save();
	},


	/*
		Removes user from the blocklist.  All has been forgiven!
		Nothing needs changing here ^^
	*/
	remove: function(username, save) {
		var o = NGCE.ChromeSync.BlockList;

		var index = o.Data.indexOf(username);
		if (index !== -1)
			o.Data.splice(index, 1);
		
		if (save === true)
			o.save();
	}
};


/*
	Used to record and store all of the clients mentions...  Aren't you popular?
*/
var Mentions = {
	Data: {},	//	Used to recored all instances of mentions.


	/*
		Loads recorded mentions from browser.storage.local
			callback - TODO...
	*/
	load: function(callback) {
		var mentionList = browser.storage.local.get("mentions");

		mentionList.then(
			function(result){
				var o = NGCE.ChromeSync.Mentions;

				// Store in variable.
				//	TODO - Ask author what "v" is...  also !!?
				o.Data = (!!result.mentions && result.mentions.v === '1') ? result.mentions : { v: '1', unread: 0, mentions: LZString.compressToUTF16('[]') };
				// Decompress and parse data into object.
				o.Data.mentions = JSON.parse(LZString.decompressFromUTF16(o.Data.mentions));
				
				// Execute callback.
				if (typeof callback === 'function')
					callback();
			},
			function(err){
				console.log("Error: " + err);
			}
		);


		//	!!! Keeping this as a reference for now !!!
		// chrome.storage.sync.get('mentions', function(result) {
		// 	var o = NGCE.ChromeSync.Mentions;

		// 	// Store in variable.
		// 	o.Data = (!!result.mentions && result.mentions.v === '1') ? result.mentions : { v: '1', unread: 0, mentions: LZString.compressToUTF16('[]') };
		// 	// Decompress and parse data into object.
		// 	o.Data.mentions = JSON.parse(LZString.decompressFromUTF16(o.Data.mentions));
			
		// 	// Execute callback.
		// 	if (typeof callback === 'function')
		// 		callback();
		// });
	},


	/*
		Saves the current state of the mention list to browser.storage.local
	*/
	save: function() {
		var o = NGCE.ChromeSync.Mentions;
		// Convert data into string and compress.
		o.Data.mentions = LZString.compressToUTF16(JSON.stringify(o.Data.mentions));

		var saveMentions = browser.storage.local.set({ 'mentions': o.Data });
		
		saveMentions.then(null, 
			function(err){
				console.log("Error: " + err);
				// Promise obj err property should yield same result as chrome.runtime.lastError.message
			}
		);
		
		//	!!! Keeping this as a reference for now !!!
		// chrome.storage.sync.set({ 'mentions': o.Data }, function() {
		// 	if (chrome.runtime.lastError)
		// 		console.log('Error detected:', chrome.runtime.lastError.message);
		// });
	},


	/*
		Adds a new menetion to the list.  Oh, someone has notice yew >.>
	*/
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


/*
	It would be annoying if you had to change the settings back everytime.  Read and write settings.
*/
var Settings = {
	Data: {},	//	Obj to store setting conifigured by the user


	/*
		Load the client's previous settings.
			callback - TODO...
	*/
	load: function(callback) {
		var settings = browser.storage.local.get("settings");

		settings.then(
			function(result){
				// Store in variable.
				NGCE.ChromeSync.Settings.Data = result.settings || {};
				// Execute callback.
				if (typeof callback === 'function') 
					callback();
			},
			function(err){
				console.log("Error: " + err);
			}
		);


		//	!!! Keeping this as a reference for now !!!
		// chrome.storage.sync.get('settings', function(result) {
		// 	// Store in variable.
		// 	NGCE.ChromeSync.Settings.Data = result.settings || {};
		// 	// Execute callback.
		// 	if (typeof callback === 'function') 
		// 		callback();
		// });
	}
};


/*
	Sounds object is in charge of remembering what sounds the client wants to hear
	and what they don't.  Heh, selective hearing.
*/
var Sounds = {
	Data: {},	//	Data object that lists sound settings


	/*
		Saves the sound settings into browser.storage.local.
	*/
	save: function() {
		var saveSounds = browser.storage.local.set({ 'sounds': NGCE.ChromeSync.Sounds.Data });

		saveSounds.then(null,
			function(err){
				console.log("Error :" + err);
			}
		);

		//	!!! Keeping this as a reference for now !!!
		//chrome.storage.sync.set({ 'sounds': NGCE.ChromeSync.Sounds.Data });
	},


	/*
		Loads sound settings from browser.storage.local into Data.  Yo Skrill drop it hard.
	*/
	load: function(callback) {
		var settings = browser.storage.local.get("sounds");

		settings.then(
			function(result){
				// Store in variable.
				NGCE.ChromeSync.Sounds.Data = result.sounds || {};
				// Execute callback.
				if (typeof callback === 'function') 
					callback();
			},
			function(err){
				console.log("Error: " + err);
			}
		);

		//	!!! Keeping this as a reference for now !!!
		// chrome.storage.sync.get('sounds', function(result) {
		// 	// Store in variable.
		// 	NGCE.ChromeSync.Sounds.Data = result.sounds || {};
		// 	// Execute callback.
		// 	if (typeof callback === 'function')
		// 		callback();
		// });
	}
};


/*
	Reads and writes clients stats regarding post count and times metnioned.  May your e-peen grow gloriously.
*/
var Stats = {
	Data: {},	//	Data obj to store statisics


	/*
		Saves client stats into browser.storage.local, treasuring each post.
	*/
	save: function() {
		var saveStats = browser.storage.local.set({ 'stats': NGCE.ChromeSync.Stats.Data });

		saveStats.then(null, 
			function(err){
				console.log("Error :" + err);
			}
		);


		//	!!! Keeping this as a reference for now !!!
		//	chrome.storage.sync.set({ 'stats': NGCE.ChromeSync.Stats.Data });
	},


	/*
		Loads stats from browser.storage.local into Data obj.  
	*/
	load: function(callback) {
		var stats = browser.storage.local.get("stats");

		stats.then(
			function(result){
				// Store in variable.
				NGCE.ChromeSync.Stats.Data = result.stats || {};
				// Execute callback.
				if (typeof callback === 'function')
					callback();
			},
			function(err){
				console.log("Error :" + err);
			}
		);


		//	!!! Keeping this as a reference for now !!!			
		// chrome.storage.sync.get('stats', function(result) {
		// 	// Store in variable.
		// 	NGCE.ChromeSync.Stats.Data = result.stats || {};
		// 	// Execute callback.
		// 	if (typeof callback === 'function')
		// 		callback();
		// });
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

	browser.storage.onChanged.addListener(storageChange);	//	Listens for storage changes.
};

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

/*
	Refreshes parameters to the users end whenever they change a setting
		changes	-	(Passed from browser.storage.onChange) 
					a StorageChange object whose properties are the newly
					changed valued, and one for the old one.

		namespace -	(Passed from browser.storage.onChange)
						Depicts which section of StorageArea was changed.
						In this case, it's local.
*/
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