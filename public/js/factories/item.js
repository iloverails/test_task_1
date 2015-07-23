angular.module('test_task').factory('Item', ['$resource', function($resource) {
    return $resource('/items/:id', {id: '@_id'},
        {
            'update': { method:'PUT' }
        });
}]);