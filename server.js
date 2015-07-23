'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// Set the node environment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables 
var config = require('./config/config'),
    mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);
// Bootstrap models
var models_path = __dirname + '/app/models';
var walkModels = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walkModels(newPath);
        }
    });
};
walkModels(models_path);

var app = express();

// Express settings
require('./config/express')(app);
	// Bootstrap routes
var routes_path = __dirname + '/app/routes';
var walkRoutes = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(app);
            }
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walkRoutes(newPath);
        }
    });
};

walkRoutes(routes_path);

// Start the app by listening on <port>

var port = process.env.PORT || config.port;

global.io = require('socket.io').listen(app.listen(port))
console.log('Express app started on port ' + port);

// Expose app
module.exports = app;
