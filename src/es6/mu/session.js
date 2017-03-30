// session.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 login script for web-service.
// session.js may be freely distributed under the MIT license.

//import md5 from 'md5';
import { base64Decode } from './common';

class Session {

	constructor() {
		// Add AJAX request header: Content-Type: application/json
		// $.ajaxSetup({
		// 	beforeSend: function (xhr) {
	 //    		xhr.setRequestHeader ("Content-Type", "application/json");
		// 	}
		// });
	}

 	// Logon function
 	logon(data, status, jqXHR) {
 		console.log(data);
		const jwtData = data.token.split('.');
		const jwtHeaderJSON = JSON.parse(base64Decode(jwtData[0]));
		const jwtPayloadJSON = JSON.parse(base64Decode(jwtData[1]));
		// var jwtSignature = base64Decode(jwtData[2]);

		sessionStorage.token = data.token;
		sessionStorage.team = jwtPayloadJSON.team;
		sessionStorage.user = jwtPayloadJSON.id;

		//log.debug('username', 'function logon', sessionStorage.user);
		console.log('username', 'function logon', sessionStorage.user);

    	//window.location.href = "current/index.html";
 	}

 	// Unauthorized
 	unauthorized(jqXHR, status, error) {
		console.log(status);
		console.log('function unauthorized');
		console.log(error);

 	}

 	// Do POST request
	login() {
		// TODO: MOVE TO CONFIG
		const credentials = '{"username":"' + 'kamilla' + '","password":"' + '21232f297a57a5a743894a0e4a801fc3' + '"}';

	    //const credentials = getCredentials();
	    // $.ajax({
	    // 	url: 'http://localhost:8888/api/login',
	    // 	method: 'POST',
	    // 	processData: false,
	    // 	data: credentials,
	    // 	success: this.logon,
	    // 	error: this.unauthorized
	    // });

		const xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:8888/api/login');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = () => {
		    if (xhr.status === 200) {
		        const userInfo = JSON.parse(xhr.responseText);
		        this.logon(JSON.parse(xhr.responseText), xhr.status, xhr);
		    }
		    else {
		    	this.unauthorized(xhr, xhr.status, xhr.responseText);
		    }
		};
		xhr.send(credentials);
	}

}

export default Session;