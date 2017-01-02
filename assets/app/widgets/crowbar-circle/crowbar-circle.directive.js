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
            transclude: true,
            templateUrl: 'app/widgets/crowbar-circle/crowbar-circle.directive.html'
        };
    }
})();
