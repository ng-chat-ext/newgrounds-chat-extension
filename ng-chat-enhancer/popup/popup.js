//------------------------------------------------------------
// Variables
//------------------------------------------------------------

// Block List
var txtUsername;
var btnBlockUser;
var olNameList;
// Last Seen
var chkSetLastSeen;
// Font
var txtCustomFont;
var lblFontCurrent;
var btnFontClear;
var btnFontSet;
// Emoticon
var btnEmoMenu;
var btnEmoBack;
var menuContainer;
var emoteList;
var dankList;
var faicList;
var fulpList;
var picoList;
var pixelList;

// Data
var blockList = [];
var settings = {};
var mentions = [];

//------------------------------------------------------------

document.addEventListener('DOMContentLoaded', DOMLoaded);

function DOMLoaded() {
	// Get elements.
	txtUsername = document.getElementById('txtUsername');
	btnBlockUser = document.getElementById('btnBlockUser');
	olNameList = document.getElementById('olNameList');
	chkSetLastSeen = document.getElementById('chkSetLastSeen');
	txtCustomFont = document.getElementById('txtCustomFont');
	lblFontCurrent = document.getElementById('lblFontCurrent');
	btnFontClear = document.getElementById('btnFontClear');
	btnFontSet = document.getElementById('btnFontSet');

	btnEmoMenu = document.querySelectorAll('[name="emoticon-menu"]')[0];
	btnEmoBack = document.getElementById('back-btn');
	menuContainer = document.getElementById("slider");
	dankList = document.getElementById("dank-list");
	faicList = document.getElementById("faic-list");
	fulpList = document.getElementById("fulp-list");
	picoList = document.getElementById("pico-list");
	pixelList = document.getElementById("pixel-list");
	
	// Add events.
	btnBlockUser.addEventListener('click', btnBlockUserClick);
	chkSetLastSeen.addEventListener('change', chkSetLastSeenChange);
	btnFontClear.addEventListener('click', btnFontClearClick);
	btnFontSet.addEventListener('click', btnFontSetClick);

	btnEmoMenu.addEventListener('click', showEmoticonMenu);
	btnEmoBack.addEventListener('click', hideEmoticonMenu);

	//

	//


	// Initialize.
	init();
};

//------------------------------------------------------------
//------------------------------------------------------------



//------------------------------------------------------------
//------------------------------------------------------------

function init() {
	getUrl();
	// test();
	getSettings();
	getBlockList();
};

//------------------------------------------------------------
// Event Handlers
//------------------------------------------------------------

function btnBlockUserClick() {
	blockUser(txtUsername.value);
	txtUsername.value = '';
};

function chkSetLastSeenChange() {
	settings.lastSeen = chkSetLastSeen.checked;
	saveSettings();
};

function btnFontClearClick() {
	settings.customFont = '';
	lblFontCurrent.innerText = 'Default';
	saveSettings();
};

function btnFontSetClick() {
	var val = txtCustomFont.value.trim();
	if (!val)
		return;

	settings.customFont = val;
	lblFontCurrent.innerText = val;
	txtCustomFont.value = '';
	saveSettings();
};

//------------------------------------------------------------
// Block List
//------------------------------------------------------------

function blockUser(username) {
	var tmp = username.trim();

	if (!tmp) {
		showStatus('Please enter a username.');
		return;
	}

	if (blockList.indexOf(tmp) !== -1) {
		showStatus('User already blocked.');
		return;
	}

	// Add name to list.
	blockList.push(tmp);

	// Save list.
	saveBlockList(function() {
		showStatus('User blocked: ' + tmp);
		addListItem(tmp, tmp);
	});
};

function unblockUser(username) {
	// Remove name from list.
	var index = blockList.indexOf(username);
	if (index !== -1)
		blockList.splice(index, 1);


	saveBlockList(function() {
		showStatus('User unblocked: ' + username);
		removeListItem(username, username);
	});
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
	
	document.getElementById('status').textContent = statusText;
};

//------------------------------------------------------------
// Chrome Sync
//------------------------------------------------------------

function getSettings() {
	chrome.storage.sync.get('settings', function(result) {
		// Store in variable.
		settings = result.settings || {};

		// Update UI.
		chkSetLastSeen.checked = settings.lastSeen;
		lblFontCurrent.innerText = settings.customFont || 'Default';
	});
};

function saveSettings() {

	chrome.storage.sync.set({ 'settings': settings });
};


function getBlockList() {
	chrome.storage.sync.get('blockList', function(result) {
		// Store in variable.
		blockList = result.blockList || [];

		// Update UI.
		blockList.forEach(function(value) {
			addListItem(value, value);
		});
	});
};

function saveBlockList(callback) {

	chrome.storage.sync.set({ 'blockList': blockList }, callback);
};

//------------------------------------------------------------

//------------------------------------------------------------
// Emoticons
//------------------------------------------------------------

function setupEmoticonList(){
	$(emotiMenu).hide();
}

function showEmoticonMenu(){
	// TODO - Makes menuContainer visible everytime which is a bit sloppy, 
	// will fix later
	menuContainer.style.visibility = "visible";
	$(menuContainer).hide().slideDown();
}

function hideEmoticonMenu(){
	$(menuContainer).slideUp();
}

function createEmote(background, name, spritePosition){
	

	var dank = document.createElement("div");

	dank.className = "emote";

	// dank.style.display = "inline-block";
	dank.style.background = background;

	if(spritePosition != null){
		dank.style['background-position'] = spritePosition;
		dank.className += " small-emote";
	} else {
		dank.className += " big-emote"
	}

	dank.addEventListener("click", function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {greeting: name+" "}, function(response) {
		    console.log(response.farewell);
		  });
		});
	});

	dank.setAttribute("data", name);
	dank.setAttribute("title", name);

	console.log(name);

	switch(/([a-z]+)([A-z0-9]+)/g.exec(name)[1]){
		case "ng":
			if(spritePosition == null){
				dank.className += " dank-emoji";
				dankList.appendChild(dank);
			}else{
				dank.className += " faic-emoji";
				faicList.appendChild(dank);
			}
			break;

		case "tf":
			dank.className += " fulp-emoji";
			fulpList.appendChild(dank);
		break;

		case "ngp":
		case "ngd":
		case "ngn":
			dank.className += " pico-emoji";
			picoList.appendChild(dank);
			break;
		case "ngs":
			dank.className += " pixel-emoji";
			pixelList.appendChild(dank);
			break;

		case "nga":
			// soon....
			break;

		default:
			dank.className = "dank-emoji";
			document.getElementById("dank-list").appendChild(dank);
	}
}

function sortEmotes(name){

}

function getUrl(){
	chrome.storage.sync.get('css-url', function(result){
		getExternalCss("https://chat.newgrounds.com" + result['css-url']);
	});
}

function getExternalCss(url){
	$.ajax({
		url: url,
		success: function(result){
			parseCSS(result);
		},
		error: function(xhr){
			console.log('Uh oh, Bren did something.');
		}
	});
}

function parseCSS(styleSheet){
	var classSelectorRegEx = /\.ng-emoticon-([a-z]+)([A-Za-z0-9]+)[{\s]*([^b]*([^:]+)[^}]+)/g;
	var classSelector;

	var ngSpriteCSSRegEx = /\.ng-emoticon[^-{]*{([^}]+)/g;
	var ngSpriteCSS = ngSpriteCSSRegEx.exec(styleSheet);
	console.log(ngSpriteCSS[0]);

	var attributeSelectorRegEx = /\[class\^=ng-emoticon-([^\]]+)]([^\{]+|{)([^\}]+)/g;
	var attributeSelector;
	var attributes = new Array();

	while((attributeSelector = attributeSelectorRegEx.exec(styleSheet)) != null){
		attributes.push(attributeSelector);
	}
	
	while((classSelector = classSelectorRegEx.exec(styleSheet)) != null){
		if(classSelector[4] === "background"){
			addEmote(classSelector, null);
		} else if(classSelector[4] === "background-position"){
			addEmote(classSelector, findSprite(attributes, classSelector[1]) || ngSpriteCSS);
		} else {
			console.error("Err: emoticon anomoly detected.");
		}
	}
}

function findSprite(prefixList, prefix){
	for(var i = 0; i < prefixList.length; i++){
		if(prefixList[i][1] === prefix){
			return prefixList[i];
		}
	}
	return null;
}

function addEmote(regEx, sprite){
	// Name of the emoticon
	var nameRegEx = /-((ng|tf)[^{]+){/g;
	var name;

	// if((name = nameRegEx.exec(regEx.toString())) !== null)	console.log(name[1]);
	// else 	return;
	

	// Background CSS of the emoticon
	var bgRegEx = /background:.*(url\(([^)]+)\)[^;]+)/g;
	var bg;

	if(sprite != null){
		var bp = regEx[3].substring(regEx[3].indexOf(":")+1, regEx[3].length);
		if((bg = bgRegEx.exec(sprite[0])) !== null){
			createEmote(cachedUrl(bg[1]), regEx[1]+regEx[2], bp);
		}
	}else if((bg = bgRegEx.exec(regEx[3])) !== null){

		
		createEmote(cachedUrl(bg[1]), regEx[1]+regEx[2], null);
	}

	var bgRegEx = /background:.*(url\(([^)]+)\)[^;]+)/g;
	var bg;

}


// ------------------------------------------------------------
//	Utilities
// ------------------------------------------------------------

// Injects a substring into a string
function splice(index, str, subStr){
	return str.slice(0, index) + subStr + str.slice(index);
}

// If the image is not cached, use the given url, else, use cached url.
function cachedUrl(url){
	if(url.indexOf("/build") !== -1)	
		return splice(url.indexOf('/'), url, "https://chat.newgrounds.com");
	else
		return url;
}

