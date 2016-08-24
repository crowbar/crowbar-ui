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


        function createBackup() {

            var zip_file_path = 'http://www.colorado.edu/conflict/peace/download/peace.zip', 
                zip_file_name = 'peaceNew.zip'

            var anchor = angular.element('<a/>');
            anchor.attr({
                href: zip_file_path,
                download: zip_file_name
            })[0].click();

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
