/*
	Mentions.js

	Author: Jin
	Co-author(s): MykeiXWolfe

	The mentions script lets you know how popular your are, by saving all the
	instances you were mentioned.
*/

(function() {

//------------------------------------------------------------
NGCE.Mentions = {
	init: init,
	updateSpaceInUse: updateSpaceInUse
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var tblMentions;
var ddlMentions;
var btnMentionsGo;
var lblMentionsMessage;

var o = NGCE.ChromeSync.Mentions;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function refreshTable() {
	var obj = o.Data.mentions;

	while (tblMentions.firstChild) {
		tblMentions.removeChild(tblMentions.firstChild);
	}

	for (var i = obj.length - 1; i >= 0; i--) {
		tblMentions.appendChild(createEntry(obj[i]));
	}
};

function createEntry(data) {

	// Container
	var ctn = document.createElement('div');
	ctn.classList.add('mention');
	ctn.setAttribute('data-id', data.id);
	// First row
	var row1 = document.createElement('div');
	ctn.appendChild(row1);
	// Floated right elements
	var right = document.createElement('div');
	right.classList.add('right');
	row1.appendChild(right);

	if (data.type === 1) {
		// Normal message
		ctn.classList.add('normal');

		row1.classList.add('row1');

		var username = document.createElement('span');
		if (!!data.userType)
			username.classList.add('username', data.userType);
		username.innerText = data.username;
		row1.appendChild(username);

		var time = document.createElement('span');
		time.classList.add('time');
		time.innerText = data.time;
		row1.appendChild(time);

		var text = document.createElement('div');
		text.innerText = data.text;
		ctn.appendChild(text);

	} else if (data.type === 2) {
		// "Me" message
		ctn.classList.add('me');

		var text = document.createElement('div');
		text.classList.add('text');
		text.innerText = data.text;
		ctn.appendChild(text);

	}

	// Channel, and action buttons.
	var channel = document.createElement('div');
	channel.classList.add('channel');
	channel.setAttribute('uncopyable', data.channel);
	right.appendChild(channel);

	var btnRead = document.createElement('div');
	btnRead.classList.add('btn-read', (data.read === true) ? 'read' : 'unread');
	btnRead.setAttribute('data-id', data.id);
	btnRead.addEventListener('click', toggleRead);
	right.appendChild(btnRead);

	var btnDel = document.createElement('div');
	btnDel.classList.add('btn-del');
	btnDel.setAttribute('data-id', data.id);
	btnDel.addEventListener('click', deleteMention);
	right.appendChild(btnDel);


	return ctn;
};

function toggleRead(e) {
	o.load(function() {
		var elem = e.target;
		var id = elem.getAttribute('data-id');
		var index = findIndexById(o.Data.mentions, id);

		var obj = o.Data.mentions[index];
		obj.read = !obj.read;
		elem.classList.toggle('read', obj.read);
		elem.classList.toggle('unread', !obj.read);

		if (obj.read === true)
			o.Data.unread--;
		else
			o.Data.unread++;

		o.save();
	});
};

function setAllReadStatus(readStatus) {
	o.load(function() {
		// Update view.
		var elems = tblMentions.querySelectorAll('.btn-read');
		for (var i = elems.length - 1; i >= 0; i--) {
			elems[i].classList.toggle('read', readStatus);
			elems[i].classList.toggle('unread', !readStatus);
		}

		// Update data.
		o.Data.unread = readStatus ? 0 : o.Data.mentions.length;
		for (var i = o.Data.mentions.length - 1; i >= 0; i--) {
			o.Data.mentions[i].read = readStatus;
		}
		o.save();
	});
};

function deleteMention(e) {
	o.load(function() {
		var elem = e.target;
		var id = elem.getAttribute('data-id');
		var index = findIndexById(o.Data.mentions, id);

		var mentionNode = getFirstAncestorByClass(elem, 'mention');
		mentionNode.parentNode.removeChild(mentionNode);

		if (o.Data.mentions[index].read === false)
			o.Data.unread--;

		o.Data.mentions.splice(index, 1);
		o.save();
	});
};

function deleteAll() {
	o.load(function() {
		// Update view.
		while (tblMentions.firstChild) {
			tblMentions.removeChild(tblMentions.firstChild);
		}

		// Update data.
		o.Data.unread = 0;
		o.Data.mentions = [];
		o.save();
	});
};

/*
	Event fired function - Whenever an item from ddlMentions is selected
	all of the listed mentions will either have their readStatus toggled
	or be deleted.  Cuz no one got time for all that gobbledy gook.
*/
function btnMentionsGoClick(e) {
	switch (ddlMentions.value) {
		case '1':
			setAllReadStatus(true);
			break;
		case '2':
			setAllReadStatus(false);
			break;
		case '3':
			deleteAll();
			break;
	}

	ddlMentions.selectedIndex = 0;
};

//------------------------------------------------------------

function findIndexById(arr, id) {
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i].id == id)
			return i;
	}
};

function getFirstAncestorByClass(elem, className) {
	while (elem.parentElement) {
		if (elem.parentElement.classList.contains(className))
			return elem.parentElement;
		else
			elem = elem.parentElement;
	}
	return null;
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	tblMentions = document.getElementById('tblMentions');
	ddlMentions = document.getElementById('ddlMentions');
	btnMentionsGo = document.getElementById('btnMentionsGo');
	lblMentionsMessage = document.getElementById('lblMentionsMessage');

	btnMentionsGo.addEventListener('click', btnMentionsGoClick);
	o.load(refreshTable);
	o.getBytesInUse(updateSpaceInUse);
};

function updateSpaceInUse(bytesInUse) {
	if (o.Data.mentions.length === 0) {
		lblMentionsMessage.classList.remove('red', 'yellow', 'gray');
		lblMentionsMessage.innerText = 'Your inbox is empty /)0o0(\\';
		return;
	}

	var percentUsed = Math.ceil(bytesInUse / 8192 * 100);	// TODO - Firefox says it's maximum
															//		capacity is 1MB, but I need to
															//		double check this.
	lblMentionsMessage.innerText = 'Storage: ' + percentUsed + '%';

	lblMentionsMessage.classList.toggle('red', (percentUsed >= 90));
	lblMentionsMessage.classList.toggle('yellow', (percentUsed >= 75));
	lblMentionsMessage.classList.toggle('gray', (percentUsed < 75));
};

//------------------------------------------------------------

}());