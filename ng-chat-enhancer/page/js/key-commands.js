(function() {

//------------------------------------------------------------
NGCE.KeyCommands = {
	Map: [],
	MapLookup: {},

	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var ta; // chat-input-textarea

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function chatInputKeyPress(e) {
    // Only accept enter key.
    if (e.keyCode !== 13) return;

    // Check if text is a command.
    if (ta.value[0] === '/')
    	handleCommand(e);
    else
    	handleNormal(e);
};

function handleCommand(e) {
	try {
	    // Get command and arguments.
	    var data = ta.value.split(' ');
	    var command = data[0].substr(1);
	    var args = data;
	    args.shift();

		// Check if command was found.
	    if (!execute(command, args))
	    	return;

	    // Some commands should not be prevented from sending (/dm).
	    if (!NGCE.KeyCommands.MapLookup[command].preventSending)
	    	return;

	    // Stop propagation if command is successfully executed.
		e.stopImmediatePropagation();

		// Also clear textarea.
		setTimeout(function() { ta.value = ''; }, 10);
	} catch(err) {
		console.error("Error in handleCommand: " + err);
	}
};

function handleNormal(e) {
	applyZornMode();
};

//------------------------------------------------------------

function constructLookup() {
	var o = NGCE.KeyCommands;

	for (var i = o.Map.length - 1; i >= 0; i--) {
		o.MapLookup[o.Map[i].key] = o.Map[i];
	}
};

function add(key, callback, preventSending) {
	NGCE.KeyCommands.Map.push({
		'key': key,
		'callback': callback,
		'preventSending': typeof preventSending === 'undefined' ? true : preventSending
	});
};

function execute(key, args) {
	var o = NGCE.KeyCommands;

	if (!o.MapLookup[key])
		return false;

	o.MapLookup[key].callback(args);
	return true;
};

//------------------------------------------------------------

function cmdClear() {
	var list = document.querySelector('ul.messages-list');
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
};

function cmdDirectMessage() {
	applyZornMode();
};

//------------------------------------------------------------

function applyZornMode() {
	if (NGCE.ChromeSync.Settings.Data.zornMode === true) {
		var c = ta.value[ta.value.length - 1];
		if (c !== '?' && c !== '!')
			ta.value += '...';
	}
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	ta = document.getElementById('chat-input-textarea');
	ta.addEventListener('keydown', chatInputKeyPress);

	// Third parameter (preventSending) should be set to
	// false if you want to let the command go through to the server.

	add('clear', cmdClear);
	add('dm', cmdDirectMessage, false);
	constructLookup();
};

//------------------------------------------------------------

}());