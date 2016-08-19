(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:Upgrade7BackupController
     * @description
     * # Upgrade7BackupController
     * This is the controller used on the Upgrade landing page
     */
    angular.module('crowbarApp')
        .controller('Upgrade7BackupController', Upgrade7BackupController);

    Upgrade7BackupController.$inject = ['$scope', '$translate', '$state'];
    // @ngInject
    function Upgrade7BackupController($scope, $translate, $state) {
        var vm = this;
        vm.beginUpdate = beginUpdate;

        /**
         * Move to the next available Step
         */
        function beginUpdate() {
            // Only move forward if all prechecks has been executed and passed.
            if (!vm.prechecks.completed || vm.prechecks.errors) {
                return;
            }

            $state.go('upgrade7.backup');
        }
    }
})();
