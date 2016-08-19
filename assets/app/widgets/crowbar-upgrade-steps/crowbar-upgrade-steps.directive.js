(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('crowbarUpgradeSteps', [crowbarUpgradeSteps]);

    function crowbarUpgradeSteps() {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/crowbar-upgrade-steps/crowbar-upgrade-steps.directive.html',
            scope: {
                steps: '='
            }
        };
    }
})();
