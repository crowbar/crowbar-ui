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
        .controller('UpgradeController', UpgradeController)
        .controller('CancelController', CancelController);

    UpgradeController.$inject = [
        '$scope',
        '$translate',
        '$uibModal',
        'upgradeStepsFactory',
    ];
    // @ngInject
    function UpgradeController(
        $scope,
        $translate,
        $uibModal,
        upgradeStepsFactory
    ) {
        var vm = this;
        vm.steps = {
            list: [],
            nextStep: upgradeStepsFactory.showNextStep,
            isCurrentStepCompleted: upgradeStepsFactory.isCurrentStepCompleted,
            isLastStep: upgradeStepsFactory.isLastStep,
            isCancelAllowed: upgradeStepsFactory.isCancelAllowed,
            isUpgradeAll: upgradeStepsFactory.isUpgradeAll,
            getUpgradeStep: upgradeStepsFactory.getUpgradeStep,
        };

        vm.confirmCancel = confirmCancel;

        // Get Steps list from provider
        vm.steps.list = upgradeStepsFactory.steps;
        upgradeStepsFactory.refeshStepsList();

        // Watch for view changes on the Step in order to update the steps list.
        $scope.$on('$viewContentLoaded', upgradeStepsFactory.refeshStepsList);

        function confirmCancel() {
            $uibModal.open({
                templateUrl: 'app/features/upgrade/templates/cancel-dialog.html',
                controller: 'CancelController',
                controllerAs: 'cancelVm',
            });
        }

    }

    CancelController.$inject = [
        '$uibModalInstance',
        '$scope',
        '$window',
        'upgradeFactory',
        'upgradeStepsFactory',
        'UPGRADE_LAST_STATE_KEY',
    ];
    // @ngInject
    function CancelController(
        $uibModalInstance,
        $scope,
        $window,
        upgradeFactory,
        upgradeStepsFactory,
        UPGRADE_LAST_STATE_KEY
    ) {
        var vm = this;
        vm.cancelUpgrade = cancelUpgrade;
        vm.dismiss = $uibModalInstance.dismiss;
        vm.running = false;

        activate();

        function activate() {
            // block closing of modal if the process is still running
            $scope.$on('modal.closing', function(event/*, reason, closed*/) {
                if (vm.running) {
                    event.preventDefault();
                }
            });
        }
        /**
         * Trigger cancellation of the upgrade process and go back to landing page
         */
        function cancelUpgrade() {
            vm.running = true;
            upgradeFactory.cancelUpgrade().then(
                function(/* response */) {
                    vm.running = false;
                    $uibModalInstance.dismiss();
                    // reset steps state
                    upgradeStepsFactory.reset();
                    // clear last page seen by the user
                    localStorage.removeItem(UPGRADE_LAST_STATE_KEY);
                    // go to dashboard
                    $window.location.href = '/';
                },
                function(/* errorResponse */) {
                    vm.running = false;
                }
            );
        }
    }
})();
