angular.module('test_task').factory('socket', ['socketFactory', function (socketFactory) {
    return socketFactory();
}]).value('version', '0.1');