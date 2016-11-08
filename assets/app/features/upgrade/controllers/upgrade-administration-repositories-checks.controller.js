(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.upgrade.controller:UpgradeAdministrationRepositoriesCheckController
    * @description
    * # UpgradeAdministrationRepositoriesCheckController
    * This is the controller used on the Upgrade Administration Repositories Checks page
    */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeAdministrationRepositoriesCheckController',
            UpgradeAdministrationRepositoriesCheckController);

    UpgradeAdministrationRepositoriesCheckController.$inject = [
        '$translate', 'upgradeFactory', 'PRODUCTS_REPO_CHECKS_MAP', 'upgradeStepsFactory'
    ];
    // @ngInject
    function UpgradeAdministrationRepositoriesCheckController(
        $translate, upgradeFactory, PRODUCTS_REPO_CHECKS_MAP, upgradeStepsFactory
    ) {
        var vm = this;
        vm.repoChecks = {
            running: false,
            spinnerVisible: false,
            completed: false,
            valid: false,
            checks: {
                'SLES12-SP2-Pool': {
                    status: false,
                    label: 'upgrade.steps.admin-repository-checks.repositories.codes.SLES12-SP2-Pool'
                },
                'SLES12-SP2-Updates': {
                    status: false,
                    label: 'upgrade.steps.admin-repository-checks.repositories.codes.SLES12-SP2-Updates'
                },
                'SUSE-OpenStack-Cloud-7-Pool': {
                    status: false,
                    label: 'upgrade.steps.admin-repository-checks.repositories.codes.SUSE-OpenStack-Cloud-7-Pool'
                },
                'SUSE-OpenStack-Cloud-7-Updates': {
                    status: false,
                    label: 'upgrade.steps.admin-repository-checks.repositories.codes.SUSE-OpenStack-Cloud-7-Updates'
                }
            },
            runRepoChecks: runRepoChecks
        };

        /**
         *  Validate Admin Repositories required for Cloud 7 Upgrade
         */
        function runRepoChecks() {
            vm.repoChecks.running = true;

            upgradeFactory.getRepositoriesChecks()
                .then(
                    // In case of success
                    function (repoChecksResponse) {
                        // Iterate over our map
                        _.forEach(PRODUCTS_REPO_CHECKS_MAP, function (repos, type) {
                            // Admin repochecks only checks for os or openstack repos
                            if(type == 'os' || type == 'openstack') {
                                _.forEach(repos, function(repo) {
                                    vm.repoChecks.checks[repo].status = repoChecksResponse.data[type].available
                                });
                            }
                        });
                        // Iterate over the checks to determine the validity of the step
                        vm.repoChecks.valid = Object.keys(vm.repoChecks.checks).every(function(k) {
                            return vm.repoChecks.checks[k].status === true
                        });

                        // if all the repos are ok, complete the step
                        if (vm.repoChecks.valid) {
                            upgradeStepsFactory.setCurrentStepCompleted();
                        }
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
