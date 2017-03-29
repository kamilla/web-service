// view.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 view class for backbone web-service.
// view.js may be freely distributed under the MIT license.

import _ from 'underscore'; // REDO _ functions with ES6 / NEXT even underscore is a hard dependency for backbone
import $ from 'jquery'; // REDO this without jQuery, consider jBone
import Backbone from 'backbone';
import Network from './collection';
import Modal from './modal';
import Node from './model';

class View extends Backbone.View {
	constructor(el) {
		super();

		this.$el = el;
		this.network = new Network();
		this.viewport = new class vport {
			constructor() {
			  	this.width = 100;
			  	this.height = 100;
			}
			get width() {
			  	return this._width;
			}
			set width(width) {
			  	this._width = width;
			}
		}();
		this.canvas = document.createElement('canvas');
	  	this.canvas.id = 'floaterCanvas';
	  	this.context = this.canvas.getContext("2d");
	  	this.$el.appendChild(this.canvas);

	  	this.modallayer = document.createElement('div');		// RENAME , EHKÄ VAAN MODAL ?
	  	this.modallayer.id ='modalLayer';
	  	this.$el.appendChild(this.modallayer);
	  	//this.modals = [];

	  	this.viewport.width = this.$el.clientWidth;
  		this.viewport.height = this.$el.clientHeight;
  		this.canvas.width = this.viewport.width;  // is this also needed this.modallayer.width?
  		this.canvas.height = this.viewport.height;

  		this.scale = 1;
  		this.ctrlKey = false;


  		this.mode = {
  			mode: null,
  			param: {
  				dragStart: {
  					x: null,
  					y: null
  				}
  			}
  		};

  		this.physics = {
  			netforce: 100
  		};


  		// ___BINDS___ so we can remove listeners
  		this.bound = {
  			mouseup: event => this.mouseup(event),
  			mousemove: event => this.mousemove(event),
  			click: event => this.click(event),
  			add: event => this.render(event)
  		};

		this.network.on({
			'add': this.bound.add
		});


		// TODO: MUUTA NÄÄ BACKBONE VIEW EVENTS MUOTOON!!!
		//$(this.canvas).on('mousedown', () => this.mousedown(event));
		this.canvas.addEventListener('mousedown', event => this.mousedown(event)); //evt => this.sayHello(evt)
		this.canvas.addEventListener('wheel', event => this.zoom(event));
		this.canvas.addEventListener('click', this.bound.click);  // tarviiks tätä poistaa koskaa? vai onks turhaa bindi? edit: itaseasis ehkä kokonaan turha ku ei clickii tarvii?
		this.canvas.addEventListener('dblclick', event => this.doubleclick(event));
		this.canvas.addEventListener('contextmenu', event => this.contextmenu(event));

		//this.canvas.addEventListener('keydown', event => this.keydown(event));

		window.addEventListener('keydown', event => this.keydown(event));
		window.addEventListener('keyup', event => this.keyup(event));

		this.init();

	}

 	init() {

 		console.log('INITIALIZATION');
 		this.context.font = "30px Arial";
		this.context.fillStyle = "#ffffff";
		this.context.strokeStyle="#ffffff";
		//console.log("CONTEXT:", this.context);

		const backboneSync = Backbone.sync;
		Backbone.sync = function (method, model, options) {
			// Set the 'Authorization' header and get the access token from the session storage
			options.headers = { 'Authorization': 'Bearer ' + sessionStorage.token };
			// Call the stored original Backbone.sync method with extra headers argument added
			backboneSync(method, model, options);
		};

		// FETCH DATA FROM REST
		//this.network.fetch({reset: true});
		const timestamp = (new Date()).toUTCString();
		this.network.fetch({
		  	data: { time: timestamp },
		  	success: this.success,
		  	remove: false
		  	//error: _error,
		 	//reset: true
		});

 	}

 	success(collection, response, options) {
 		console.log("SUCCESS");
 		console.log(collection);
 		console.log(response);
 		console.log(options);
 	}

 	// this.menu.addNode.onclick = () => { this.addNode(event); };

 	addNode(event) {
 		console.log("CONTEXT MENU - ADD NODE");
 		console.log(event);
 		console.log("X:", event.clientX,"Y:", event.clientY);
 		const node = new Node({ name: 'uus node', x: this.scale * event.clientX, y: this.scale * event.clientY});
 		this.network.add(node);
 		const node_ = new Backbone.Model({ name: 'uus node', x: this.scale * event.clientX, y: this.scale * event.clientY, image: 'img/Workstation.png'});
 		node.save();
 		this.modallayer.appendChild((new Modal('editNode', node.get('id'))).dialog);
 		//menu_add_node.onclick = function() {
 	}

 	keydown(event) {
 		if(event.keyCode == 17) {
 			this.ctrlKey = true;
 		}
 		console.log(event);
 		console.log(this.ctrlKey);
 	}

 	keyup(event) {
 		if(event.keyCode == 17) {
 			this.ctrlKey = false;
 		}
 		console.log(event);
 		console.log(this.ctrlKey);
 	}

 	zoom(event) {
 		event.preventDefault();
 		const scale2 = ((100 - Math.sign(event.deltaY)*4)/100);
 		this.scale *= scale2;
 		this.context.scale(scale2, scale2);
 		if(this.requestID === undefined) {
 			this.requestID = requestAnimationFrame(() => { this.renderLoop(performance.now(), 0); });
 		}
 	}

 	click(event) {

 		console.log("CLICK");

 	}

 	doubleclick(event) {
 		const hit = this.checkHit(event);
 		if(hit !== null) {
 			switch (hit.get('type')) { // TÄN VOI EHKÄ LYHENTÄÄ ilman switchii => new Modal(type)
 				case 'node':
 					const modal = new Modal('editNode', hit.get('id'));
 					this.modallayer.appendChild(modal.dialog);
 					break;
 				case 'connection':
 					this.modallayer.appendChild((new Modal('editConnection', hit.get('id'))).dialog);
 					break;
 				case 'zone':
 					this.modallayer.appendChild((new Modal('editZone', hit.get('id'))).dialog);
 					break;
 				default:
 					break;
 			}
 		}
 	}

 	clearSelection() {
 		_.each(this.network.models, node => {
 			node.set({selected: false});
 		});
 		if(this.requestID === undefined) {
 			this.requestID = requestAnimationFrame(() => { this.renderLoop(performance.now(), 0); });
 		}
 	}

 	toggleSelected(node, override = false) {

 		if(node.get('selected') === true && override === false) {
 			node.set({selected: false});
 		} else {
 			node.set({selected: true});
 		}
 		// SELECT ALL NODES IN THE ZONE
 		if(node.get('type') == 'zone' && node.get('selected')) {
 			_.each(node.get('nodes'), (id) => {
 				this.network.set({id: id, selected: true}, {remove: false});
 			});
 		}
 		console.log("TOGGLEGELGE");
 		console.log(node.get('selected'));
 		// joko kutsu tässä tai sit eventtinä kun selected muuttuu?
 		if(this.requestID === undefined) {
 			this.requestID = requestAnimationFrame(() => { this.renderLoop(performance.now(), 0); });
 		}

 	}

 	checkHit(event) {
 		let hit = null;
 		_.each(this.network.models, node => {
 			switch(node.get('type')) {
 				case 'node':
		 			const distance = Math.hypot(event.clientX-this.scale*node.get('x'), event.clientY-this.scale*node.get('y'));
		 	//		console.log("DISTANCE: ", distance);
		 			if ((distance ^ (distance - 30)) < 0) {
		 				hit = node;
		 			}
		 			break;
		 		case 'connection':
		 			// Check if hit connection
		 			const fromNode = this.network.get(node.get('from'));
					const toNode = this.network.get(node.get('to'));

					const a = Math.hypot(this.scale*fromNode.get('x')-this.scale*toNode.get('x'), this.scale*fromNode.get('y')-this.scale*toNode.get('y'));
					const b = Math.hypot(this.scale*fromNode.get('x')-event.clientX, this.scale*fromNode.get('y')-event.clientY);
					const c = Math.hypot(event.clientX-this.scale*toNode.get('x'), event.clientY-this.scale*toNode.get('y'));
				//	const d = Math.sin(Math.acos((a*a+b*b-c*c)/(2*a*b)))*b;
					const d = b + c - a;

					if(d<0.3) {
						console.log("DISTANCE TO LINE");
		 				console.log(d);
		 				hit = node;
					}
					break;

		 		case 'zone':
		 			const nodes = _.filter(this.network.models, (elem) => { return _.contains(node.get('nodes'), elem.get('id')); });
					const xPositions = _.map(nodes, function( node ) { return node.get('x'); }); // _.pluck(nodes, 'x');
					const yPositions = _.map(nodes, function( node ) { return node.get('y'); }); // _.pluck(nodes, 'y');
					const left = this.scale * _.min(xPositions) - this.scale * 50;
					const right = this.scale * _.max(xPositions) + this.scale * 50;
					const top = this.scale * _.min(yPositions) - this.scale * 50;
					const bottom = this.scale * _.max(yPositions) + this.scale * 50;
					if (event.clientX > left && event.clientX < right && event.clientY > top && event.clientY < bottom) {
						console.log("HIT ZONE");
						hit = node;
					}
		 			break;
		 		default:
		 			console.log('unknown element');
		 			break;
 			}
 		});                    //node => this.overlap(node));
 		return hit;
 	}

 	mousedown2(event) {
 		console.log("MOUSEDOWN2");
 		console.log(event);
 	}

 	// TODO: MIETI mousedown ja clickin juttunjen osittain yhistämistä? esim valinnat?
 	// ois hyvä tietää valintojen määrä, oisko valinnat muutenki hyvä olla erillises this.balaa arrayna?
 	// sit sais tehtyy dragaamisesta smootimman helpommin
 	mousedown(event) {

		const initialPositions = [];

 		const hit = this.checkHit(event);
 		if(hit !== null) {
 			switch (hit.get('type')) {
 				case 'node':
 					if(!this.ctrlKey) {
 						this.clearSelection();
 						this.toggleSelected(hit);
 					}
 					else {
 						if(!hit.get('selected')) {
 							this.selectionChanged = true;		// trick for better UI xprnc TODO move this to toggle func
 							this.toggleSelected(hit, true);
 						}
 					}
 					//console.log('clicked node');
 					initialPositions.length = 0;
 					_.each(this.network.models, (node) => {
 						initialPositions.push({id: node.get('id'), x: node.get('x'), y: node.get('y')});
			 		});
 					this.mode = {
			  			mode: 'dragNode',		// TODO muuta tää pelkäks drag nimiseks
			  			param: {
			  				node: hit,
			  				initialPositions: initialPositions,
			  				dragged: false,
			  				initialPosition: {
			  					x: hit.get('x'),		// TODO: mieti näiden yhistämistä, niinku POINTiks ettei tarvii tehä kahta gettii? myös ota tää pois ja yhistä monikkoon ku muuten tupla
			  					y: hit.get('y')
			  				},
			  				dragStart: {
			  					x: event.clientX,
			  					y: event.clientY
			  				}
			  			}
		  			};
 					this.canvas.addEventListener('mousemove', this.bound.mousemove);
 					this.canvas.addEventListener('mouseup', this.bound.mouseup);
 					break;
 				case 'connection':
 					// Select Connection
 					if(!this.ctrlKey) {
 						this.clearSelection();
 						this.toggleSelected(hit);
 					}
 					else {
 						if(!hit.get('selected')) {
 							this.selectionChanged = true;		// trick for better UI xprnc TODO move this to toggle func
 							this.toggleSelected(hit, true);
 						}
 					}
 					// Drag connection?
 					break;
 				case 'zone':
 					console.log("CLICKED ZONE");
 					if(!this.ctrlKey) {
 						this.clearSelection();
 						this.toggleSelected(hit);
 					}
 					else {
 						if(!hit.get('selected')) {
 							this.selectionChanged = true;		// trick for better UI xprnc TODO move this to toggle func
 							this.toggleSelected(hit, true);
 						}
 					}
 					initialPositions.length = 0;
 					_.each(this.network.models, (node) => {
 						initialPositions.push({id: node.get('id'), x: node.get('x'), y: node.get('y')});
			 		});
 					this.mode = {
			  			mode: 'dragNode',		// TODO muuta tää pelkäks drag nimiseks
			  			param: {
			  				node: hit,
			  				initialPositions: initialPositions,
			  				dragged: false,
			  				initialPosition: {
			  					x: hit.get('x'),		// TODO: mieti näiden yhistämistä, niinku POINTiks ettei tarvii tehä kahta gettii? myös ota tää pois ja yhistä monikkoon ku muuten tupla
			  					y: hit.get('y')
			  				},
			  				dragStart: {
			  					x: event.clientX,
			  					y: event.clientY
			  				}
			  			}
		  			};
 					this.canvas.addEventListener('mousemove', this.bound.mousemove);
 					this.canvas.addEventListener('mouseup', this.bound.mouseup);
 					break;
 				default:
 					console.log('ERROR: undefined type');
 					break;
 			}
 		}
 		else {
 			this.clearSelection();
 		}
 	}

 	mouseup(event) {

 		// if not dragged and ctrl pressed and is selected, then toggle selection
 		if(!this.mode.param.dragged && this.ctrlKey && this.mode.param.node.get('selected') && !this.selectionChanged) {
 			this.toggleSelected(this.mode.param.node);
 		}
 		this.selectionChanged = false;
 		this.mode.mode = null;
 		this.canvas.removeEventListener('mousemove', this.bound.mousemove);
 		this.canvas.removeEventListener('mouseup', this.bound.mouseup);
 		// cancelAnimationFrame(this.requestID);
 	}

 	mousemove(event) {
 		console.log("REQID", this.requestID);
 		if(this.requestID === undefined) {
 			console.log("CALLED REQUESTANIMATIONFRAME");
 			this.requestID = requestAnimationFrame(() => { this.renderLoop(performance.now(), 0); });
 		}
 		this.mode.param.dragged = true;
 		// liikuta tässä node(ja) mutta piirto tapahtuu omassa render luupissa jottei turhia päivityksiä, eli fps 60?
 		const deltaX = event.clientX - this.mode.param.dragStart.x;
		const deltaY = event.clientY - this.mode.param.dragStart.y;
 		_.each(this.network.models, (node) => {
 			if(node.get('selected')) {
 				const initialPosition =_.findWhere(this.mode.param.initialPositions, {id: node.get('id')});
 //				console.log("xxx", initialPosition.x);
		 		node.set({
		 			x: initialPosition.x + deltaX,
		 			y: initialPosition.y + deltaY
		 		});
 			}
 		});
 		const newX = this.mode.param.initialPosition.x + deltaX;
 		const newY = this.mode.param.initialPosition.y + deltaY;
		this.mode.param.node.set({
 			x: newX,
 			y: newY
 		});

 	}

 	calculatePhysics() { // TÄÄ KANTSII YHISTÄÄ JOHONKI PIIRTÄMISEEN TMS. ETTEI TURHAA LUUPPAA KAHTEEN KERTAA?
 		this.physics.netforce = 0;
 		_.each(this.network.models, (node) => {
 			node.set({force: {x: 0, y: 0}});
 		});
 		_.each(this.network.models, (node) => {
 			switch(node.get('type')) {
 				case 'node':
 			//node.set({force: {x: 0, y:0}}); // TÄÄ PITÄIS OLLA VALMIIKS JO?
 			var forceX0 = 0, forceY0 = 0;

			_.each(this.network.where({from: node.get('id')}), (connection) => {
				try {
					const fromNode = this.network.get(connection.get('from'));
					const toNode = this.network.get(connection.get('to'));
					const fromForce = fromNode.get('force');
					const toForce = toNode.get('force');

					const length = Math.hypot(fromNode.get('x')-toNode.get('x'), fromNode.get('y')-toNode.get('y'));  // TODO: PARANNA RAKENNETTA; EI TURHIA TUPLA-GETTEJÄ
					forceX0 = forceX0 + ((fromNode.get('x') - toNode.get('x')) * (300 - length) / 1000);
					forceY0 = forceY0 + ((fromNode.get('y') - toNode.get('y')) * (300 - length) / 1000);
					console.log("FORCES");
					console.log(forceX0);
					console.log(forceY0);

					if(fromNode.get('selected')) {
						toNode.set({force: {x: toForce.x - 2*forceX0, y: toForce.y - 2*forceY0}});
					} else {
						fromNode.set({force: {x: fromForce.x + forceX0, y: fromForce.y + forceY0}});	// SET FORCE => FROM-NODE
						toNode.set({force: {x: toForce.x - forceX0, y: toForce.y - forceY0}});	// SET INVERSE FORCE => TO-NODE
					}
					console.log(fromNode.get('force'));
				}
				catch(error) {
					console.log(error);
				}

			});

			this.physics.netforce += Math.hypot(node.get('force').x, node.get('force').y);

			console.log("NETTO:", this.physics.netforce);
			break;
			}
		});
 	}

 	renderLoop(DOMHighResTimeStamp, DOMHighResTimeStampOld) {

 		console.log("NETFORCE", this.physics.netforce);
 		if(this.physics.netforce < 1) {
 			cancelAnimationFrame(this.requestID);
 			this.requestID = undefined;
 		}
 		//else if(this.requestID === undefined) {
 		else {
 			this.requestID = requestAnimationFrame(() => { this.renderLoop(performance.now(), DOMHighResTimeStampOld); }); 	// Request at start of renderLoop so we get as close 60 FPS as possible
 		}
 		//}
  		// if(DOMHighResTimeStamp - DOMHighResTimeStampOld > 50) { 	// FPS Reduce
  		this.calculatePhysics();
 		_.each(this.network.models, (node) => {
			try {
				let newX = node.get('x') + node.get('force').x;
				let newY = node.get('y') + node.get('force').y;
				node.set({x: newX, y: newY});
			}
			catch(error) {
				console.log(error);
			}
		});

  		// Tähän if this.settings.draw.FPS = true { ...
  		var FPS = 1000 / (DOMHighResTimeStamp - DOMHighResTimeStampOld) | 0;
  		var FPSString = "FPS: " + FPS;

  		this.context.globalCompositeOperation = "copy"; //destination-out
  		//this.context.fillRect(0,0,canvas.width,canvas.height);

		this.context.fillText(
			FPSString,
			300,
			20
		);

		this.context.globalCompositeOperation = "source-over";

		_.each(this.network.models, node => this.draw(node));

  		DOMHighResTimeStampOld = DOMHighResTimeStamp;
  		// }	// FPS Reduce

 	}

	render() {

  		_.each(this.network.models, node => this.draw(node));  //node => function(node) {

	}

	draw(node) {

		switch (node.get('type')) {
			case 'node':
				// ___ IMAGE ___
				const image = node.get('image');
				const aspectratio = image.naturalHeight / image.naturalWidth;
				let x = node.get('x');
				let y = node.get('y');

				if (aspectratio < 1) {
					image.width = 50;
					image.height = aspectratio * 50;
					x -= 25;
					y -= image.height>>1;
				}
				else {
					image.width = aspectratio * 50;
					image.height = 50;
					x -= image.width>>1;
					y -= 25;
				}
				if(node.get('selected')) {
					//this.context.fillStyle="#000055";
					//this.context.fillRect(x-5,y-5,image.width+10,image.height+10);
					this.context.filter = "drop-shadow(0px 0px 4px #fff) contrast(200%)";
				} else {
					this.context.filter = "none";
				}
				this.context.globalCompositeOperation = 'source-over';  // TÄÄ DEFAULTIKS JA POIS TÄST
		        this.context.drawImage(image, x, y, image.width, image.height);

				this.context.fillText(
					node.id,
					node.get('x'),
					node.get('y')
				);
				break;
			case 'connection':
				try {
					const fromNode = this.network.get(node.get('from'));
					const toNode = this.network.get(node.get('to'));
					if(node.get('selected')) {
						console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
						this.context.filter = "drop-shadow(0px 0px 4px #fff) contrast(200%)"; //  sepia(100%) hue-rotate(200deg) contrast(90%)
						this.context.lineWidth = 2;
					} else {
						this.context.filter = "none";
						this.context.lineWidth = 1;
					}
					//this.context.globalCompositeOperation = 'destination-over';	// ONKOS TÄÄ TURHA NYT KU ON JÄRJESTETTY COLLECTION?
					this.context.beginPath();
					this.context.moveTo(fromNode.get('x'), fromNode.get('y'));
					this.context.lineTo(toNode.get('x'), toNode.get('y'));
					this.context.stroke();
				}
				catch(error) {
					console.log(error);
				}
				break;
			case 'zone':
				const nodes = _.filter(this.network.models, (elem) => { return _.contains(node.get('nodes'), elem.get('id')); });
				const xPositions = _.map(nodes, function( node ) { return node.get('x'); }); // _.pluck(nodes, 'x');
				const yPositions = _.map(nodes, function( node ) { return node.get('y'); }); // _.pluck(nodes, 'y');
				const left = _.min(xPositions) - this.scale * 50;
				const width = _.max(xPositions) + this.scale * 50;// - left;
				const top = _.min(yPositions) - this.scale * 50;
				const height = _.max(yPositions) + this.scale * 50;// - top;
				//this.context.globalCompositeOperation = 'destination-over';

				if(node.get('selected')) { // TODO TOO MANY DUPLICATES; MOVE UP
					console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
					this.context.filter = "drop-shadow(0px 0px 4px #fff) opacity(50%)"; //  sepia(100%) hue-rotate(200deg) contrast(90%)
					this.context.lineWidth = 2;
				} else {
					this.context.filter = "opacity(50%)";
					this.context.lineWidth = 1;
				}

				this.context.roundRect(left, top, width, height, 10);
				this.context.strokeStyle = "#fff";
				this.context.fillStyle = node.get('background');
				this.context.stroke();
				this.context.fill();

				console.log("ZONE", left, top, width, height);
				console.log(xPositions);
				console.log(nodes);
				break;
			default:
				break;
		}
	}
}

CanvasRenderingContext2D.prototype.roundRect = function(sx,sy,ex,ey,r) {
    var r2d = Math.PI/180;
    if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
    if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y
    this.beginPath();
    this.moveTo(sx+r,sy);
    this.lineTo(ex-r,sy);
    this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
    this.lineTo(ex,ey-r);
    this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
    this.lineTo(sx+r,ey);
    this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
    this.lineTo(sx,sy+r);
    this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);
    this.closePath();
};

export default View;