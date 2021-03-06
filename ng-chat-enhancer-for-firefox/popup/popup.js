//------------------------------------------------------------
// Variables
//------------------------------------------------------------

// Menu
var menuBtns = [];
var menuCurr = -1;

// Data
// var mentions = [];

//------------------------------------------------------------



//------------------------------------------------------------
// Initialize
//------------------------------------------------------------

document.addEventListener('DOMContentLoaded', init);

function init() {
	// Menu
	// TODO - Not sure what this does at a glance, I must go deeper.
	var tmp;
	for (var i = 6; i >= 1; i--) {
		tmp = document.getElementById('btnMenu' + i);
		(function(i) { tmp.addEventListener('click', function() { switchMenu(i-1) }); }(i));
		menuBtns.unshift(tmp);
	}
	switchMenu(0);

	// Initialize components.
	NGCE.ChromeSync.init();
	NGCE.Block.init();
	// NGCE.Mentions.init();	TODO - 'll just have to find an alternative l8r
	NGCE.Sounds.init();
	NGCE.Settings.init();
	NGCE.Stats.init();
};

//------------------------------------------------------------



//------------------------------------------------------------
// Methods
//------------------------------------------------------------

function switchMenu(index) {
	if (menuCurr != -1)
		document.querySelector('.menu.show').classList.remove('show');

	menuCurr = index;
	document.querySelectorAll('.menu')[menuCurr].classList.add('show');
};

//------------------------------------------------------------