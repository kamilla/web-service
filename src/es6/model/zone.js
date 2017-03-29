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