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
var body;

//------------------------------------------------------------



//------------------------------------------------------------
// Private
//------------------------------------------------------------

function dragOver(e) {
	e.stopPropagation();
	e.preventDefault();
    body.classList.add('ngce-image-over');
}

function dragDrop(e) {
    body.classList.remove('ngce-image-over');
	e.stopPropagation();
	e.preventDefault();

	var files = e.target.files || e.dataTransfer.files;
	for (var i = 0, f; f = files[i]; i++) {
		parseFile(f);
	}
}

function dragLeave() {
    body.classList.remove('ngce-image-over');
}

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

    body = document.querySelector('body');
	messagesList = document.querySelector(".messages-area");
	chatInputTextArea = document.getElementById("chat-input-textarea");

	body.addEventListener('dragover', dragOver, false);
	body.addEventListener('drop', dragDrop, false);
	body.addEventListener('dragleave', dragLeave, false);
};

//------------------------------------------------------------

}());