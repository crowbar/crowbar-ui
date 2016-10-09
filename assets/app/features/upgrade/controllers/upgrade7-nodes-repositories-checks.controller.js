(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:Upgrade7NodesRepositoriesCheckController
    * @description
    * # Upgrade7NodesRepositoriesCheckController
    * This is the controller used on the Upgrade Nodes Repo Checks page
    */
    angular.module('crowbarApp')
        .controller('Upgrade7NodesRepositoriesCheckController', Upgrade7NodesRepositoriesCheckController);

    Upgrade7NodesRepositoriesCheckController.$inject = [
        '$translate',
        'upgradeFactory',
        'NODES_PRODUCTS_REPO_CHECKS_MAP'
    ];
    // @ngInject
    function Upgrade7NodesRepositoriesCheckController(
        $translate,
        upgradeFactory,
        NODES_PRODUCTS_REPO_CHECKS_MAP
    ) {
        var vm = this;
        vm.repoChecks = {
            completed: false,
            valid: false,
            checks: {
                'SLES12-SP2-Pool': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLES12-SP2-Pool'
                },
                'SLES12-SP2-Updates': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLES12-SP2-Updates'
                },
                'SUSE-OpenStack-Cloud-7-Pool': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SUSE-OpenStack-Cloud-7-Pool'
                },
                'SUSE-OpenStack-Cloud-7-Updates': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SUSE-OpenStack-Cloud-7-Updates'
                },
                'SLE12-SP2-HA-Pool': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLE12-SP2-HA-Pool'
                },
                'SLE12-SP2-HA-Updates': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLE12-SP2-HA-Updates'
                },
                'SUSE-Enterprise-Storage-4-Pool': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SUSE-Enterprise-Storage-4-Pool'
                },
                'SUSE-Enterprise-Storage-4-Updates': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SUSE-Enterprise-Storage-4-Updates'
                }
            },
            runRepoChecks: runRepoChecks,
            running: false,
            spinnerVisible: false
        };

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
                    function (errorRepoChecksResponse) {
                        // Expose the error list to repoChecks object
                        vm.repoChecks.errors = errorRepoChecksResponse.data.errors;
                    }
                )
                .finally(function () {
                    // Either on sucess or failure, the repoChecks has been completed.
                    vm.repoChecks.completed = true;
                    // And the spinner must be stopped and hidden
                    vm.repoChecks.running = false;
                });
        }

        function onSuccessGetNodesRepoChecks (repoChecksResponse) {

            var failingRepositories = [],
                repoChecksResult = true;

            // Iterate over each product check returned from the service
            _.forEach(repoChecksResponse.data, function(productValue, productKey) {

                // Validate a valid check from the service is being updated
                if (NODES_PRODUCTS_REPO_CHECKS_MAP.hasOwnProperty(productKey)) {

                    // Iterate through the repositories list for the product
                    _.forEach(NODES_PRODUCTS_REPO_CHECKS_MAP[productKey], function (repoName) {

                        // If the product is available, then its related repositories should be displayed as passing
                        if (productValue.available) {
                            vm.repoChecks.checks[repoName].status = true;

                        // If not, each/all failing repositories must be identified and marked as failing
                        } else {

                            /* 
                             * If an empty repos details are provided by the service,
                             * add all related repositories as to the failing repositories collection.
                             */
                            if (_.isEmpty(productValue.repos)) {

                                failingRepositories.push(repoName);

                            /* 
                             * If the repos details are provided by the service,
                             * iterate through the repository problems, repository architectures and repositories list
                             */
                            } else {
                                _.forEach(productValue.repos, function (repoProblemType) {
                                    _.forEach(repoProblemType, function (repoArchitectureType) {
                                        _.forEach(repoArchitectureType, function (unavailableRepository) {

                                            // Add the unavailable repository, to the failing repositories collection.
                                            if (!_.includes(failingRepositories, unavailableRepository)) {
                                                failingRepositories.push(unavailableRepository);
                                            }
                                        });
                                    });
                                });
                            }
                        }
                    });
                }
            });

            // Go through the complete repository list and update their status
            _.forEach(vm.repoChecks.checks, function (repositoryValue, repositoryKey) {

                // If the repository is included in the failing repositories collection, mark its status as false
                repositoryValue.status = !_.includes(failingRepositories, repositoryKey);

                // Validate if there is any failing repository check
                repoChecksResult = repoChecksResult && repositoryValue.status;
            });

            // Update the vm valid attribute (Used by the view to enable/disable the check button)
            vm.repoChecks.valid = repoChecksResult;
        }
    }
})();
