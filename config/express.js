'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    consolidate = require('consolidate'),
    flash = require('connect-flash'),
    assetmanager = require('assetmanager'),
		_ = require('lodash'),
		config = require('./config');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');

module.exports = function(app) {
    app.set('showStackError', true);
    app.locals.pretty = true;
		app.locals.cache = 'memory';
		app.use(compression());

    app.engine('html', consolidate[config.templateEngine]);
    app.set('view engine', 'html');
    app.set('views', config.root + '/app/views');
    app.enable('jsonp callback');

    app.use(compression());
    app.use(bodyParser.json());
    app.use(methodOverride());
    // Import your asset file
    var assets = assetmanager.process({
	    assets: require('./assets.json'),
	    debug: (process.env.NODE_ENV !== 'production'),
	    webroot: 'public'
    });

    app.use(flash());
    app.locals.assets = assetmanager.assets
    app.use(express.static(config.root + '/public'));
};
