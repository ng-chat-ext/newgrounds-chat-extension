(function() {

var 
	chatInputArea,
	chat_input,
	dParser,
	dankList,
	faicList,
	fulpList,
	picoList,
	pixelList,
	dankTab,
	fulpTab,
	faicTab,
	picoTab,
	pixelTab
	;

//------------------------------------------------------------
NGCE.Emoticons = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function addEmoteBtn(){
	//Btn to call popup menu
	var emoteBtn = document.createElement("div");
	emoteBtn.id = "emote-btn";
	chatInputArea.appendChild(emoteBtn);

	//Neet lil' arrow
	var arrow = document.createElement("div");
	arrow.id = "arrow";
	emoteBtn.appendChild(arrow);

	//Grabs opup menu from template to browse a fresh selection of dank memes.
	//And some emoticons too, I guess.
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL("page/html/template.html"), false);
	xhr.send(null);
	
	var menu = dParser.parseFromString(xhr.responseText, 'text/html');
	document.body.appendChild(menu.body.children['emote-popup']);
	var emotePopup = document.getElementById("emote-popup");

	emoteBtn.addEventListener('click', popupEmote, false);
	emotePopup.addEventListener('click', function(){
		//Focus back to text area
		document.getElementById("chat-input-textarea").focus();
	}, false);
}

var popupEmote = function(){

	var page = document.getElementById('page');

	//Grabs current menu heihgt
	// var pageHeight = window.getComputedStyle(page, null).getPropertyValue("height");

	if(page.className === "page-up")
		page.className = "page-down";
	else
		page.className = "page-up";


	//Autofocus on textarea
	document.getElementById("chat-input-textarea").focus();
}

function setupEmotes(){

	// Assign elements
	var menuContainer = document.getElementById("emote-popup");

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

	chat_input = document.getElementById("chat-input-textarea");



	// Assign events

	dankTab.addEventListener('click',function(){ scrollTo(dankList); });

	fulpTab.addEventListener('click', function(){ scrollTo(fulpList); });

	faicTab.addEventListener('click', function(){ scrollTo(faicList); });

	picoTab.addEventListener('click', function(){ scrollTo(picoList); });

	pixelTab.addEventListener('click', function(){ scrollTo(pixelList); });
}

function getExternalCss(){
	var css = document.querySelector('link[rel="stylesheet"][type="text/css"]');

	var xhr = new XMLHttpRequest();
	xhr.open('GET', "https://chat.newgrounds.com" + css.getAttribute("href"), false);
	xhr.send(null);

	parseCSS(xhr.responseText);
}

function parseCSS(styleSheet){
	// Finds all emoticon related class selectors
	var classSelectorRegEx = /\.ng-emoticon-([a-z]+)([A-Za-z0-9]+)[{\s]*([^b]*([^:]+)[^}]+)/g;
	var classSelector;

	// Finds the "original Faic's" sprite sheet
	var ngSpriteCSSRegEx = /\.ng-emoticon[^-{]*{([^}]+)/g;
	var ngSpriteCSS = ngSpriteCSSRegEx.exec(styleSheet);

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
			console.error("Err: Unexpected background modifier " + classSelector[1]);
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
		chat_input.value += name + " ";
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
	document.getElementById("emote-list").scrollTop = node.offsetTop;
}

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
//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	chatInputArea = document.getElementsByClassName("chat-input-area")[0];
	dParser = new DOMParser();

	addEmoteBtn();
	setupEmotes();
	getExternalCss();
}

//------------------------------------------------------------

}());