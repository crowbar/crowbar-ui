(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:UpgradeLandingController
     * @description
     * # UpgradeLandingController
     * This is the controller used on the Upgrade landing page
     */
    angular.module('crowbarApp')
        .controller('UpgradeLandingController', UpgradeLandingController);

    UpgradeLandingController.$inject = ['$translate', '$state', 'upgradeFactory'];
    // @ngInject
    function UpgradeLandingController($translate, $state, upgradeFactory) {
        var vm = this;
        vm.beginUpgrade = beginUpgrade;

        vm.prechecks = {
            running: false,
            completed: false,
            valid: false,
            spinnerVisible: false,
            checks: {
                updates_installed: {
                    status: false, 
                    label: 'upgrade.steps.landing.prechecks.codes.updates_installed'
                },
                network_sanity: {
                    status: false, 
                    label: 'upgrade.steps.landing.prechecks.codes.network_sanity'
                },
                high_availability: {
                    status: false, 
                    label: 'upgrade.steps.landing.prechecks.codes.high_availability'
                },
                free_node_available: {
                    status: false, 
                    label: 'upgrade.steps.landing.prechecks.codes.free_node_available'
                }
            },
            runPrechecks: runPrechecks
        };

        /**
         * Move to the next available Step
         */
        function beginUpgrade() {
            // Only move forward if all prechecks has been executed and passed.
            if (!vm.prechecks.completed || !vm.prechecks.valid) {
                return;
            }

            $state.go('upgrade.backup');
        }

        /**
         * Pre validation checks
         */
        function runPrechecks() {
            vm.prechecks.running = true;

            upgradeFactory
                .getPreliminaryChecks()
                .then(
                    //Success handler. Al precheck passed successfully:
                    function(prechecksResponse) { 

                        _.forEach(prechecksResponse.data, function(value, key) {
                            vm.prechecks.checks[key].status = value;
                        });

                        var prechecksResult = true;
                        // Update prechecks status

                        _.forEach(vm.prechecks.checks, function (checkStatus) {
                            
                            if (false === checkStatus.status) {
                                prechecksResult = false;
                                return false;
                            }

                        });

                        
                        // Update prechecks validity
                        vm.prechecks.valid = prechecksResult;
                    },
                    //Failure handler:
                    function(errorPrechecksResponse) {

                        // Expose the error list to prechecks object
                        vm.prechecks.errors = errorPrechecksResponse.data.errors;
                    }
                ).finally(
                    function() {
                        // Either on sucess or failure, the prechecks has been completed.
                        vm.prechecks.completed = true;
                        vm.prechecks.running = false;
                    }
                );

        }
    }
})();
