(/*global Blob URL */
function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:Upgrade7BackupController
     * @description
     * # Upgrade7BackupController
     * This is the controller used on the Upgrade backup page
     */
    angular.module('crowbarApp')
        .controller('Upgrade7BackupController', Upgrade7BackupController);

    Upgrade7BackupController.$inject = ['$translate', '$state', 'upgradeBackupFactory', '$document'];
    // @ngInject
    function Upgrade7BackupController($translate, $state, upgradeBackupFactory, $document) {
        var vm = this;
        vm.backup = {
            completed: false,
            create: createBackup
        };

        function createBackup() {

            upgradeBackupFactory.create()
                .then(
                    // When Backup Data has been created successfully
                    function (backupData) {
                        var headers = backupData.headers(),

                            // Get the filename from the x-filename header or default to "crowbarBackup"
                            filename = headers['x-filename'] || 'crowbarBackup',

                            // Determine the content type from the header
                            contentType = headers['content-type'],

                            backupBlob = new Blob([backupData.data], {type: contentType}),
                            backupObjectUrl = URL.createObjectURL(backupBlob),

                            // Create download a DOM element
                            backupElement = $document[0].createElement('a');

                        // Set anchor properties
                        backupElement.href = backupObjectUrl;
                        backupElement.download = filename;

                        // Trigger the download
                        backupElement.click();
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
