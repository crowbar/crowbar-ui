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

    Upgrade7BackupController.$inject = ['$translate', '$state', 'upgradeBackupFactory'];
    // @ngInject
    function Upgrade7BackupController($translate, $state, upgradeBackupFactory) {
        var vm = this;
        vm.backup = {
            completed: false,
            create: createBackup
        };

        /**
         * Move to the next available Step
         */
        function createBackup() {
            upgradeBackupFactory.create()
                .then(
                    // When Backup Data has been created successfully
                    function (backupData) {
                        vm.backup.file = backupData;
                    },
                    // In case of backup error
                    function (error) {
                        vm.backup.error = error;
                    }
                )
                .finally(function () {
                    vm.backup.completed = true;
                });
        }
    }
})();
