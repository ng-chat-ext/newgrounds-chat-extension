(function() {

//------------------------------------------------------------
NGCE.LastSeen = {
	Times: [],

	init: init,
	update: update,
	showAll: showAll,
	getDateByUsername: getDateByUsername,
	getText: getText
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function timerTick() {
	var nodes = document.querySelectorAll('#page .user-list > li');
	var username, statusNode;
	var dateFound, dateNow = new Date();

	for (var i = nodes.length - 1; i >= 0; i--) {
		// Get username.
		username = nodes[i].querySelector('.user-list-username').getAttribute('ngce-name');
		statusNode = nodes[i].querySelector('.user-list-status');
		if (!statusNode) continue;

		// Find last seen time.
		dateFound = NGCE.LastSeen.getDateByUsername(username);

		// Set last seen text.
		statusNode.innerText = 'last seen: ' + NGCE.LastSeen.getText(dateNow, dateFound);
	}
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	setInterval(timerTick, 5000);
	NGCE.Helper.Watch.watch('message', NGCE.LastSeen.update);
};

function update(obj) {
	if (!obj.username)
		return;

	var lst = NGCE.LastSeen.Times;
	var found = false;

	// Update last seen time.
	for (var i = lst.length - 1; i >= 0; i--) {
		if (lst[i].username === obj.username) {
			lst[i].date = obj.time;
			found = true;
			break;
		}
	}

	// Insert new if user not found.
	if (!found)
		lst.push({ username: obj.username, date: obj.time });
};

function showAll() {
	var o = NGCE.ChromeSync.Settings.Data;
	if (!o) return;
	var ulist = document.querySelector('ul.user-list');
	if (!ulist) return;
	o.lastSeen ? ulist.classList.add('show-status') : ulist.classList.remove('show-status')
};

function getDateByUsername(username) {
	var lst = NGCE.LastSeen.Times;

	for (var j = lst.length - 1; j >= 0; j--) {
		if (lst[j].username === username)
			return lst[j].date;
	}

	return null;
};

function getText(dateNow, date) {
	if (!date)
		return '-';

	var seconds = Math.floor((dateNow - date) / 1000);

	var interval = Math.floor(seconds / 31536000);

	if (interval >= 1)
		return interval + " yr" + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 2592000);
	if (interval >= 1)
		return interval + " mth" + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 86400);
	if (interval >= 1)
		return interval + " day" + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 3600);
	if (interval >= 1)
		return interval + " hr" + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 60);
	if (interval >= 1)
		return interval + " min" + (interval > 1 ? 's' : '');
	return "just now";
};

//------------------------------------------------------------

}());