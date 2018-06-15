(function() {

	NGCE.Obj = NGCE.Obj || {};
	NGCE.Obj.MessageInfo = function(messageNode) {
		var self = this;
		init(messageNode);

		//------------------------------------------------------------

		function init(node) {
			self.node = messageNode;
			self.type = node.querySelector('.msg-table').children.length > 0 ? 1 :
						node.querySelector('.server-message-table').children.length > 0 ? 3 :
						node.querySelector('.me-message-table').children.length > 0 ? 2 : '';
			self.username = null;
			self.mentions = getMentions(node);
			self.mentioned = false;
			self.time = getTime(node);

			switch(self.type) {
				case 1:
					var uN = node.querySelector('.msg-username');
					self.username = uN.innerText;
					self.mentioned = node.querySelector('.msg-text-area.mention') != null;
					break;
				case 2:
					self.username = node.querySelector('.me-message-text').innerText.split(' ')[0];
					break;
				case 3:
					self.mentioned = node.querySelector('.me-message-text.mention') != null;
					break;
			}
		}

		function getMentions(node) {
			var links = node.querySelectorAll('.msg-text a');
			var mentions = [];

			for (var i = links.length - 1; i >= 0; i--) {
				if (links[i].innerText[0] === '@')
					mentions.push(links[i].innerText.substring(1));
			}

			return mentions;
		}

		function getTime(node) {
			var timeNode = node.querySelector('.msg-time');
			if (!timeNode)
				return new Date();
			else {
				var regex = /(\d{1,2}):(\d{2}) (AM|PM)/g;
				var match = regex.exec(timeNode.innerText);

				var tmp = new Date();
				// If the message is from yesterday(passing midnight), minus 1 day.
				if (match[3] === 'PM' && tmp.getHours() < 12)
					tmp = new Date(tmp.setDate(tmp.getDate() - 1));
				// Set time.
				tmp.setHours(getHour(match[1], match[3]), Number(match[2]));

				return tmp;
			}
		}

		function getHour(hour, ampm) {
			hour = Number(hour);
			// Set to 0 if it's 12AM.
		    if (ampm === 'AM' && hour === 12)
		        hour = 0;
		    // Add 12 hours if it's afternoon (but not 12PM).
		    else if (ampm === 'PM' && hour < 12)
		        hour += 12;
			return hour;
		}

		//------------------------------------------------------------
	}
	
}());