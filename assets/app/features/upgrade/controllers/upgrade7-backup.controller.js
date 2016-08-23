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


        vm.downloadPdf = function () {
            var fileName = 'peace.zip';
            var fileURL = 'http://www.colorado.edu/conflict/peace/download/peace.zip';

            var a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = fileURL;
            a.download = fileName;
            a.click();
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

        var zip_file_path = "http://www.colorado.edu/conflict/peace/download/" //put inside "" your server path with file.zip
        var zip_file_name = "peace.zip" //put inside "" file name or something
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.innerHTML = "Download";
        a.href = zip_file_path;
        a.download = zip_file_name;
        a.click();


    }
})();
