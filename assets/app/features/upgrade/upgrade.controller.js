(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:UpgradeController
     * @description
     * # UpgradeController
     * This is the controller that will be used across the upgrade process.
     */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeController', UpgradeController);

    UpgradeController.$inject = [
        '$scope', '$translate', '$state', 'upgradeStepsFactory',
        'upgradeFactory', 'UPGRADE_LAST_STATE_KEY'
    ];
    // @ngInject
    function UpgradeController(
        $scope,
        $translate,
        $state,
        upgradeStepsFactory,
        upgradeFactory,
        UPGRADE_LAST_STATE_KEY
    ) {
        var vm = this;
        vm.steps = {
            list: [],
            nextStep: upgradeStepsFactory.showNextStep,
            isCurrentStepCompleted: upgradeStepsFactory.isCurrentStepCompleted,
            isLastStep: upgradeStepsFactory.isLastStep,
        };

        vm.cancelUpgrade = cancelUpgrade;

        // Get Steps list from provider
        vm.steps.list = upgradeStepsFactory.steps;
        upgradeStepsFactory.refeshStepsList();

        // Watch for view changes on the Step in order to update the steps list.
        $scope.$on('$viewContentLoaded', upgradeStepsFactory.refeshStepsList);

        /**
         * Trigger cancellation of the upgrade process and go back to landing page
         */
        function cancelUpgrade() {
            upgradeFactory.cancelUpgrade().then(function(/* response */) {
                // clear last page seen by the user
                localStorage.removeItem(UPGRADE_LAST_STATE_KEY);
                // TODO(skazi): in final solution this should redirect to crowbar dashboard
                $state.go('upgrade-landing');
            });
        }
    }
})();
