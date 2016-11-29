(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('suseFooter', suseFooter);

    function suseFooter() {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/suse-footer/suse-footer.directive.html'
        };
    }
})();
