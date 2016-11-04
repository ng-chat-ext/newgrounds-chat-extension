(function() {

//------------------------------------------------------------
NGCE.Mentions = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var tblMentions;

var o = NGCE.ChromeSync.Mentions;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function refreshTable() {
	var obj = JSON.parse(LZString.decompressFromUTF16(o.Data.mentions)).map(JSON.parse);

	for (var i = obj.length - 1; i >= 0; i--) {
		tblMentions.appendChild(createEntry(obj[i]));
	}
}

function createEntry(data) {
	// Container
	var ctn = document.createElement('div');

	if (data.type === 1) {
		// Normal message
		ctn.classList.add('normal');

		var row1 = document.createElement('div');
		row1.classList.add('row1');
		ctn.appendChild(row1);

		var channel = document.createElement('div');
		channel.classList.add('channel');
		channel.innerText = data.channel;
		row1.appendChild(channel);

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

		var row1 = document.createElement('div');
		ctn.appendChild(row1);

		var channel = document.createElement('div');
		channel.classList.add('channel');
		channel.setAttribute('uncopyable', data.channel);
		row1.appendChild(channel);

		var text = document.createElement('div');
		text.classList.add('text');
		text.innerText = data.text;
		ctn.appendChild(text);

	}

	return ctn;
}

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	tblMentions = document.getElementById('tblMentions');

	o.load(refreshTable);
};

//------------------------------------------------------------

}());