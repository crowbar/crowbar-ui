(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.upgrade.controller:UpgradeLandingController
     * @description
     * # UpgradeLandingController
     * This is the controller used on the Upgrade landing page
     */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeLandingController', UpgradeLandingController);

    UpgradeLandingController.$inject = [
        '$translate',
        '$state',
        'upgradeFactory',
        'crowbarFactory',
        'ADDONS_PRECHECK_MAP'
    ];
    // @ngInject
    function UpgradeLandingController($translate, $state, upgradeFactory, crowbarFactory, ADDONS_PRECHECK_MAP) {
        var vm = this,
            optionalPrechecks = {
                ceph_healthy: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.storage'
                },
                clusters_healthy: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.high_availability'
                }
            };

        vm.beginUpgrade = beginUpgrade;

        vm.prechecks = {
            running: false,
            completed: false,
            valid: false,
            spinnerVisible: false,
            checks: {
                maintenance_updates_installed: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.updates_installed'
                },
                network_checks: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.network_sanity'
                },
                compute_resources_available: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.free_node_available'
                }
            },
            runPrechecks: runPrechecks
        };

        activate();

        /**
         * Check installed add-ons on page load.
         */
        function activate() {
            crowbarFactory.getEntity().then(function (response) {
                _.forEach(response.data.addons, function (addon) {
                    _.forEach(ADDONS_PRECHECK_MAP[addon], function (precheck) {
                        vm.prechecks.checks[precheck] = optionalPrechecks[precheck];
                    });
                });
            });
        }

        /**
         * Move to the next available Step
         */
        function beginUpgrade() {
            // Only move forward if all prechecks has been executed and passed.
            if (!vm.prechecks.completed || !vm.prechecks.valid) {
                return;
            }

            upgradeFactory.prepareNodes().then(
                function (/* response */) {
                    $state.go('upgrade.backup');
                },
                function (errorResponse) {
                    // Expose the error list to prechecks object
                    vm.prechecks.errors = errorResponse.data.errors;
                }
            );
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
                    function(response) {

                        _.forEach(response.data.checks, function(value, key) {
                            // skip unknown checks returned from backend
                            if (key in vm.prechecks.checks) {
                                vm.prechecks.checks[key].status = value.passed;
                            }
                        });

                        // Update prechecks validity
                        // TODO: handle disruptive vs non-disruptive properly in the new design
                        vm.prechecks.valid = (response.data.best_method != 'none');
                    },
                    //Failure handler:
                    function(errorResponse) {
                        // Expose the error list to prechecks object
                        vm.prechecks.errors = errorResponse.data.errors;
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
