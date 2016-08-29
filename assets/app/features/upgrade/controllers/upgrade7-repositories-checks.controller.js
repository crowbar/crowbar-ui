(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:Upgrade7RepositoriesCheckController
    * @description
    * # Upgrade7RepositoriesCheckController
    * This is the controller used on the Upgrade Admin Repo Checks page
    */
    angular.module('crowbarApp')
        .controller('Upgrade7RepositoriesCheckController', Upgrade7RepositoriesCheckController);

    Upgrade7RepositoriesCheckController.$inject = ['$translate', 'upgradeRepoChecksFactory'];
    // @ngInject
    function Upgrade7RepositoriesCheckController($translate, upgradeRepoChecksFactory) {
        var vm = this;
        vm.repoChecks = {
            completed: false,
            valid: false,
            checks: {
                'SLES_12_SP2': false,
                'SLES_12_SP2_Updates': false,
                'SLES_OpenStack_Cloud_7': false,
                'SLES_OpenStack_Cloud_7_Updates': false
            },
            runRepoChecks: runRepoChecks
        };

        /**
         *  Validate Admin Repositories required for Cloud 7 Upgrade
         */
        function runRepoChecks() {

            upgradeRepoChecksFactory.getAdminRepoChecks()
                .then(
                    // In case of success
                    function (repoChecksResponse) {

                        _.merge(vm.repoChecks.checks, repoChecksResponse.data);
                        var repoChecksResult = true;
                        // Update prechecks status
                        _.forEach(vm.repoChecks.checks, function (repoStatus) {
                            if (false === repoStatus) {
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
                });
        }
    }
})();
