(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('crowbarCircle', crowbarCircle);

    function crowbarCircle() {
        return {
            restrict: 'E',
            scope: {
                active: '='
            },
            link: function (scope, element) {
                scope.$watch('active', function(newVal) {
                    newVal ? element.addClass('active') : element.removeClass('active');
                });
            }
        };
    }
})();
