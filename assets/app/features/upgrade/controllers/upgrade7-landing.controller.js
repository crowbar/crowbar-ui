(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:Upgrade7LandingController
     * @description
     * # Upgrade7LandingController
     * This is the controller used on the Upgrade landing page
     */
    angular.module('crowbarApp')
        .controller('Upgrade7LandingController', Upgrade7LandingController);

    Upgrade7LandingController.$inject = ['$translate', '$state', 'upgradePrechecksFactory'];
    // @ngInject
    function Upgrade7LandingController($translate, $state, upgradePrechecksFactory) {
        var vm = this;
        vm.beginUpgrade = beginUpgrade;

        vm.prechecks = {
            running: false,
            completed: false,
            valid: false,
            spinnerVisible: false,
            checks: {
                updates_installed: false,
                network_sanity: false,
                high_availability: false,
                free_node_available: false
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

            $state.go('upgrade7.backup');
        }

        /**
         * Pre validation checks
         */
        function runPrechecks() {
            vm.prechecks.running = true;

            upgradePrechecksFactory
                .getAll()
                .then(
                    //Success handler. Al precheck passed successfully:
                    function(prechecksResponse) {

                        _.merge(vm.prechecks.checks, prechecksResponse.data);
                        var prechecksResult = true;
                        // Update prechecks status
                        _.forEach(vm.prechecks.checks, function (checkStatus) {
                            if (false === checkStatus) {
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
