'use strict';

// Utilize Lo-Dash utility library
var _ = require('lodash');

// Extend the base configuration in all.js with environment
// specific configuration

var parameters = require('fs').existsSync(__dirname + '/env/parameters.js') ? require('./env/parameters') || {} : {};

module.exports = _.extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {},
    parameters
);
