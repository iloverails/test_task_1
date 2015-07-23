var config = require('../../config/config');
var formidable = require('formidable');
var fs = require('fs');
var _ = require('lodash');
var mongoose = require('mongoose'),
    Item = mongoose.model('Item');

exports.all = function(req,res){
    Item.find().sort('-createdAt').exec(function(err, items){
        res.json(items)
    })
};

exports.upload = function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = config.root + '/public/uploads';
    form.on('file', function(name,file) {
    }).on('end', function() {
    }).parse(req, function(err, fields, files) {
        var saveItem = function(name, caption, cb){
            var item = new Item({
                name: name,
                caption: caption
            });
            item.save(cb)
        }

        if (!(files && files.item)) return res.status(500).json({error: 'Something went wrong'})
        fs.rename(files.item.path, form.uploadDir+'/'+files.item.name, function (err) {
            saveItem(files.item.name, fields.caption, function(err, resItem){
                global.io.sockets.emit('createdItem',resItem)
                res.json(resItem)
            })
        })
    })

};

exports.update = function(req,res){
    Item.findOne({_id: req.params._id}).exec(function(err, item){
        if (err || !item) return res.status(500).send('something went wrong')
        _.extend(item, req.body)
        item.save(function(err, itemRes){
            global.io.sockets.emit('updatedItem',itemRes)
            res.json(itemRes)
        })
    })
};

exports.remove = function(req,res){
    Item.remove({_id: req.params._id}).exec(function(){
        global.io.sockets.emit('removedItem',{itemId: req.params._id})
        res.send(200)
    })
}

