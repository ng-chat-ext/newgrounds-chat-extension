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
	txtStatMsgSent.innerText = o.Data.messageSent || 0;
	txtStatMentioned.innerText = o.Data.mentioned || 0;
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