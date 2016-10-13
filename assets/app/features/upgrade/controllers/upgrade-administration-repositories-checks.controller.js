(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:UpgradeAdministrationRepositoriesCheckController
    * @description
    * # UpgradeAdministrationRepositoriesCheckController
    * This is the controller used on the Upgrade Administration Repositories Checks page
    */
    angular.module('crowbarApp')
        .controller('UpgradeAdministrationRepositoriesCheckController',
            UpgradeAdministrationRepositoriesCheckController);

    UpgradeAdministrationRepositoriesCheckController.$inject = [
        '$translate', 'crowbarFactory', 'ADMIN_REPO_CHECKS_MAP'
    ];
    // @ngInject
    function UpgradeAdministrationRepositoriesCheckController($translate, crowbarFactory, ADMIN_REPO_CHECKS_MAP) {
        var vm = this;
        vm.repoChecks = {
            running: false,
            spinnerVisible: false,
            completed: false,
            valid: false,
            checks: {
                'SLES-12-SP2': {
                    status: false,
                    label: 'upgrade.steps.admin-repository-checks.repositories.codes.SLES_12_SP2'
                },
                'SLES-12-SP2-Updates': {
                    status: false,
                    label: 'upgrade.steps.admin-repository-checks.repositories.codes.SLES_12_SP2_Updates'
                },
                'SLES-OpenStack-Cloud-7': {
                    status: false,
                    label: 'upgrade.steps.admin-repository-checks.repositories.codes.SLES_OpenStack_Cloud_7'
                },
                'SLES-OpenStack-Cloud-7-Updates': {
                    status: false,
                    label: 'upgrade.steps.admin-repository-checks.repositories.codes.SLES_OpenStack_Cloud_7_Updates'
                }
            },
            runRepoChecks: runRepoChecks
        };

        /**
         *  Validate Admin Repositories required for Cloud 7 Upgrade
         */
        function runRepoChecks() {
            vm.repoChecks.running = true;

            crowbarFactory.getRepositoriesChecks()
                .then(
                    // In case of success
                    function (repoChecksResponse) {
                        // Iterate over our map
                        _.forEach(ADMIN_REPO_CHECKS_MAP, function (repos, type) {
                            _.forEach(repos, function(repo) {
                                vm.repoChecks.checks[repo].status = repoChecksResponse.data[type]['available']
                            });
                        });
                        // Iterate over the checks to determine the validity of the step
                        vm.repoChecks.valid = Object.keys(vm.repoChecks.checks).every(function(k) {
                            return vm.repoChecks.checks[k].status === true
                        });
                    },
                    // In case of failure
                    function (errorRepoChecksResponse) {
                        // Expose the error list to repoChecks object
                        // TODO(itxaka): Check the proper error response when the card is done
                        // https://trello.com/c/chzg85j4/142-3-s49p7-error-reporting-on-crowbar-level
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
