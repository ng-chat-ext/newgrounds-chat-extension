/*
	Emoticons.js
	Author: Jin
	Co-author(s): Mykei

	Adds a panel to the main page where the user can browse (dank memes)
	and select emoticons from a selection that has been created by the
	admins.

	Cross-Browser Incompatibilities:
		chrome: 	e.srcElement
		firefox: 	e.target
*/

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
	chatInputArea,		//	.chat-input-area - contains the text area for user
						//	input as well as the emote-btn for opening the emote
						// 	panel.

	chatInputTextArea,	//	.chat-input-area - The text area where the user
						//	 inputs their content for each post.

	messagesArea,		//	.messages-area - The window where all posts are sent to.

	messagesList,		//	.messages-list - the <ul> where each post is listed.  Nothing
						//	but high quality banter here.

	moreMessagesArea,	//	.more-messages-area - Primary function is to return to the
						//	bottom of .messages-list when this element is clicked.

	diffScroll,			//	TODO - define

	timerScroll,		//	TODO - define


	//	Items are used to catagorize each meme into a seperate div.
	dankList,
	faicList,
	fulpList,
	picoList,
	pixelList,
	animList,

	//	Btns, that when clicked, the panel will scroll to the desired emote catagory.
	dankTab,
	fulpTab,
	faicTab,
	picoTab,
	pixelTab,
	animTab,

	animArr = [],
	dankArr = []
	;

	var isOpen;	//	TODO - Is this still being used?

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

//	Adds emote button next to .chat-input-area.  When clicked, the emote panel is revealed.
function addEmoteBtn() {
	//Btn to call popup menu
	var emoteBtn = document.createElement("div");
	emoteBtn.id = "emote-btn";
	emoteBtn.style.backgroundImage = "url(" + browser.extension.getURL("page/img/smile.svg") + ")";
	emoteBtn.addEventListener('click', emoteBtnClick, false);
	chatInputArea.appendChild(emoteBtn);
};

//	Called when .emote-btn element has been clicked
function emoteBtnClick() {
	var body = document.querySelector('body');
	body.classList.toggle('ngce-emote-open');

	//Autofocus on textarea
	chatInputTextArea.focus();

	//scrollAtEnd = moreMessagesArea.classList.contains('hidden');									//	Searches for hidden field in 
																									//	.more-messages-area.
	diffScroll = messagesList.clientHeight - messagesArea.clientHeight - messagesArea.scrollTop;	//	TODO - Logic seems solid at a glance.
																									//	Find a way to explain in wurdz.
	clearInterval(timerScroll);
	timerScroll = setInterval(updateScroll, 10);
};


//	TODO - Two inits? ¿¡Porque!?
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
//	@@@ Redacted @@@
// function continueInit() {
// 	var ss = getStyleSheet();


// 	var started = false;
// 	var isEmot; // Flag if rule is an emoticon rule.
// 	var r; // Holds current rule in loop.

// 	// Loop through all emoticon rules.
// 	// Note: Changed ss.rules to ss.cssRules cuz i think that what the problemo wuz
// 	for (var i = ss.cssRules.length - 1; i >= 0; i--) {
// 		r = ss.cssRules[i];

// 		// Optimization for skipping all rules after emoticons.
// 		isEmot = r.selectorText && r.selectorText.indexOf('ng-emoticon-') !== -1;
// 		if (!started && !isEmot) continue;
// 		else if (!started && isEmot) started = true;
// 		else if (started && !isEmot) break;
// 		// Skip all ineligible selectors.
// 		if (r.selectorText.indexOf('[') !== -1 || r.style.backgroundSize === 'cover') continue;

// 		createEmote(r.selectorText);
// 	}
// };

function getStyleSheet() {
	for (var i = document.styleSheets.length - 1; i >= 0; i--) {
		if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('build/chat'))
			return document.styleSheets[i];
	}
};

//	@@@ Indacted @@@
function processStyleSheet(ss) {
	var started = false;
	var isEmot; // Flag if rule is an emoticon rule.
	var r; // Holds current rule in loop.

	// Loop through all emoticon rules.
	// Note: Changed ss.rules to ss.cssRules cuz i think that what the problemo wuz
	for (var i = 0; i <= ss.cssRules.length; i++) {
		r = ss.cssRules[i];

		// Optimization for skipping all rules after emoticons.
		isEmot = r.selectorText && r.selectorText.indexOf('ng-emoticon-') !== -1;
		if (!started && !isEmot) continue;
		else if (!started && isEmot) started = true;
		else if (started && !isEmot) break;
		// Skip all ineligible selectors.
		if (r.selectorText.indexOf('[') !== -1 || r.style.backgroundSize === 'cover') continue;



		createEmote(r);																//	Note: Changed r to r.selectorText, not sure if I 
																									//	messed this up, or was some X-Browser issue
	}
};

function createEmote(r){
	//	TODO - Two selectorTexts.  Did I do this?
	var className = r.selectorText.substring(1);
	var name = className.split('-')[2];

	var emote = document.createElement("div");
	emote.setAttribute("title", name);
	emote.addEventListener("click", emoteClick);
	emote.classList.add(className, 'ng-emoticon', 'emote');					//	Use of class list, adds classes
																			//	as if it were an array.  Efficient ^^

	//	TODO - Comment all regex in english for ease.
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
	var name = e.target.getAttribute('title');						//	Name of the emoticon.  Note: Changed e.srcElement
																	//	to e.target cuz fifo.
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
	//	Checks if the event has a property of height, and it's call element is .messages-area.
	//	Note: changed e.srcElement to e.target cuz fiatfux
	if (e.propertyName !== 'height' || e.target !== messagesArea)
		return;
	messagesArea.scrollTop = messagesList.clientHeight - messagesArea.clientHeight - diffScroll;
	clearInterval(timerScroll);
};


//	Updates the scroll position of .messages-area to make room and compensate for.messages-area's 
//	height as it grows at such a rate.
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
	//	See top of page where these vars are initialized for their descriptions.
	chatInputArea = document.querySelector(".chat-input-area");
	chatInputTextArea = document.getElementById("chat-input-textarea");
	messagesArea = document.querySelector(".messages-area");
	messagesList = document.querySelector(".messages-list");
	moreMessagesArea = document.querySelector(".more-messages-area");


	messagesArea.addEventListener('transitionend', messagesAreaTransitionEnd);	//	Listens for when
																				//	.messages-area is done
																				//	making way for emote-popup.
																				//	Note: changed webkitTransitionEnd
																				//	to transitionend cuz fiyahfax.

	addEmoteBtn();																//	crème de le résistance

	//	Grabs template html to store the emoticons, the divs that hold them, and their buttons.
	sendXHR(browser.extension.getURL("page/html/emoticons.html"), function (e) {
		initExternal(e);
		processStyleSheet(getStyleSheet());
		processEmoteArrays();	
	});
}

//------------------------------------------------------------

}());