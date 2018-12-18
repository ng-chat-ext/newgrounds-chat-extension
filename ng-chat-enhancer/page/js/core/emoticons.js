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
	// diffScroll,
	// timerScroll,

	tabs,
	lists,

	dankList,
	faicList,
	fulpList,
	picoList,
	pixelList,
	animList,
	kaoList,

	animArr = [],
	dankArr = []
	;
	var menuCurr;
	var isOpen;

var kaomojis = [
	{ text: '（＾－＾）', title: 'happy' },
	{ text: '( ˘ ³˘) ❤', title: 'kissing' },
	{ text: '.･ﾟﾟ･(>д<)･ﾟﾟ･.', title: 'cry' },
	{ text: '(ᗒᗣᗕ)՞', title: 'cry 2' },
	{ text: '(ಥ_ಥ)', title: 'cry 3' },
	{ text: '(´・ω・｀)', title: 'denko' },
	{ text: '(◕ᴗ◕✿)', title: 'flower girl' },
	{ text: '( ͡° ͜ʖ ͡°)', title: 'le lenny' },
	{ text: '(⌐■_■)', title: 'hell yeah' },
	{ text: '(ಠ_ಠ)', title: 'disapproval' },
	{ text: '╮(￣～￣)╭', title: 'indifference' },
	{ text: '¯\\ˍ(ツ)ˍ/¯', title: 'shrug' },
	{ text: 'ᕕ( ᐛ )ᕗ', title: 'strolling happy gary' },
	{ text: '(╯°□°）╯︵ ┻━┻', title: 'table flip' },
	{ text: '┬──┬ ノ( ゜-゜ノ)', title: 'table set' },
	{ text: '( ´-ω･)︻┻┳══━一', title: 'camper' },
	{ text: '(っ´ω`)ﾉ(╥ω╥)', title: 'sympathy' },
	{ text: '(ｏ・_・)ノ”(ノ_<、)', title: 'sympathy 2' },
	{ text: '(╬ ⇀‸↼)', title: 'impatient' },
];

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
}

function emoteBtnClick() {
	var body = document.querySelector('body');
	body.classList.toggle('ngce-emote-open');

	//Autofocus on textarea
	chatInputTextArea.focus();

	// diffScroll = messagesList.clientHeight - messagesArea.clientHeight - messagesArea.scrollTop;
	// clearInterval(timerScroll);
	// timerScroll = setInterval(updateScroll, 10);
}

function initExternal(e) {
	var menu = new DOMParser().parseFromString(e.target.responseText, 'text/html');
	document.querySelector('.chat-input-row').appendChild(menu.body.children['emote-popup']);

	// Return focus to textbox when container is clicked.
	var emotePopup = document.getElementById("emote-popup");
	emotePopup.addEventListener('click', function(){ chatInputTextArea.focus(); }, false);

	// Setup tabs and lists.
	tabs = document.querySelectorAll("#tab-list > .tab");
	lists = document.querySelectorAll("#emote-list > .list");
	for (var i = 0; i < tabs.length; i++) {
		(function(i) { tabs[i].addEventListener('click', function() { switchList(i) }); }(i));
	}
	switchList(0);

	// Get elements.
	dankList = document.getElementById("dank-list");
	faicList = document.getElementById("faic-list");
	fulpList = document.getElementById("fulp-list");
	picoList = document.getElementById("pico-list");
	pixelList = document.getElementById("pixel-list");
	animList = document.getElementById("anim-list");
	kaoList = document.getElementById("kao-list");
}

function switchList(index) {
	if (typeof (menuCurr) !== 'undefined')
		document.querySelector('#emote-list > .list.show').classList.remove('show');

	menuCurr = index;
	document.querySelectorAll('#emote-list > .list')[menuCurr].classList.add('show');
}

//------------------------------------------------------------

function getStyleSheet() {
	for (var i = document.styleSheets.length - 1; i >= 0; i--) {
		if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('build/chat') != -1)
			return document.styleSheets[i];
	}
}

function processStyleSheet(ss) {
	var started = false;
	var isEmot; // Flag if rule is an emoticon rule.
	var r; // Holds current rule in loop.

	// Loop through all emoticon rules.
	for (var i = 0; i <= ss.rules.length; i++) {
		r = ss.rules[i];
		if (!r) continue;

		// Optimization for skipping all rules after emoticons.
		isEmot = r.selectorText && r.selectorText.indexOf('ng-emoticon-') !== -1;
		if (!started && !isEmot) continue;
		else if (!started && isEmot) started = true;
		else if (started && !isEmot) break;
		// Skip all ineligible selectors.
		if (r.selectorText.indexOf('[') !== -1 || r.style.backgroundSize === 'cover') continue;
		// Skip gif animations (so only frames are caught).
		if (r.selectorText.indexOf('ng-emoticon-nga') !== -1 && r.selectorText.indexOf('frame') === -1) continue;

		createEmote(r);
	}
}

function createEmote(r){
	var className = r.selectorText.substring(1);
	var name = className.split('-')[2];

	var emote = document.createElement("div");
	emote.setAttribute("title", name);
	emote.addEventListener("click", emoteClick);
	emote.classList.add(className, 'ng-emoticon', 'emote');

	switch(/([a-z]+)([A-z0-9]+)/g.exec(name)[1]){
		case "ngc":
			emote.classList.add('big-emote');
			dankArr.push({ 'name': name, 'elem': emote });
			break;
		case "tf":
			fulpList.appendChild(emote);
			emote.classList.add('small-emote');
			break;
		case "ngb":
			faicList.appendChild(emote);
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
			if (name === 'frame' || name === 'dropdown') break;
			dankList.appendChild(emote);
			emote.classList.add('small-emote');
	}
}

function createKaomoji(text, title) {
	var emote = document.createElement("span");
	emote.setAttribute("title", title);
	emote.addEventListener("click", kaoClick);
	emote.innerText = text;
	kaoList.appendChild(emote);
}

function sortAndAddElems() {
	animArr.sort(sortByProperty('name'));
	dankArr.sort(sortByProperty('name'));

	for (var i = 0; i < animArr.length; i++) {
		animList.appendChild(animArr[i].elem);
	}

	for (var i = 0; i < dankArr.length; i++) {
		dankList.appendChild(dankArr[i].elem);
	}
}

function emoteClick(e) {
	NGCE.Helper.Text.insert(e.srcElement.getAttribute('title'), chatInputTextArea);
}

function kaoClick(e) {
	NGCE.Helper.Text.insert(e.srcElement.innerText, chatInputTextArea);
}

//------------------------------------------------------------

function messagesAreaTransitionEnd(e) {
	if (e.propertyName !== 'height' || e.srcElement !== messagesArea)
		return;
	messagesArea.scrollTop = messagesList.clientHeight - messagesArea.clientHeight - diffScroll;
	clearInterval(timerScroll);
}

// function updateScroll() {
// 	messagesArea.scrollTop = messagesList.clientHeight - messagesArea.clientHeight - diffScroll;
// }

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
}

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

	sendXHR(chrome.extension.getURL("page/html/emoticons.html"), function (e) {
		initExternal(e);
		processStyleSheet(getStyleSheet());
		sortAndAddElems();

		for (var i = 0; i < kaomojis.length; i++) {
			createKaomoji(kaomojis[i].text, kaomojis[i].title);
		}
	});
}

//------------------------------------------------------------

}());