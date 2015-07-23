angular.module('test_task').factory('ItemService', ['Item', 'socket', function(Item, socket) {
    var items = [], itemsmethods = {};

    items = Item.query();

    itemsmethods.getItems = function(){
        return items
    }

    itemsmethods.setItem = function(item){
        _.each(items, function(tItem, n){
            if (tItem && tItem._id == item._id) _.extend(items[n],item);
        })
    }

    itemsmethods.addItem = function(item){
        items.push(item)
    }

    itemsmethods.updateItem = function(item){
        Item.update({id: item._id}, item)
    };

    itemsmethods.removeItem = function(item){
        Item.delete({ id: item._id});
    }

    socket.on('updatedItem', function (item) {
        itemsmethods.setItem(item)
    });

    socket.on('removedItem', function (data) {
        _.each(items, function(tItem, n){
            if (tItem && data.itemId == tItem._id) items.splice(n,1)
        })
    });

    socket.on('createdItem', function (item) {
        itemsmethods.addItem(item)
    });
    return itemsmethods
}]);