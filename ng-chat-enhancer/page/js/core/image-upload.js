(function() {

//------------------------------------------------------------
NGCE.ImageUpload = {
	init: init
};
//------------------------------------------------------------



//------------------------------------------------------------
// Private variables
//------------------------------------------------------------

var messagesList;
var chatInputTextArea;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function dragOver(e) {
	// !!! check if text drag hover triggers this event.
	e.stopPropagation();
	e.preventDefault();
	// e.target.className = (e.type == "dragover" ? "hover" : "");
}

function dragDrop(e) {
	e.stopPropagation();
	e.preventDefault();

	var files = e.target.files || e.dataTransfer.files;
	for (var i = 0, f; f = files[i]; i++) {
		parseFile(f);
	}
};

function parseFile(file) {
	if (file.type.split('/')[0] !== 'image')
		return;

	NGCE.Helper.Imgur.upload(file, uploadCallback, progress);

	function uploadCallback(response) {
		NGCE.Helper.Text.insert(response.data.link, chatInputTextArea);
	}

	function progress(e) {
		console.log(e.loaded / e.total);
	}
};

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function init() {
	// Check if browser supports File API.
	if (!(window.File && window.FileList && window.FileReader))
		return;

	messagesList = document.querySelector(".messages-area");
	chatInputTextArea = document.getElementById("chat-input-textarea");

	messagesList.addEventListener('dragover', dragOver, false);
	messagesList.addEventListener('drop', dragDrop, false);
};

//------------------------------------------------------------

}());