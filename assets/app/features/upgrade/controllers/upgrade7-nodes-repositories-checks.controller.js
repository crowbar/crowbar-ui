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

    Upgrade7NodesRepositoriesCheckController.$inject = ['$translate', 'upgradeRepoChecksFactory'];
    // @ngInject
    function Upgrade7NodesRepositoriesCheckController($translate, upgradeRepoChecksFactory) {
        var vm = this;
        vm.repoChecks = {
            completed: false,
            valid: false,
            checks: {
                'SLES_12_SP2': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLES_12_SP2'
                },
                'SLES_12_SP2_Updates': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLES_12_SP2_Updates'
                },
                'SLES_OpenStack_Cloud_7': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLES_OpenStack_Cloud_7'
                },
                'SLES_OpenStack_Cloud_7_Updates': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLES_OpenStack_Cloud_7_Updates'
                },
                'SLE_HA_12_SP2': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLE_HA_12_SP2'
                },
                'SLE_HA_12_SP2_Updates': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SLE_HA_12_SP2_Updates'
                },
                'SUSE_Enterprise_Storage_4': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SUSE_Enterprise_Storage_4'
                },
                'SUSE_Enterprise_Storage_4_Updates': {
                    status: false, 
                    label: 'upgrade7.steps.nodes-repository-checks.repositories.codes.SUSE_Enterprise_Storage_4_Updates'
                }
            },
            runRepoChecks: runRepoChecks
        };

        /**
         *  Validate Nodes Repositories required for Cloud 7 Upgrade
         */
        function runRepoChecks() {

            upgradeRepoChecksFactory.getNodesRepoChecks()
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
                });
        }
    }
})();
