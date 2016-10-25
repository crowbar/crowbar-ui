(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.upgrade.controller:UpgradeDatabaseConfigurationController
     * @description
     * # UpgradeDatabaseConfigurationController
     * This is the controller used on the Upgrade Database Configuration page
     */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeDatabaseConfigurationController', UpgradeDatabaseConfigurationController);

    UpgradeDatabaseConfigurationController.$inject = ['upgradeStepsFactory', 'upgradeFactory'];
    // @ngInject
    function UpgradeDatabaseConfigurationController(upgradeStepsFactory, upgradeFactory) {
        var vm = this;
        vm.databaseForm = {
            username: '',
            password: '',
            server: '',
            port: 5432
        };
        // Set the current step as completed by default to enable the next button
        // TODO(itxaka): remove this when we have the proper workflow for this step
        upgradeStepsFactory.setCurrentStepCompleted();

        vm.running = false;
        vm.spinnerVisible = false;
        vm.completed = false;
        vm.errors = [];

        vm.createServer = createServer;
        vm.connectServer = connectServer;

        // functions

        function createServer() {
            vm.errors = [];
            vm.running = true;
            vm.spinnerVisible = true;
            upgradeFactory.createNewDatabaseServer(vm.databaseForm)
                .then(
                    // success
                    function (/*response*/) {
                        vm.completed = true;
                    },
                    // error
                    function (errorResponse) {
                        vm.errors = getErrorFromResponse(errorResponse);
                    }
                )
                .finally(function () {
                    vm.running = false;
                });
        }

        function connectServer() {
            vm.errors = [];
            vm.running = true;
            vm.spinnerVisible = true;
            upgradeFactory.connectDatabaseServer(vm.databaseForm)
                .then(
                    // success
                    function (/*response*/) {
                        vm.completed = true;
                    },
                    // error
                    function (errorResponse) {
                        vm.errors = getErrorFromResponse(errorResponse);
                    }
                )
                .finally(function () {
                    vm.running = false;
                });
        }

        function getErrorFromResponse(response) {
            var errors = [];
            _.forEach(response.data, function (obj) {
                if (!obj.success) {
                    errors.push(obj.body.error);
                }
            });
            return errors;
        }
    }
})();
