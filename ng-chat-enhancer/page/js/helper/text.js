(function() {

//------------------------------------------------------------
NGCE.Helper.Text = {
	insert: insert
};
//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function insert(textToInsert, textElem) {
    var v = textElem.value;
    var p = textElem.selectionStart;
    var end = p;
    var val = '';

    // Add space padding to the front and back of the inserted text if there isn't any.
    // I believe this might improve user experience because emoticons are sent as text.
    if (p !== 0 && v[p-1] !== ' ') { val += ' '; end++; }
    val += textToInsert;
    if (v[p] !== ' ')   { val += ' '; end++; }

    // Insert text at caret position.
    textElem.value = v.substr(0, p) + val + v.substr(p);

    // Move caret back to where it should be.
    textElem.selectionStart = end + textToInsert.length;
    textElem.selectionEnd = end + textToInsert.length;
};

//------------------------------------------------------------

}());