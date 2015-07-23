'use strict';

angular.module('test_task').controller('MainCtrl', ['$scope', 'fileReader', '$http', 'ItemService', function ($scope, fileReader, $http, ItemService) {
    $scope.submitted = false;
    $scope.itemService = ItemService;
    $scope.form={};
    $scope.new_file = {};
    $scope.setFile = function(type, file){
        if (file && file.length>0){
            if (file[0].size > 1024*1024*5){
                angular.element('input[name="'+type+'"]').innerHTML=angular.element('input[type="file"]').innerHTML;
                $scope.new_file.errors = 'File to large';
            }else if(file[0].type.indexOf('image') == -1){
                angular.element('input[name="'+type+'"]').innerHTML=angular.element('input[type="file"]').innerHTML;
                $scope.new_file.errors = 'Select image';
            }else{
                fileReader.readAsDataUrl(file[0], $scope)
                    .then(function(result) {
                        $scope.new_file.name = file[0].name;
                        $scope.new_file.src = result;
                        $scope.new_file.errors = '';
                    });
            }
            $scope.$apply();
        }
    };

    $scope.submitForm = function(){
        if (!$scope.new_file.errors && $scope.new_file.src){
            $scope.uploading = true;
            angular.element("form").ajaxSubmit({
                url: '/items',
                type: 'post',
                success: function(uploaded_item) {
                    $scope.new_file = {};
                    $scope.uploading = false;
                    $scope.submitted = false;
                    $scope.$apply();
                }
            });
        }
    }

}]);
