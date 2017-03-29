// connection.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 connection model for backbone web-service.
// connection.js may be freely distributed under the MIT license.

import Backbone from 'backbone';

class Connection extends Backbone.Model {
	// *Define some default attributes.*
	defaults() {
		//this.type = 'connection';
		return {
			title: '',
			selected: false,
			type: 'connection'
		};
	}
	// parse(data) {
	// 	console.log("CONNECTION.parse", data);
	// 	this.type = data.type;
	// 	return data;
	// }
}

export default Connection;