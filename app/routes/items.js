'use strict';
var items = require('../controllers/items');

module.exports = function(app) {
    app.get('/items', items.all);
    app.put('/items/:_id', items.update);
    app.post('/items', items.upload);
    app.delete('/items/:_id', items.remove);
};
