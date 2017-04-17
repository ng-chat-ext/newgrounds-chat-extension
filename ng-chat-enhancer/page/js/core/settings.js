(function() {

//------------------------------------------------------------
NGCE.Settings = {
	init: init,
	refresh: refresh
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var body; // <body> element.
var arrowDownURL; // URL for arrow-down.svg.

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function setFullWidth(isFull) {
	if (typeof isFull !== 'boolean')
		return;

	body.classList.toggle('ngce-fullwidth', isFull);
}

function setFont(fontName) {

	body.style.fontFamily = (fontName) ? fontName : null;
}

function setDensity(density) {
	// Reset
	body.classList.remove(
		'ngce-density-cozy',
		'ngce-density-compact'
		);

	// Apply
	switch (density) {
		case '0': // Default density.
			break;
		case '1': // Cozy
			body.classList.add('ngce-density-cozy');
			break;
		case '2': // Compact
			body.classList.add('ngce-density-compact');
			break;
		default:
			break;
	}
}

function setEmoteHide(emoteHide) {
	// Reset
	body.classList.remove(
		'ngce-emotehide'
		);

	// Apply
	switch (emoteHide) {
		case '0':
			break;
		case '1':
			body.classList.add('ngce-emotehide');
			break;
		default:
			break;
	}
}

function setMoreMessages(moreMessages) {
	var link = document.querySelector('.more-messages-area a');

	// Reset
	body.classList.remove(
		'ngce-more-small'
		);
	link.innerText = 'More messages below.';
	link.style.backgroundImage = "";

	// Apply
	switch (moreMessages) {
		case '0': // Default
			break;
		case '1': // Small
			link.innerText = '';
			link.style.backgroundImage = "url(" + arrowDownURL + ")";
			body.classList.add('ngce-more-small');
			break;
		default:
			break;
	}
}

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	NGCE.ChromeSync.Settings.load(NGCE.Settings.refresh);
};

function refresh() {
	var o = NGCE.ChromeSync.Settings;

	body = document.getElementsByTagName('body')[0];
	arrowDownURL = chrome.extension.getURL("page/img/arrow-down.svg");

	NGCE.LastSeen.showAll();
	setFullWidth(o.Data.fullWidth);
	setFont(o.Data.customFont);
	setEmoteHide(o.Data.emoteHide);
	setDensity(o.Data.density);
	setMoreMessages(o.Data.moreMessages);
};

//------------------------------------------------------------

}());