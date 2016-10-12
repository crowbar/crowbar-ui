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

        // On page load we need to check to see if the upgrade is already running to set
        // the button status and the update check running
        checkAdminUpgrade();

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
                        // map api response to model
                        vm.adminUpgrade.completed = response.data.upgrade.success;
                        vm.adminUpgrade.running = response.data.upgrade.upgrading;
                    },
                    // In case of failure
                    function (errorResponse) {
                        // Expose the error list to adminUpgrade object
                        // TODO(itxaka): Use the proper error key from the response
                        vm.adminUpgrade.errors = errorResponse.data.errors;
                    }
                ).finally(
                    function () {
                        // schedule another check if not completed yet
                        if (!vm.adminUpgrade.completed && vm.adminUpgrade.running) {
                            $timeout(vm.adminUpgrade.checkAdminUpgrade, 1000); // TODO: make the interval a constant
                        } else if (vm.adminUpgrade.completed && !vm.adminUpgrade.running) {
                            // TODO(itxaka): can translations be done from here instead so
                            // we can update the button text for better UX?
                            vm.finish_text = 'Upgrade done!'
                        }
                    }
                );
        }
    }
})();
