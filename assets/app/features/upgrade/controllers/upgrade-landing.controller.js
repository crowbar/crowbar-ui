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
        'upgradeStatusFactory',
        'crowbarFactory',
        'ADDONS_PRECHECK_MAP',
        'PREPARE_TIMEOUT_INTERVAL',
        'UPGRADE_STEPS',
        'STEP_STATES'
    ];
    // @ngInject
    function UpgradeLandingController(
        $translate,
        $state,
        upgradeFactory,
        upgradeStatusFactory,
        crowbarFactory,
        ADDONS_PRECHECK_MAP,
        PREPARE_TIMEOUT_INTERVAL,
        UPGRADE_STEPS,
        STEP_STATES
    ) {
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

        vm.prepare = {
            running: false,
            spinnerVisible: false
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

            // adjust UI state to backend status
            upgradeFactory.getStatus()
                .then(
                    function (response) {
                        // skz: This part is disabled on purpose. There's no easy way to restore complete checks state
                        // without running the checks again so it's better to leave this to the user.
                        //vm.prechecks.running = response.data.steps.upgrade_prechecks.status === STEP_STATES.running;
                        //vm.prechecks.completed = response.data.steps.upgrade_prechecks.status === STEP_STATES.passed;

                        vm.prepare.running = response.data.steps.upgrade_prepare.status === STEP_STATES.running;
                        vm.prepare.completed = response.data.steps.upgrade_prepare.status === STEP_STATES.passed;

                        if (vm.prepare.running) {
                            waitForPrepareToEnd();
                        }
                    }
                );
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
                    vm.prepare.running = true;
                    waitForPrepareToEnd();
                },
                function (errorResponse) {
                    // Expose the error list to prechecks object
                    vm.prechecks.errors = errorResponse.data.errors;
                }
            );
        }

        /**
         * Start polling for status and wait until prepare step is finished
         */
        function waitForPrepareToEnd() {
            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.upgrade_prepare,
                function (/*response*/) {
                    vm.prepare.running = false;
                    $state.go('upgrade.backup');
                },
                function (errorResponse) {
                    vm.prepare.running = false;
                    // Expose the error list to prechecks object
                    vm.prechecks.errors = errorResponse.data.errors;
                },
                PREPARE_TIMEOUT_INTERVAL
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
