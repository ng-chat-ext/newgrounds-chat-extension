(function() {

//------------------------------------------------------------
NGCE.Block = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var txtUsername;
var btnBlockUser;
var olNameList;

var csBL;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function blockUser(username) {
	var tmp = username.trim();

	if (!tmp) {
		showStatus('Please enter a username.');
		return;
	}

	if (csBL.Data.indexOf(tmp) !== -1) {
		showStatus('User already blocked.');
		return;
	}

	// Add name to list.
	csBL.Data.push(tmp);

	// Save list.
	csBL.save(saveCallback);
	function saveCallback() {
		showStatus('User blocked: ' + tmp);
		addListItem(tmp, tmp);
	}
};

function unblockUser(username) {
	// Remove name from list.
	var index = csBL.Data.indexOf(username);
	if (index !== -1)
		csBL.Data.splice(index, 1);

	// Save list.
	csBL.save(saveCallback);
	function saveCallback() {
		showStatus('User unblocked: ' + username);
		removeListItem(username, username);
	}
};



function addListItem(value, text) {
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(text));
	li.setAttribute("name", value);
	li.addEventListener('click', function() { unblockUser(value); });
	olNameList.appendChild(li);
};

function removeListItem(value) {
	var li = document.querySelector('li[name="' + value + '"]');
	olNameList.removeChild(li);
};

function showStatus(statusText) {
	
	document.getElementById('txtBlockStatus').textContent = statusText;
};

//------------------------------------------------------------

function btnBlockUserClick() {
	blockUser(txtUsername.value);
	txtUsername.value = '';
};

function txtUsernameKeyDown(e) {
	if (e.keyCode == 13)
		btnBlockUser.dispatchEvent(new MouseEvent('click'));
};

//------------------------------------------------------------

function refreshBlockList() {
	csBL.Data.forEach(function(value) {
		addListItem(value, value);
	});
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init(chromeSyncBlockList) {
	csBL = chromeSyncBlockList;

	txtUsername = document.getElementById('txtUsername');
	btnBlockUser = document.getElementById('btnBlockUser');
	olNameList = document.getElementById('olNameList');

	txtUsername.addEventListener('keydown', txtUsernameKeyDown);
	btnBlockUser.addEventListener('click', btnBlockUserClick);

	NGCE.ChromeSync.BlockList.load(refreshBlockList);
};

//------------------------------------------------------------

}());