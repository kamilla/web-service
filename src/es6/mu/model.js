// model.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 node model for backbone web-service.
// model.js may be freely distributed under the MIT license.

import Backbone from 'backbone';

class Node extends Backbone.Model {
	// *Define some default attributes.*
	defaults() {
		var image = new Image();
		image.src = 'img/Workstation.png';
		return {
			//idAttribute: 'Id',
			title: '',
			image: image,
			selected: false,
			type: 'node',
			force: {
				x: 0,
				y: 0
			}
		};
	}

	parse(data) {

		console.log("Node.parse", "VAR", data);
		var image = new Image();
		image.src = data.image;
		data.image = image;	// I SUPPOSE THIS IS KINDA CHEAT-BUBBLEGUM-WORKAROUND, BUT HEY, :p
		return data;
	}
}

export default Node;