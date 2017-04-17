(function() {

//------------------------------------------------------------
NGCE.Helper.Watch = {
    watch: watch,
    dispatch: dispatch
}
//------------------------------------------------------------



//------------------------------------------------------------
// Variables
//------------------------------------------------------------

// Watch lists.
var lists = [];

//------------------------------------------------------------



//------------------------------------------------------------
// Public
//------------------------------------------------------------

function watch(list, callback) {
    lists[list] = lists[list] || [];
    lists[list].push(callback);
}

function dispatch(list) {
    if (!lists[list])
        return;

    for (var i = lists[list].length - 1; i >= 0; i--) {
        lists[list][i].apply(null, Array.prototype.slice.call(arguments, 1));
    }
}

//------------------------------------------------------------

}());

