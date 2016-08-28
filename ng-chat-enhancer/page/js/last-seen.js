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
	var nodes = document.querySelectorAll('ul.user-list > li[style*="display: inline-block;"]');
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
};

function update(messageNode) {
	var usernameNode = messageNode.querySelector('.msg-username');
	if (!usernameNode)
		return;

	var lst = NGCE.LastSeen.Times;
	var username = usernameNode.innerText;
	var found = false;

	// Update last seen time.
	for (var i = lst.length - 1; i >= 0; i--) {
		if (lst[i].username === username) {
			lst[i].date = new Date();
			found = true;
			break;
		}
	}

	// Insert new if user not found.
	if (!found)
		lst.push({ username: username, date: new Date() });
};

function showAll(show) {
	var cl = document.querySelector('ul.user-list').classList;
	show ? cl.add('show-status') : cl.remove('show-status')
};

function getDateByUsername(username) {
	var lst = NGCE.LastSeen.Times;

	for (var j = lst.length - 1; j >= 0; j--) {
		if (lst[j].username === username)
			return lst.date;
	}

	return null;
};

function getText(dateNow, date) {
	if (date === null)
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