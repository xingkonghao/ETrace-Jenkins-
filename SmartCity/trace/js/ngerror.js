(function(angular){

    angular.module('ngError', ['ng'])
    
    .directive('ngError', ['$parse', function($parse){

        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['ngError']);

                return function(scope, element, attr) {
                    element.on('error', function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };

            }
        };

    }]) .directive('ngLoad', ['$parse', function($parse){

        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['ngLoad']);

                return function(scope, element, attr) {
                    element.on('load', function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };

            }
        };

    }]).directive('ngScroll', ['$parse', function($parse){

        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['ngScroll']);

                return function(scope, element, attr) {
                    element.on('scroll', function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };

            }
        };

    }]).directive('ngTouchstart', ['$parse', function($parse){

        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['ngTouchstart']);

                return function(scope, element, attr) {
                    element.on('touchstart', function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };

            }
        };

    }]).directive('ngTouchend', ['$parse', function($parse){

        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['ngTouchend']);

                return function(scope, element, attr) {
                    element.on('touchend', function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };

            }
        };

    }]);

    
})(angular);