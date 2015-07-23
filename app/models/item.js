'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var config = require('../../config/config');

/**
 * Club Carlson Schema
 */
var ItemSchema = new Schema({
    name: String,
    impressions: Number,
    caption: String,
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


ItemSchema.set('toJSON', {
    virtuals: true
});

ItemSchema.virtual('path').get(function(){
    return '/uploads/' + this.name;
});

mongoose.model('Item', ItemSchema);