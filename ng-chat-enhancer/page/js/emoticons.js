(function() {

//------------------------------------------------------------
NGCE.Emoticons = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function emoteListener(){
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    	document.getElementById("chat-input-textarea").value += request.name;
	  });
}

function getChatCSS(){

	// // Get emoticon list.
	// for (var i = document.styleSheets.length - 1; i >= 0; i--) {
	// 	// Find chat stylesheet.
	// 	if (document.styleSheets[i].href && document.styleSheets[i].href.substr(0, 38) === "https://chat.newgrounds.com/build/chat")
	// 		console.log('test');
	// }
	
	var css = document.querySelector('link[rel="stylesheet"][type="text/css"]');
	
	chrome.storage.sync.set({'css-url': css.getAttribute('href')});
}

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	emoteListener();
	getChatCSS();
}

//------------------------------------------------------------

}());