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

    UpgradeDatabaseConfigurationController.$inject = [
        'upgradeStepsFactory', 'upgradeStatusFactory', 'upgradeFactory',
        'UPGRADE_STEPS', 'UNEXPECTED_ERROR_DATA', ];
    // @ngInject
    function UpgradeDatabaseConfigurationController(
        upgradeStepsFactory, upgradeStatusFactory, upgradeFactory,
        UPGRADE_STEPS, UNEXPECTED_ERROR_DATA
    ) {
        var vm = this;
        vm.databaseForm = {
            username: '',
            password: '',
            host: '',
            port: 5432
        };

        /* eslint-disable max-len */
        // NOTE: patterns based on https://github.com/crowbar/crowbar-client/blob/master/lib/crowbar/client/mixin/database.rb
        vm.patterns = {
            hostname: '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$',
            ipv4: '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$',
            username: '^[a-zA-Z0-9_]*$',
            password: "^[a-zA-Z0-9_$&+,:;=?@#|'<>.^*()%!-]*$",
        };
        /* eslint-enable max-len */
        vm.patterns.host = vm.patterns.hostname + '|' + vm.patterns.ipv4;

        vm.running = false;
        vm.spinnerVisible = false;
        vm.completed = false;

        vm.createServer = createServer;
        vm.connectServer = connectServer;

        activate();

        // functions
        function activate() {
            upgradeStatusFactory.syncStatusFlags(UPGRADE_STEPS.database, vm,
                undefined, upgradeStepsFactory.setCurrentStepCompleted, serverError);
        }

        function createServer() {
            vm.running = true;
            upgradeFactory.createNewDatabaseServer(vm.databaseForm)
                .then(
                    // success
                    function (/*response*/) {
                        vm.completed = true;
                        upgradeStepsFactory.setCurrentStepCompleted();
                    },
                    serverError
                )
                .finally(function () {
                    vm.running = false;
                });
        }

        function connectServer() {
            vm.running = true;
            upgradeFactory.connectDatabaseServer(vm.databaseForm)
                .then(
                    // success
                    function (/*response*/) {
                        vm.completed = true;
                        upgradeStepsFactory.setCurrentStepCompleted();
                    },
                    serverError
                )
                .finally(function () {
                    vm.running = false;
                });
        }

        function serverError(errorResponse) {
            if (angular.isDefined(errorResponse.data.errors)) {
                vm.errors = errorResponse.data;
            } else if (angular.isDefined(errorResponse.data.steps)) {
                vm.errors = { errors: errorResponse.data.steps.database.errors };
            } else {
                vm.errors = UNEXPECTED_ERROR_DATA;
            }
        }
    }
})();
