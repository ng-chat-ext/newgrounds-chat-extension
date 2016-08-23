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
var dankTab;
var fulpTab;
var faicTab;
var picoTab;
var pixelTab;

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

	
	
	// Add events.
	btnBlockUser.addEventListener('click', btnBlockUserClick);
	chkSetLastSeen.addEventListener('change', chkSetLastSeenChange);
	btnFontClear.addEventListener('click', btnFontClearClick);
	btnFontSet.addEventListener('click', btnFontSetClick);

	setupEmotes();

	// Initialize.
	init();
};

//------------------------------------------------------------
//------------------------------------------------------------



//------------------------------------------------------------
//------------------------------------------------------------

function init() {
	getSettings();
	getBlockList();
	getStyleSheet();
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

function btnEmoteOnClick(name){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {name: name+" "});
	});
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

function getStyleSheet(){
	chrome.storage.sync.get('css-url', function(result){
		getExternalCss("https://chat.newgrounds.com" + result['css-url']);
	});
};

//------------------------------------------------------------

//------------------------------------------------------------
// Emoticons
//------------------------------------------------------------

function getExternalCss(url){
	$.ajax({
		url: url,
		success: function(result){
			parseCSS(result);
		},
		error: function(xhr){
			console.log('This is obviously Bren\'s fault.');
		}
	});
}

function setupEmotes(){

	// Assign elements
	btnEmoMenu = document.querySelectorAll('[name="emoticon-menu"]')[0];
	btnEmoBack = document.getElementById('back-btn');
	menuContainer = document.getElementById("slider");
	dankList = document.getElementById("dank-list");
	faicList = document.getElementById("faic-list");
	fulpList = document.getElementById("fulp-list");
	picoList = document.getElementById("pico-list");
	pixelList = document.getElementById("pixel-list");
	dankTab = document.getElementById("dank-tab");
	fulpTab = document.getElementById("fulp-tab");
	faicTab = document.getElementById("faic-tab");
	picoTab = document.getElementById("pico-tab");
	pixelTab = document.getElementById("pixel-tab");



	// Assign events
	btnEmoMenu.addEventListener('click', function(){
		menuContainer.style.visibility = "visible";
		$(menuContainer).hide().slideDown();
	});

	btnEmoBack.addEventListener('click', function(){ $(menuContainer).slideUp(); });

	dankTab.addEventListener('click',function(){ scrollTo(dankList); });

	fulpTab.addEventListener('click', function(){ scrollTo(fulpList); });

	faicTab.addEventListener('click', function(){ scrollTo(faicList); });

	picoTab.addEventListener('click', function(){ scrollTo(picoList); });

	pixelTab.addEventListener('click', function(){ scrollTo(pixelList); });
}

function parseCSS(styleSheet){
	// Finds all emoticon related class selectors
	var classSelectorRegEx = /\.ng-emoticon-([a-z]+)([A-Za-z0-9]+)[{\s]*([^b]*([^:]+)[^}]+)/g;
	var classSelector;

	// Finds the "original Faic's" sprite sheet
	var ngSpriteCSSRegEx = /\.ng-emoticon[^-{]*{([^}]+)/g;
	var ngSpriteCSS = ngSpriteCSSRegEx.exec(styleSheet);
	console.log(ngSpriteCSS[0]);

	// Finds emoticon class selectors that contain the sprite url
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
			console.error("Err: Unexpected background modifier");
		}
	}
}

// Returns the matching prefix array which also contains the sprite url,
// else returns null.
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
	
	// Gets the emote image
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

}

function createEmote(background, name, spritePosition){
	var emote = document.createElement("div");

	emote.className = "emote";
	emote.style.background = background;

	if(spritePosition != null){
		emote.style['background-position'] = spritePosition;
		emote.className += " small-emote";
	} else {
		emote.className += " big-emote";
	}

	emote.setAttribute("title", name);

	emote.addEventListener("click", function(){
		btnEmoteOnClick(name);
	});

	switch(/([a-z]+)([A-z0-9]+)/g.exec(name)[1]){
		case "ng":
			if(spritePosition == null){
				emote.className += " dank-emoji";
				dankList.appendChild(emote);
			}else{
				emote.className += " faic-emoji";
				faicList.appendChild(emote);
			}
			break;

		case "tf":
			emote.className += " fulp-emoji";
			fulpList.appendChild(emote);
		break;

		case "ngp":
		case "ngd":
		case "ngn":
			emote.className += " pico-emoji";
			picoList.appendChild(emote);
			break;
		case "ngs":
			emote.className += " pixel-emoji";
			pixelList.appendChild(emote);
			break;

		case "nga":
			// soon....
			break;

		default:
			emote.className = "dank-emoji";
			document.getElementById("dank-list").appendChild(emote);
	}
}

function scrollTo(node){
	document.getElementById("emote-container").scrollTop = node.offsetTop-40;

	//$("#emote-container").animate({
	//	"scrollTop": $(node).position().top
	//},500);
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