// zone.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 zone model for backbone web-service.
// zone.js may be freely distributed under the MIT license.

import Backbone from 'backbone';

class Zone extends Backbone.Model {
	// *Define some default attributes.*
	defaults() {
		return {
			title: '',
			selected: false,
			type: 'zone',
			background: '#112233'
		};
	}
}

export default Zone;