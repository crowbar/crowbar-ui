(/*global */
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
        'crowbarUtilsFactory',
        '$document',
        'upgradeStepsFactory',
        'upgradeFactory',
        'FileSaver',
        'UNEXPECTED_ERROR_DATA',
    ];
    // @ngInject
    function UpgradeBackupController(
        $translate,
        $state,
        crowbarUtilsFactory,
        $document,
        upgradeStepsFactory,
        upgradeFactory,
        FileSaver,
        UNEXPECTED_ERROR_DATA
    ) {
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

            upgradeFactory.createAdminBackup()
                .then(
                    function (response) {
                        // the ID should always be returned in a successfull response
                        vm.backup.download(response.data.id);
                    },
                    // In case of backup error
                    function (errorResponse) {
                        if (angular.isDefined(errorResponse.data.errors)) {
                            vm.backup.errors = errorResponse.data;
                        } else {
                            vm.backup.errors = UNEXPECTED_ERROR_DATA;
                        }
                        vm.backup.running = false;
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
            crowbarUtilsFactory.getAdminBackup(backupId)
                .then(
                    // When Backup Data has been created successfully
                    function (response) {
                        var headers = response.headers(),

                            // Get the filename from the headers or default to "crowbarBackup"
                            filename = extractFilename(headers) || 'crowbarBackup';

                        FileSaver.saveAs(response.data, filename)

                        upgradeStepsFactory.setCurrentStepCompleted()
                        vm.backup.completed = true;
                    },
                    // In case of download error
                    function (errorResponse) {
                        if (angular.isDefined(errorResponse.data.errors)) {
                            vm.backup.errors = errorResponse.data;
                        } else {
                            vm.backup.errors = UNEXPECTED_ERROR_DATA;
                        }
                    }
                )
                .finally(function () {
                    vm.backup.running = false;
                });
        }

    }
})();
