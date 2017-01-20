(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.upgrade.controller:UpgradeNodesRepositoriesCheckController
    * @description
    * # UpgradeNodesRepositoriesCheckController
    * This is the controller used on the Upgrade Nodes Repo Checks page
    */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeNodesRepositoriesCheckController', UpgradeNodesRepositoriesCheckController);

    UpgradeNodesRepositoriesCheckController.$inject = [
        '$translate',
        'upgradeFactory',
        'crowbarFactory',
        'UNEXPECTED_ERROR_DATA',
        'upgradeStepsFactory'
    ];
    // @ngInject
    function UpgradeNodesRepositoriesCheckController(
        $translate,
        upgradeFactory,
        crowbarFactory,
        UNEXPECTED_ERROR_DATA,
        upgradeStepsFactory
    ) {
        var vm = this,
            addonsRepos = {
                'ha': {
                    'SLE12-SP2-HA-Pool': {
                        status: false,
                        label: 'upgrade.repositories.codes.SLE12-SP2-HA-Pool'
                    },
                    'SLE12-SP2-HA-Updates': {
                        status: false,
                        label: 'upgrade.repositories.codes.SLE12-SP2-HA-Updates'
                    },
                },
                'ceph': {
                    'SUSE-Enterprise-Storage-4-Pool': {
                        status: false,
                        label: 'upgrade.repositories.codes.SUSE-Enterprise-Storage-4-Pool'
                    },
                    'SUSE-Enterprise-Storage-4-Updates': {
                        status: false,
                        label: 'upgrade.repositories.codes.SUSE-Enterprise-Storage-4-Updates'
                    },
                },
            };
        vm.repoChecks = {
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
            runRepoChecks: runRepoChecks,
            running: false,
            spinnerVisible: false
        };

        activate();

        /**
         * Activation of the Nodes and AddOns Repository checks page
         */
        function activate() {
            crowbarFactory.getEntity().then(function (entityResponse) {
                if (! _.isEmpty(entityResponse.data.addons)) {
                    _.forEach(entityResponse.data.addons, function (addon) {
                        vm.repoChecks.checks = _.merge(vm.repoChecks.checks, addonsRepos[addon]);
                    });
                }
            });
        }
        /**
         *  Validate Nodes Repositories required for Cloud 7 Upgrade
         */
        function runRepoChecks() {
            vm.repoChecks.running = true;

            upgradeFactory.getNodesRepoChecks()
                .then(
                    // In case of success
                    onSuccessGetNodesRepoChecks,
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
                    // TODO(skazi): marking completed=true on general errors causes all checks to turn red.
                    // Either on sucess or failure, the repoChecks has been completed.
                    vm.repoChecks.completed = true;
                    // And the spinner must be stopped and hidden
                    vm.repoChecks.running = false;
                });
        }

        function onSuccessGetNodesRepoChecks (repoChecksResponse) {

            var repoAvailable = {},
                repoChecksResult = true;

            // Iterate over each product check returned from the service
            _.forEach(repoChecksResponse.data, function(productValue/*, productKey*/) {
                // Iterate through the repositories list for the product
                _.forEach(productValue.repos, function (repoName) {
                    // assume the best and add new/unseen repos with 'available' status
                    if (angular.isUndefined(repoAvailable[repoName])) {
                        repoAvailable[repoName] = true;
                    }
                });
                // Iterate through the repository problems, repository architectures and repositories list
                _.forEach(productValue.errors, function (repoProblemType) {
                    _.forEach(repoProblemType, function (repoArchitectureType) {
                        _.forEach(repoArchitectureType, function (unavailableRepository) {
                            // mark unavailable repositories
                            repoAvailable[unavailableRepository] = false;
                        });
                    });
                });
            });

            // Go through the complete repository list and update their status
            _.forEach(vm.repoChecks.checks, function (repositoryValue, repositoryKey) {

                // Update status based on collected availability data
                repositoryValue.status = repoAvailable[repositoryKey] || false;

                // Validate if there is any failing repository check
                repoChecksResult = repoChecksResult && repositoryValue.status;
            });

            // Update the vm valid attribute (Used by the view to enable/disable the check button)
            vm.repoChecks.valid = repoChecksResult;

            // if all repos are correct set the current step as completed
            if (vm.repoChecks.valid) {
                upgradeStepsFactory.setCurrentStepCompleted();
            }
        }
    }
})();
