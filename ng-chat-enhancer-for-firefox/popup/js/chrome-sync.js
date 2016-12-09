/*
	Browser-Sync
	Author - Jin
	Co-Author - Mykei

	TODO - Think of a thorough and witty description

	<N1>  Note: When debugging, never set a breakpoint when calling data from or
		  to storage, as Promise is asynchronus, and if delayed it will 
		  return a rejection.  This probably applies to chrome as well.  A good
		  idea would be to use an empty function, like nop, before and/or after
		  Promise is called.
*/

(function() {

//------------------------------------------------------------
// Public variables
//------------------------------------------------------------

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
			NGCE.ChromeSync.BlockList.Data = result.blocklist || [];
			// Execute callback.
			if (typeof callback === 'function')
				callback();	//	TODO - WHAT IS YOUR FUNCTION MAGGOT?!?

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
			callback - 
	*/
	save: function(callback) {
		var blockSync = browser.storage.local.set({"blocklist": NGCE.ChromeSync.BlockList.Data});	//

		blockSync.then(function(result){
			callback();
		}, function(err){
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
			o.Data = result.mentions || {};
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
		
		// Keep array structure, save compressed data.
		var arr = o.Data.mentions.slice(0);
		o.Data.mentions = LZString.compressToUTF16(JSON.stringify(o.Data.mentions));
		breakpoint();
		var saveMentions = browser.storage.local.set({ "mentions": o.Data });

		saveMentions.then(null, function(err){
			console.log("Error: " + err);
		}).catch(function(rejected){
			console.log("ERR_EXT_REJECTION: " + rejected);
		});

		//	!!! Keeping this as a reference for now !!!
		// TODO - remove getBytesInUse functionality until alternative is found
		// chrome.storage.sync.set({ 'mentions': o.Data }, function() {
		// 	NGCE.ChromeSync.Mentions.getBytesInUse(NGCE.Mentions.updateSpaceInUse);
		// });

		o.Data.mentions = arr;
	},



	getBytesInUse: function(callback) {
		//	getBytesInUse is not supported by firefox Web API :tired_face:
		// 	TODO - remove getBytesInUse functionality until alternative is found
		// chrome.storage.sync.getBytesInUse('mentions', function (bytesInUse) {
		// 	if (callback)
		// 		callback(bytesInUse);
		// });

		var mentionsStorage = browser.storage.local.get("mentions");

		mentionsStorage.then(
			function(result){
				var bytesInUse = roughSizeOfObject(result);
				breakpoint();

				if(callback){
					callback(bytesInUse);
				}
			},
			function(err){
				console.log("ERR : " + err );
			})
	}
};


/*
	It would be annoying if you had to change the settings back everytime.  Read and write settings.
*/
var Settings = {
	Data: {},	//	Obj to store setting conifigured by the user


	/*
		Saves recently configured settings.  To be or not to be, that's my choice not yours.
	*/
	save: function() {
		
		var saveSettings = browser.storage.local.set({ "settings": NGCE.ChromeSync.Settings.Data });
		breakpoint();

		//	!!! Keeping this as a reference for now !!!
		//	chrome.storage.sync.set({ 'settings': NGCE.ChromeSync.Settings.Data });
	},



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
		).catch(function(reason){
			console.log("Rejected: " + reason);
		});


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
	Watchers: [],	// Well this is new...


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
	},


	/*
		TODO -  what does this do?  What is watchers.
	*/
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
	var o = NGCE.ChromeSync;

	// Settings
	if (changes['stats']) {
		o.Stats.Data = changes['stats'].newValue;
		o.Stats.Watchers.forEach(function(f) { f(); });
	}

};

/*
	Because of Promise's asynchronus behavior (lookup comment <N1>), this empty
	function will be used for debugging and serve as a breakpoint place 
	holder whenver I need to read data before and after Promise has been 
	used.
*/
function breakpoint(){};

/*
	Reads any object and returns a rough estamite of how many bytes
	it is using.  Adding this becuase of Firefox doesn't support storage.getBytesInUse.
	@obj -	
			The object whose data will be measured.
	@return -	An estimate of total bytes in use for obj.
*/
function roughSizeOfObject(obj){
	var objectList = [];	//	Stores the object and all instances of its children.
	var stack = [ obj ];
	var bytes = 0;

	while(stack.length){
		var val = stack.pop();

		if(typeof val === 'boolean'){
			bytes += 4;
		} 
		else if (typeof val === 'string'){
			bytes += val.length * 2;
		} 
		else if (typeof val === 'number'){
			bytes += 8;
		} 
		else if (typeof val === 'object' && objectList.indexOf(val) === -1){
			objectList.push( val );

			for(var i in val){
				stack.push( val[i] );
			}
		}
	}

	return bytes;
}

//------------------------------------------------------------

}());