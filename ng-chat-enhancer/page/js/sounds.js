(function() {

//------------------------------------------------------------
NGCE.Sounds = {
	refreshSounds: refreshSounds,
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------
var DEFAULT_VOLUME = 0.5;
var dingdongSound;

var airhornSound;

var slapSound;
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function dingdongSoundPlay() {
	if (NGCE.ChromeSync.Sounds.Data['alert-sound'] === false)
		return;

	// Remove notification sound if @'d by a blocked user.
	var usernameNode = document.querySelector('.messages-list li:last-child .msg-username');
	if (!usernameNode) return;

	// Pause if mentioned by blocked user.
	if (NGCE.ChromeSync.BlockList.Data.indexOf(usernameNode.innerText.trim()) !== -1) {

		dingdongSound.volume = 0;
		dingdongSound.pause();
	} else
		dingdongSound.volume = DEFAULT_VOLUME;
};

function dingdongSoundEnded() {
	dingdongSound.volume = 0;
};

function airhornSoundPlay() {
	chatInputTextArea.disabled = false;
};

//------------------------------------------------------------

function getElements() {
	var audios = document.querySelectorAll('audio');
	var src;

	for (var i = audios.length - 1; i >= 0; i--) {
		src = audios[i].getAttribute('src');
		if (!src || src.indexOf('/alerts/') === -1) continue;

		src = src.substring(8);

		if (src.indexOf('alert') === 0)
			dingdongSound = audios[i];
		else if (src.indexOf('airhorn') === 0)
			airhornSound = audios[i];
		// else if (src.indexOf('slap') === 0)
		// 	slapSound = audios[i];
	}
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function refreshSounds() {
	for (var property in NGCE.ChromeSync.Sounds.Data) {
		var elem = document.getElementById(property);
		if (elem)
			elem.volume = (NGCE.ChromeSync.Sounds.Data[property] === false) ? 0 : DEFAULT_VOLUME;
	}
};

function init() {
	getElements();

	if (dingdongSound) {
		dingdongSound.volume = 0;
		dingdongSound.addEventListener('play', dingdongSoundPlay);
		dingdongSound.addEventListener('ended', dingdongSoundEnded);
	}

	if (airhornSound)
		airhornSound.addEventListener('play', airhornSoundPlay);

	NGCE.ChromeSync.Sounds.load(refreshSounds);
};

//------------------------------------------------------------

}());