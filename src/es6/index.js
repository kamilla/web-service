// index.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 entry point for backbone web-service.
// index.js may be freely distributed under the MIT license.


// Imports
import Session from './mu/session';
import View from './mu/view';

// IMPORTS USED FOR TESTING
import Node from './mu/model';
import Connection from './mu/connection';
import Zone from './mu/zone';

// Import CSS styles
require("../css/style.css");

// Create session and login
const session = new Session();
session.login();

// Create view
const testView = new View(document.getElementById('main'));

// TESTING FOR ELEMENT CREATION
console.log(testView);

const image = new Image();
image.src = 'img/Workstation.png';

testView.network.add(new Node({ id: 0, name: 'karva', x: 100, y: 100, physical: [1], image: image }));
testView.network.add(new Node({ id: 1, name: 'paavo', x: 200, y: 200, physical: [0, 2], image: image }));
testView.network.add(new Node({ id: 2, name: 'pekka', x: 350, y: 150, physical: [1, 3, 4], image: image }));
testView.network.add(new Node({ id: 3, name: 'mutka', x: 350, y: 150, physical: [2, 4], image: image }));
testView.network.add(new Node({ id: 4, name: 'piast', x: 350, y: 150, physical: [3, 2], image: image }));

testView.network.add(new Connection({ id: 5, name: 'conn 1', topology: 'physical', from: 0, to: 1}));
testView.network.add(new Connection({ id: 6, name: 'conn 1', topology: 'physical', from: 1, to: 2}));
testView.network.add(new Connection({ id: 7, name: 'conn 1', topology: 'physical', from: 2, to: 3}));
testView.network.add(new Connection({ id: 8, name: 'conn 1', topology: 'physical', from: 2, to: 4}));
testView.network.add(new Connection({ id: 9, name: 'conn 1', topology: 'physical', from: 3, to: 4}));

testView.network.add(new Zone({ id: 10, name: 'zone 1', nodes: [0, 1]}));
testView.network.add(new Zone({ id: 11, name: 'zone 2', nodes: [2, 3, 4], background: '#951'}));
testView.network.add(new Zone({ id: 12, name: 'zone 3', nodes: [3], background: '#456'}));

console.log(testView);