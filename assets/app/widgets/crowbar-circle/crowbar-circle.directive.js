(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('circleButton', circleButton);

    function circleButton() {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/crowbar-circle/crowbar-circle.directive.html',
            scope: {
                display: '='
            }
        };
    }
})();
