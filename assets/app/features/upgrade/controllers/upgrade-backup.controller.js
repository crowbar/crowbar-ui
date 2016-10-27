(/*global Blob URL */
function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.upgrade.controller:UpgradeBackupController
     * @description
     * # UpgradeBackupController
     * This is the controller used on the Upgrade backup page
     */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeBackupController', UpgradeBackupController);

    UpgradeBackupController.$inject = [
        '$translate',
        '$state',
        'crowbarBackupFactory',
        '$document',
        'upgradeStepsFactory'
    ];
    // @ngInject
    function UpgradeBackupController($translate, $state, crowbarBackupFactory, $document, upgradeStepsFactory) {
        var vm = this;
        vm.backup = {
            running: false,
            completed: false,
            create: createBackup,
            download: downloadBackup,
            spinnerVisible: false
        };

        function createBackup() {
            vm.backup.running = true;

            crowbarBackupFactory.create()
                .then(
                    function (response) {
                        // the ID should always be returned in a successfull response
                        vm.backup.download(response.data.id);
                    },
                    // In case of backup error
                    function (errorResponse) {
                        vm.backup.errors = errorResponse.data.errors;
                        vm.backup.running = false;
                        vm.backup.completed = true;
                    }
                );
        }

        // extracts file name from content-disposition header returned from the server
        // if the name can't be extracted, undefined is returned
        function extractFilename(headers) {
            try {
                var value = headers['content-disposition']
                // content-disposition header format: 'attachment; filename="some-file-name.ext"'
                value = value.split(';')[1].split('=')[1].replace(/"/g, '');
                return value;
            } catch (error) {
                return undefined;
            }
        }

        function downloadBackup(backupId) {
            crowbarBackupFactory.get(backupId)
                .then(
                    // When Backup Data has been created successfully
                    function (response) {
                        var headers = response.headers(),

                            // Get the filename from the headers or default to "crowbarBackup"
                            filename = extractFilename(headers) || 'crowbarBackup',

                            // Determine the content type from the header
                            contentType = headers['content-type'],

                            backupBlob = new Blob([response.data], {type: contentType}),
                            backupObjectUrl = URL.createObjectURL(backupBlob),

                            // Create download a DOM element
                            backupElement = $document[0].createElement('a');

                        // Set anchor properties
                        backupElement.href = backupObjectUrl;
                        backupElement.download = filename;

                        // Trigger the download
                        backupElement.click();
                    },
                    // In case of download error
                    function (errorResponse) {
                        vm.backup.errors = errorResponse.data.errors;
                    }
                )
                .finally(function () {
                    vm.backup.running = false;
                    vm.backup.completed = true;
                    upgradeStepsFactory.setCurrentStepCompleted()
                });
        }

    }
})();
