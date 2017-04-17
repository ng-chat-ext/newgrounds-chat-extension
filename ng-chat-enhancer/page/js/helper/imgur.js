(function() {

//------------------------------------------------------------
NGCE.Helper.Imgur = {
	upload: upload
};
//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function upload(file, callback, progress) {
    var xhr = new XMLHttpRequest();
    var fd = new FormData();

    xhr.onreadystatechange = function(e) {
        if (xhr.status === 200 && xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
        	callback(response);
        }
    };
    xhr.upload.addEventListener('progress', progress, false);

    fd.append('image', file);
    xhr.open('POST', 'https://api.imgur.com/3/image');
    xhr.setRequestHeader('Authorization', 'Client-ID afa5ba8ec42b00e');
    xhr.send(fd);
};

//------------------------------------------------------------

}());