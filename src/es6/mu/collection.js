// collection.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 collection class for backbone web-service.
// collection.js may be freely distributed under the MIT license.

import Backbone from 'backbone';
import Node from './model';
import Connection from './connection';


class Network extends Backbone.Collection {
	constructor() {
		super();
		this.url = 'http://localhost:8888/api/message';
		this.model = (function(attrs, options) {
			console.log("ATTRS");
			console.log(attrs);
			// TODO REDO THIS WITH TYPE?
		    if (attrs.from !== undefined) {
		      return new Connection(attrs, options);
		    } else {
		      return new Node(attrs, options);
		    }
		 });
		this.comparator = (function(model) {	// COMPARATOR TO GET ORDERED COLLECTION -> HELPS IN DRAWING
			switch (model.get('type')) {
				case 'node':
					return 2;
				case 'connection':
					return 1;
				case 'zone':
					return 0;
				default:
					return 9;
			}
		});
	}

	// Parse the Nodes from json structrure
	parse(response) {
		console.log(response);
		const result = response.Nodes.concat(response.Connections);
		console.log("RESULT");
		console.log(response.Nodes);
		console.log(response.Connections);
		console.log(response.Nodes.concat(response.Connections));

		console.log(result);
		return result;
    	//return response.Nodes;
  	}
}

export default Network;