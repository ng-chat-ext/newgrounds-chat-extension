(function() {

	NGCE.Obj = NGCE.Obj || {};
	NGCE.Obj.UserInfo = function(userNode) {
		var self = this;
		init(userNode);

		//------------------------------------------------------------

		function init(node) {
			self.node = userNode;
			self.username = node.querySelector('.user-list-username').getAttribute('ngce-name');
		}

		//------------------------------------------------------------
	}
	
}());