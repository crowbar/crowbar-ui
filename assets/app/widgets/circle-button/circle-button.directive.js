(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('circleButton', circleButton);

    function circleButton() {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/circle-button/circle-button.directive.html',
            scope: {
                display: '='
            }
        };
    }
})();
