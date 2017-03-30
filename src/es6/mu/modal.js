// modal.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 modal class for web-service.
// modal.js may be freely distributed under the MIT license.

// TODO conventions from https://github.com/elierotenberg/coding-styles/blob/master/es6.md ex. _foo for private methods

class Modal {
	constructor(type, id) { // constructor  // MIETI JOS TÄN SAIS TEHTYY ITTE EXTENDS DIALOGIKS?
		//const id = document.createTextNode(_id);
		this.bound = {
			mousemove: event => this.mousemove(event)
		};


		this.initialPosition = {
			mouse: {
				x: 0,
				y: 0
			},
			modal: {
				x: 0,
				y: 0
			}
		};

     	this.dialog = document.createElement('div');   // EHKÄ TEE VAAN CONST DIALOG ? JA RETURNAA SE ? DIALOG DIVIKS KU EI OO TUETTU?
     	this.dialog.className = 'dialog';
     	this.dialog.onmousedown = event => this.mousedown(event);
     	this.dialog.onmouseup = event => this.mouseup(event);
     	const closeButton = document.createElement('a');
     	closeButton.className = 'cross';
     	closeButton.onclick = event => this.close(event);
     	//closeButton.addEventListener('click', event => this.close(event));

      // REDO TEE NÄISTÄ TEMPLATEJA ESIM UNDERSCORE ET VOI LATAA LENNOSSA
     	const editNode = `<h2>Edit Node [<span>${id}</span>]</h2>`;
		  const editConnection = `<h2>Edit Connetion [<span>${id}</span>]</h2>`;
      const editZone = `<h2>Edit Zone [<span>${id}</span>]</h2>`;

  		function htmlTemplate(type) {
  			switch(type) {
  		 			case 'node':
  		 				return editNode;
  		 			case 'connection':
  		 				return editConnection;
            case 'zone':
              return editZone;
  		 			default:
  		 				return `<h2>Unknown Modal Dialog</h2>`;
  		 	}
  		}

     	this.dialog.innerHTML = htmlTemplate(type);

  		this.dialog.appendChild(closeButton);

  	}

  	show() {
  		this.dialog.show();
  		//this.dialog.style.display = 'block';
  	}

  	close(event) {
  		//const removeEvent = new CustomEvent('remove', event);
  		//this.dialog.dispatchEvent(removeEvent);
  		//this.dialog.close();
  		console.log("CLOSE");
  		console.log(this);
  		this.dialog.parentElement.removeChild(this.dialog); // IS THIS LEGAL ? xD
  		//delete this.dialog;
  		//console.log(this);
  		//this.dialog.style.display = 'none';
  	}

  	mousedown(event) {
  		console.log("MOUSEDOWN");
  		console.log(event);
  		[this.initialPosition.mouse.x, this.initialPosition.mouse.y] = [event.x, event.y];
  		[this.initialPosition.modal.x, this.initialPosition.modal.y] = [event.target.offsetLeft, event.target.offsetTop];
  		console.log("INITIAL");
 		console.log(this.initialPosition.x);
  		window.addEventListener('mousemove', this.bound.mousemove);
  	}

  	mouseup(event) {
  		console.log(event);
  		console.log("MOUSEUP");
  		window.removeEventListener('mousemove', this.bound.mousemove);
  	}

  	mousemove(event) {
  		console.log("MOUSEMOVE");
  		console.log(event);
  		console.log(this);
  		// this.dialog.style = {
  		// 	left: (this.initialPosition.x - event.x).toString() + 'px',
  		// 	top: (this.initialPosition.y - event.y).toString() + 'px'
  		// };
  		this.dialog.style.left = (this.initialPosition.modal.x + event.x - this.initialPosition.mouse.x).toString() + 'px';
  		this.dialog.style.top = (this.initialPosition.modal.y + event.y - this.initialPosition.mouse.y).toString() + 'px';
  		console.log(this.initialPosition.mouse.x - event.x);
  		console.log(this.dialog.style.left);
  		//[this.initialPosition.x, this.initialPosition.y] = [event.x, event.y];
  	}


}

export default Modal;