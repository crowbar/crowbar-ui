(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('circleButton', circleButton);

    function circleButton() {
        return {
            restrict: 'E'
        };
    }
})();
