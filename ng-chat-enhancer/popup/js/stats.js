(function() {

//------------------------------------------------------------
NGCE.Stats = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var txtStatMsgSent;
var txtStatMentioned;

var o = NGCE.ChromeSync.Stats;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function updateStats() {
	txtStatMsgSent.innerText = o.Data.messageSent;
	txtStatMentioned.innerText = o.Data.mentioned;
}

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	txtStatMsgSent = document.getElementById('txtStatMsgSent');
	txtStatMentioned = document.getElementById('txtStatMentioned');

	o.load(updateStats);
	o.addWatch(updateStats);
};

//------------------------------------------------------------

}());