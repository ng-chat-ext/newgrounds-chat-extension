(function() {

//------------------------------------------------------------
NGCE.Sounds = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------
var dingdongDefaultVolume = 0.5;
var dingdongSound;

var airhornSound;
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function dingdongSoundPlay() {
	// Remove notification sound if @'d by a blocked user.
	var usernameNode = document.querySelector('.messages-list li:last-child .msg-username');
	if (!usernameNode) return;

	// Pause if mentioned by blocked user.
	if (NGCE.ChromeSync.BlockList.Data.indexOf(usernameNode.innerText.trim()) !== -1) {

		dingdongSound.volume = 0;
		dingdongSound.pause();
	} else
		dingdongSound.volume = dingdongDefaultVolume;
};

function dingdongSoundEnded() {
	dingdongSound.volume = 0;
};

function airhornSoundPlay() {
	chatInputTextArea.disabled = false;
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	dingdongSound = document.getElementById('alert-sound');
	airhornSound = document.getElementById('airhorn-sound');

	dingdongSound.volume = 0;

	dingdongSound.addEventListener('play', dingdongSoundPlay);
	dingdongSound.addEventListener('ended', dingdongSoundEnded);
	airhornSound.addEventListener('play', airhornSoundPlay);
};

//------------------------------------------------------------

}());