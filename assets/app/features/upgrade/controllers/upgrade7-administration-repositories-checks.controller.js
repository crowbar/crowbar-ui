(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:Upgrade7AdministrationRepositoriesCheckController
    * @description
    * # Upgrade7AdministrationRepositoriesCheckController
    * This is the controller used on the Upgrade Administration Repositories Checks page
    */
    angular.module('crowbarApp')
        .controller('Upgrade7AdministrationRepositoriesCheckController',
            Upgrade7AdministrationRepositoriesCheckController);

    Upgrade7AdministrationRepositoriesCheckController.$inject = ['$translate', 'upgradeRepositoriesChecksFactory'];
    // @ngInject
    function Upgrade7AdministrationRepositoriesCheckController($translate, upgradeRepositoriesChecksFactory) {
        var vm = this;
        vm.repoChecks = {
            running: false,
            spinnerVisible: false,
            completed: false,
            valid: false,
            checks: {
                'SLES_12_SP2': {
                    status: false, 
                    label: 'upgrade7.steps.admin-repository-checks.repositories.codes.SLES_12_SP2'
                },
                'SLES_12_SP2_Updates': {
                    status: false, 
                    label: 'upgrade7.steps.admin-repository-checks.repositories.codes.SLES_12_SP2_Updates'
                },
                'SLES_OpenStack_Cloud_7': {
                    status: false, 
                    label: 'upgrade7.steps.admin-repository-checks.repositories.codes.SLES_OpenStack_Cloud_7'
                },
                'SLES_OpenStack_Cloud_7_Updates': {
                    status: false, 
                    label: 'upgrade7.steps.admin-repository-checks.repositories.codes.SLES_OpenStack_Cloud_7_Updates'
                }
            },
            runRepoChecks: runRepoChecks
        };

        /**
         *  Validate Admin Repositories required for Cloud 7 Upgrade
         */
        function runRepoChecks() {
            vm.repoChecks.running = true;

            upgradeRepositoriesChecksFactory.getAdminRepoChecks()
                .then(
                    // In case of success
                    function (repoChecksResponse) {

                        _.forEach(repoChecksResponse.data, function(value, key) {
                            vm.repoChecks.checks[key].status = value;
                        });

                        var repoChecksResult = true;
                        // Update prechecks status

                        _.forEach(vm.repoChecks.checks, function (repoStatus) {
                            if (false === repoStatus.status) {
                                repoChecksResult = false;
                                return false;
                            }
                        });

                        // Update prechecks validity
                        vm.repoChecks.valid = repoChecksResult;
                    },
                    // In case of failure
                    function (errorRepoChecksResponse) {
                        // Expose the error list to repoChecks object
                        vm.repoChecks.errors = errorRepoChecksResponse.data.errors;
                    }
                )
                .finally(function () {
                    // Either on sucess or failure, the repoChecks has been completed.
                    vm.repoChecks.completed = true;
                    vm.repoChecks.running = false;
                });
        }
    }
})();
