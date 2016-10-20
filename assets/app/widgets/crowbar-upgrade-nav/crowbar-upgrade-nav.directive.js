(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('crowbarUpgradeNav', [crowbarUpgradeNav]);

    function crowbarUpgradeNav() {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/crowbar-upgrade-nav/crowbar-upgrade-nav.directive.html',
            scope: {
                steps: '='
            },
            controller: CrowbarUpgradeNavController,
            controllerAs: 'upgradeNavVm'
        };
    }

    CrowbarUpgradeNavController.$inject = ['$state', 'upgradeFactory'];

    function CrowbarUpgradeNavController($state, upgradeFactory) {
        var vm = this;

        vm.cancelUpgrade = cancelUpgrade;

        function cancelUpgrade() {
            upgradeFactory.cancelUpgrade().then(function(/* response */) {
                $state.go('upgrade-landing');
            });
        }
    }
})();
