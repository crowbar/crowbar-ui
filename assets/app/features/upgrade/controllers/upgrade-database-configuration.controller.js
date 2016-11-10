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
            host: '',
            port: 5432
        };

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
            upgradeFactory.createNewDatabaseServer(vm.databaseForm)
                .then(
                    // success
                    function (/*response*/) {
                        vm.completed = true;
                        upgradeStepsFactory.setCurrentStepCompleted();
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
            upgradeFactory.connectDatabaseServer(vm.databaseForm)
                .then(
                    // success
                    function (/*response*/) {
                        vm.completed = true;
                        upgradeStepsFactory.setCurrentStepCompleted();
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
