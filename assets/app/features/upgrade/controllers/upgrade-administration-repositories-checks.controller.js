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
        '$translate', 'upgradeFactory', 'upgradeStepsFactory', 'UNEXPECTED_ERROR_DATA'
    ];
    // @ngInject
    function UpgradeAdministrationRepositoriesCheckController(
        $translate, upgradeFactory, upgradeStepsFactorym, UNEXPECTED_ERROR_DATA
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
                    label: 'upgrade.repositories.codes.SLES12-SP2-Pool'
                },
                'SLES12-SP2-Updates': {
                    status: false,
                    label: 'upgrade.repositories.codes.SLES12-SP2-Updates'
                },
                'SUSE-OpenStack-Cloud-7-Pool': {
                    status: false,
                    label: 'upgrade.repositories.codes.SUSE-OpenStack-Cloud-7-Pool'
                },
                'SUSE-OpenStack-Cloud-7-Updates': {
                    status: false,
                    label: 'upgrade.repositories.codes.SUSE-OpenStack-Cloud-7-Updates'
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
                        var repoErrors = [];
                        // Iterate over our map
                        _.forEach(repoChecksResponse.data, function (productData/*, product*/) {
                            _.forEach(productData.repos, function(repo) {
                                if (vm.repoChecks.checks.hasOwnProperty(repo)) {
                                    vm.repoChecks.checks[repo].status = productData.available
                                }
                            });
                        });
                        // Iterate over the checks to determine the validity of the step
                        vm.repoChecks.valid = Object.keys(vm.repoChecks.checks).every(function(k) {
                            if (vm.repoChecks.checks[k].status === false) {
                                repoErrors.push($translate.instant(vm.repoChecks.checks[k].label))
                            }
                            return vm.repoChecks.checks[k].status === true
                        });

                        // if all the repos are ok, complete the step
                        if (vm.repoChecks.valid) {
                            upgradeStepsFactory.setCurrentStepCompleted();
                        }
                    },
                    // In case of failure
                    function (errorResponse) {
                        if (angular.isDefined(errorResponse.data.errors)) {
                            vm.errors = errorResponse.data;
                        } else {
                            vm.errors = UNEXPECTED_ERROR_DATA;
                        }
                    }
                )
                .finally(function () {
                    // Either on success or failure, the repoChecks has been completed.
                    vm.repoChecks.completed = true;
                    vm.repoChecks.running = false;
                });
        }
    }
})();
