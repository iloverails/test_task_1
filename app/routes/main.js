'use strict';
var main = require('../controllers/main');

module.exports = function(app) {
	app.get('/', main.index);
};
