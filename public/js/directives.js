angular.module('test_task').directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }])

angular.module('test_task').directive('carouselJ',
['$timeout', 'ItemService', function($timeout, ItemService) {
    return {
        restrict: 'A',
        replace: true,
        template:
        '<div class="jcarousel-wrapper">' +
            '<a href="javascript:void(0)" class="btn btn-primary jcarousel-control-prev" ng-disabled="disableControls"><span class="glyphicon glyphicon-chevron-left"></span></a>' +
            '<div class="jcarousel">' +
                '<ul class="jcarousel-container">' +
                    '<li ng-repeat="item in itemService.getItems()" ng-mouseover="showClose[$index]=true" ng-mouseleave="showClose[$index]=false" data-id="{{item._id}}" style="height:170px;text-align: center;position: relative">' +
                        '<i ng-confirm-click="Are you sure?" confirmed-click="itemService.removeItem(item)" ng-show="showClose[$index]" class="remove-item glyphicon glyphicon-remove"></i>'+
                        '<div star-rating ng-model="item.rating" max="5" on-rating-selected="rateFunction(item, rating)"></div>'+
                        '<div class="contain">'+
                        '<div style="text-align: center"><img style="max-width: 100%;margin: 0 auto;" ng-src="{{item.path}}"></div>'+
                        '<span style="position: absolute;left: 0;bottom: 0;right: 0;">{{item.name}}</span>' +
                        '</div>'+
                    '</li>' +
                '</ul>' +
            '</div>' +
            '<a href="javascript:void(0)" class="btn btn-primary jcarousel-control-next" ng-disabled="disableControls"><span class="glyphicon glyphicon-chevron-right"></span></a>' +
        '</div>',
        link: function(scope, element, attrs) {
            scope.itemService = ItemService;
            scope.rating = [];
            scope.rateFunction = function(item, rating) {
                item.rating = rating;
                ItemService.updateItem(item)
            };

            var container = $(element);
            var jcarousel = $('.jcarousel');
            var previousVisible = [];

            jcarousel.on('jcarousel:reloadend', function () {
                    var carousel = $(this),
                        width = carousel.innerWidth();

                    if (width >= 600) {
                        width = width / 4;
                        if (ItemService.getItems().length<5){
                            scope.disableControls = true;
                            carousel.jcarouselAutoscroll('stop');
                        }
                        else{
                            scope.disableControls = false;
                            carousel.jcarouselAutoscroll('start');
                        }
                    } else if (width >= 350) {
                        if (ItemService.getItems().length<3){
                            scope.disableControls = true;
                            carousel.jcarouselAutoscroll('stop');
                        }
                        else{
                            scope.disableControls = false;
                            carousel.jcarouselAutoscroll('start');
                        }
                        width = width / 2;
                    }
                jcarousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
                }).jcarousel({
                wrap: 'circular'
            });

            jcarousel.swipe({
                swipeLeft: function(event, direction, distance, duration, fingerCount) {
                    jcarousel.jcarousel('scroll', '+=1');
                },
                swipeRight: function(event, direction, distance, duration, fingerCount) {
                    jcarousel.jcarousel('scroll', '-=1');
                }
            });
            jcarousel.jcarouselAutoscroll({
                target: '+=3',
                interval: 5*1000
            });
            jcarousel.on('jcarousel:scrollend', function(event, carousel) {
                var newArr = [];
                _.each(jcarousel.jcarousel('visible'), function(el){
                    newArr.push($(el).data('id'))
                    if (previousVisible.indexOf($(el).data('id'))==-1){
                        _.each(ItemService.getItems(), function(item, n){
                            if (item._id == $(el).data('id')){
                                item.impressions = item.impressions || 0;
                                item.impressions += 1
                                ItemService.updateItem(item)
                            }
                        })
                    }
                });
                previousVisible = newArr;
            });

            $timeout(function(){
                jcarousel.jcarousel('reload');
            },100)

            scope.$watchCollection(
                function(){ return ItemService.getItems()},
                function(newVal) {
                    jcarousel.jcarousel('reload');
                }
            );
            container.find('.jcarousel-control-prev')
                .jcarouselControl({
                    target: '-=1'
                });

            container.find('.jcarousel-control-next')
                .jcarouselControl({
                    target: '+=1'
                });

        }
    };
}])


angular.module('test_task').directive("starRating", function() {
        return {
            restrict : "EA",
            template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
            "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
            "    <i class='glyphicon glyphicon-heart'></i>" + //&#9733
            "  </li>" +
            "</ul>",
            scope : {
                ratingValue : "=ngModel",
                max : "=?", //optional: default is 5
                onRatingSelected : "&?",
                readonly: "=?"
            },
            link : function(scope, elem, attrs) {
                if (scope.max == undefined) { scope.max = 5; }
                function updateStars() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled : i < scope.ratingValue
                        });
                    }
                };
                scope.toggle = function(index) {
                    index = index || 0;
                    scope.ratingValue = index + 1;

                    scope.onRatingSelected({
                        rating: index + 1
                    });
                };
                scope.$watch("ratingValue", function(oldVal, newVal) {
                    updateStars()
                });
            }
        };
    });