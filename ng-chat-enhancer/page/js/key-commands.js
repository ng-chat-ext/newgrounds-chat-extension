(function() {

//------------------------------------------------------------
NGCE.KeyCommands = {
	Map: [],
	MapLookup: {},

	add: add,
	execute: execute,
	constructLookup: constructLookup
};
//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function add(key, callback) {
	NGCE.KeyCommands.Map.push({'key': key, 'callback': callback});
};

function execute(key, args) {
	var o = NGCE.KeyCommands;

	if (!o.MapLookup[key])
		return false;

	o.MapLookup[key].callback(args);
	return true;
};

function constructLookup() {
	var o = NGCE.KeyCommands;

	for (var i = o.Map.length - 1; i >= 0; i--) {
		o.MapLookup[o.Map.key] = o.Map[i];
	}
};

//------------------------------------------------------------

}());