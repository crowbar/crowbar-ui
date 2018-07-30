(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('crowbarUpgradeNav', [crowbarUpgradeNav]);

    var navController = function ($scope, $window, upgradeFactory) {
        $scope.finish = function() {
            $window.location.href = '/';
        }
        $scope.goToDashboard = function() {
            upgradeFactory.setPostponeComputeNodes();
            $window.location.href = '/';
        };
    };

    navController.$inject = ['$scope', '$window', 'upgradeFactory'];

    function crowbarUpgradeNav() {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/crowbar-upgrade-nav/crowbar-upgrade-nav.directive.html',
            scope: {
                steps: '=',
                onCancel: '&',
            },
            controller: navController,
        };
    }
})();
