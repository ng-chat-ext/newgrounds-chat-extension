(function() {

//------------------------------------------------------------
NGCE.Emoticons = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var 
	chatInputArea,
	chatInputTextArea,
	messagesArea,
	messagesList,
	moreMessagesArea,
	diffScroll,
	timerScroll,

	dankList,
	faicList,
	fulpList,
	picoList,
	pixelList,
	animList,

	dankTab,
	fulpTab,
	faicTab,
	picoTab,
	pixelTab,
	animTab,

	animArr = [],
	dankArr = []
	;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function addEmoteBtn() {
	//Btn to call popup menu
	var emoteBtn = document.createElement("div");
	emoteBtn.id = "emote-btn";
	emoteBtn.style.backgroundImage = "url(" + chrome.extension.getURL("page/img/smile.svg") + ")";
	emoteBtn.addEventListener('click', emoteBtnClick, false);
	chatInputArea.appendChild(emoteBtn);
};

function emoteBtnClick() {
	var body = document.querySelector('body');
	body.classList.toggle('ngce-emote-open');

	//Autofocus on textarea
	chatInputTextArea.focus();

	diffScroll = messagesList.clientHeight - messagesArea.clientHeight - messagesArea.scrollTop;
	clearInterval(timerScroll);
	timerScroll = setInterval(updateScroll, 10);
};

function initExternal(e) {
	var menu = new DOMParser().parseFromString(e.target.responseText, 'text/html');
	document.querySelector('.chat-area').appendChild(menu.body.children['emote-popup']);

	var emotePopup = document.getElementById("emote-popup");
	emotePopup.classList.add('emote-container');
	emotePopup.addEventListener('click', function(){ chatInputTextArea.focus(); }, false);

	// Get elements.
	dankList = document.getElementById("dank-list");
	faicList = document.getElementById("faic-list");
	fulpList = document.getElementById("fulp-list");
	picoList = document.getElementById("pico-list");
	pixelList = document.getElementById("pixel-list");
	animList = document.getElementById("anim-list");
	dankTab = document.getElementById("dank-tab");
	fulpTab = document.getElementById("fulp-tab");
	faicTab = document.getElementById("faic-tab");
	picoTab = document.getElementById("pico-tab");
	pixelTab = document.getElementById("pixel-tab");
	animTab = document.getElementById("anim-tab");

	// Assign events
	dankTab.addEventListener('click',function(){ scrollTo(dankList); });
	fulpTab.addEventListener('click', function(){ scrollTo(fulpList); });
	faicTab.addEventListener('click', function(){ scrollTo(faicList); });
	picoTab.addEventListener('click', function(){ scrollTo(picoList); });
	pixelTab.addEventListener('click', function(){ scrollTo(pixelList); });
	animTab.addEventListener('click', function(){ scrollTo(animList); });
};

function getStyleSheet() {
	for (var i = document.styleSheets.length - 1; i >= 0; i--) {
		if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('build/chat'))
			return document.styleSheets[i];
	}
};

function processStyleSheet(ss) {
	var started = false;
	var isEmot; // Flag if rule is an emoticon rule.
	var r; // Holds current rule in loop.

	// Loop through all emoticon rules.
	for (var i = 0; i <= ss.rules.length; i++) {
		r = ss.rules[i];

		// Optimization for skipping all rules after emoticons.
		isEmot = r.selectorText && r.selectorText.indexOf('ng-emoticon-') !== -1;
		if (!started && !isEmot) continue;
		else if (!started && isEmot) started = true;
		else if (started && !isEmot) break;
		// Skip all ineligible selectors.
		if (r.selectorText.indexOf('[') !== -1 || r.style.backgroundSize === 'cover') continue;

		createEmote(r);
	}
};

function createEmote(r){
	var className = r.selectorText.substring(1);
	var name = className.split('-')[2];

	var emote = document.createElement("div");
	emote.setAttribute("title", name);
	emote.addEventListener("click", emoteClick);
	emote.classList.add(className, 'ng-emoticon', 'emote');

	switch(/([a-z]+)([A-z0-9]+)/g.exec(name)[1]){
		case "ng":
			if (r.style.background !== '') {
				emote.classList.add('big-emote');
				dankArr.push({ 'name': name, 'elem': emote });
			} else {
				faicList.appendChild(emote);
				emote.classList.add('small-emote');
			}
			break;
		case "tf":
			fulpList.appendChild(emote);
			emote.classList.add('small-emote');
			break;
		case "ngp":
		case "ngd":
		case "ngn":
			picoList.appendChild(emote);
			emote.classList.add('small-emote');
			break;
		case "ngs":
			pixelList.appendChild(emote);
			emote.classList.add('small-emote');
			break;
		case "nga":
			emote.classList.add('big-emote');
			animArr.push({ 'name': name, 'elem': emote });
			// animList.appendChild(emote);
			break;
		default:
			dankList.appendChild(emote);
			emote.classList.add('small-emote');
	}
};

function processEmoteArrays() {
	animArr.sort(sortByProperty('name'));
	dankArr.sort(sortByProperty('name'));

	for (var i = 0; i < animArr.length; i++) {
		animList.appendChild(animArr[i].elem);
	}

	for (var i = 0; i < dankArr.length; i++) {
		dankList.appendChild(dankArr[i].elem);
	}
};

function emoteClick(e) {
	var name = e.srcElement.getAttribute('title');
	var v = chatInputTextArea.value;
	var p = chatInputTextArea.selectionStart;
	var end = p;
	var val = '';

	// Add space padding to the front and back of the inserted text if there isn't any.
	// I believe this might improve user experience because emoticons are sent as text.
	if (p !== 0 && v[p-1] !== ' ') { val += ' '; end++; }
	val += name;
	if (v[p] !== ' ') 	{ val += ' '; end++; }

	// Insert text at caret position.
	chatInputTextArea.value = v.substr(0, p) + val + v.substr(p);

	// Move caret back to where it should be.
	chatInputTextArea.selectionStart = end + name.length;
	chatInputTextArea.selectionEnd = end + name.length;
};

//------------------------------------------------------------

function messagesAreaTransitionEnd(e) {
	if (e.propertyName !== 'height' || e.srcElement !== messagesArea)
		return;
	messagesArea.scrollTop = messagesList.clientHeight - messagesArea.clientHeight - diffScroll;
	clearInterval(timerScroll);
};

function updateScroll() {
	messagesArea.scrollTop = messagesList.clientHeight - messagesArea.clientHeight - diffScroll;
};

function scrollTo(node){
	var list = document.getElementById("emote-list");
	list.scrollTop = node.offsetTop - list.offsetTop;
};

function sortByProperty(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function sendXHR(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = callback;
	xhr.open('GET', url, true);
	xhr.send(null);
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	chatInputArea = document.querySelector(".chat-input-area");
	chatInputTextArea = document.getElementById("chat-input-textarea");
	messagesArea = document.querySelector(".messages-area");
	messagesList = document.querySelector(".messages-list");
	moreMessagesArea = document.querySelector(".more-messages-area");


	messagesArea.addEventListener('webkitTransitionEnd', messagesAreaTransitionEnd);

	addEmoteBtn();

	sendXHR(chrome.extension.getURL("page/html/template.html"), function (e) {
		initExternal(e);
		processStyleSheet(getStyleSheet());
		processEmoteArrays();
	});
}

//------------------------------------------------------------

}());