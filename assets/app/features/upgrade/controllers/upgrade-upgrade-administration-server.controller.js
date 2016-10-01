(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:UpgradeUpgradeAdministrationServerController
    * @description
    * # UpgradeUpgradeAdministrationServerController
    * This is the controller used on the Upgrade Admin Server page
    */
    angular.module('crowbarApp')
        .controller('UpgradeUpgradeAdministrationServerController', UpgradeUpgradeAdministrationServerController);

    UpgradeUpgradeAdministrationServerController.$inject = ['$timeout', 'crowbarFactory'];
    // @ngInject
    function UpgradeUpgradeAdministrationServerController($timeout, crowbarFactory) {
        var vm = this;
        vm.adminUpgrade = {
            completed: false,
            running: false,
            spinnerVisible: false,
            beginAdminUpgrade: beginAdminUpgrade,
            // note: this is exposed in vm only to simplify testing
            checkAdminUpgrade: checkAdminUpgrade
        };

        function beginAdminUpgrade() {
            vm.adminUpgrade.running = true;

            crowbarFactory.upgrade()
                .then(
                    // In case of success
                    function (/*response*/) {
                        // start running checkAdminUpgrade at an interval
                        vm.adminUpgrade.checkAdminUpgrade();
                    },
                    // In case of failure
                    function (errorResponse) {
                        vm.adminUpgrade.running = false;
                        // Expose the error list to adminUpgrade object
                        vm.adminUpgrade.errors = errorResponse.data.errors;
                    }
                );
        }

        function checkAdminUpgrade() {
            crowbarFactory.getUpgradeStatus()
                .then(
                    // In case of success
                    function (response) {
                        // TODO: update to match API
                        vm.adminUpgrade.completed = response.data.completed;
                    },
                    // In case of failure
                    function (errorResponse) {
                        // Expose the error list to adminUpgrade object
                        vm.adminUpgrade.errors = errorResponse.data.errors;
                    }
                ).finally(
                    function () {
                        // schedule another check if not completed yet
                        if (!vm.adminUpgrade.completed) {
                            $timeout(vm.adminUpgrade.checkAdminUpgrade, 1000); // TODO: make the interval a constant
                        } else {
                            vm.adminUpgrade.running = false;
                        }
                    }
                );
        }
    }
})();
