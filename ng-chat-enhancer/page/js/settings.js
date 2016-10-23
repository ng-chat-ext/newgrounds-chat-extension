(function() {

//------------------------------------------------------------
NGCE.Settings = {
	init: init,
	refresh: refresh
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function setFont(fontName) {

	document.getElementsByTagName("body")[0].style.fontFamily = (fontName) ? fontName : null;
};

function setDensity(density) {
	var body = document.getElementsByTagName('body')[0];

	body.classList.remove(
		'ngce-density-cozy',
		'ngce-density-compact'
		);

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
};

function setFullWidth(isFull) {
	if (typeof isFull !== 'boolean') {
		console.error('Must use boolean for setFullWidth');
		return;
	}

	var body = document.getElementsByTagName('body')[0];

	body.classList.toggle('ngce-fullwidth', isFull);
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {

	NGCE.ChromeSync.Settings.load(NGCE.Settings.refresh);
};

function refresh() {
	var o = NGCE.ChromeSync.Settings;

	NGCE.LastSeen.showAll(o.Data.lastSeen);
	setFont(o.Data.customFont);
	setDensity(o.Data.density);
	setFullWidth(o.Data.fullWidth);
};

//------------------------------------------------------------

}());