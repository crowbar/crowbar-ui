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
        'UPGRADE_MODES',
        'UNEXPECTED_ERROR_DATA',
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
        UPGRADE_MODES,
        UNEXPECTED_ERROR_DATA
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
        vm.continueNormal = continueNormal;

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
                cloud_healthy: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.cloud_health'
                },
                cloud_deployment: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.cloud_deployment'
                },
                compute_status: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.compute_status'
                },
                openstack_check: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.openstack_check'
                },
                ha_configured: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.ha_configured'
                },
            },
            runPrechecks: runPrechecks
        };

        vm.mode = {
            active: false,
            type: UPGRADE_MODES.none,
            valid: false
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

            // skz: There is no syncing of 'prechecks' part as there's no easy way to restore complete checks state
            // without running the checks again so it's better to leave this to the user.
            upgradeStatusFactory.syncStatusFlags(UPGRADE_STEPS.prepare, vm.prepare, waitForPrepareToEnd);
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
                    if (angular.isDefined(errorResponse.data.errors)) {
                        vm.errors = errorResponse.data;
                    } else {
                        vm.errors = UNEXPECTED_ERROR_DATA;
                    }
                }
            );
        }

        /**
         * Start polling for status and wait until prepare step is finished
         */
        function waitForPrepareToEnd() {
            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.prepare,
                PREPARE_TIMEOUT_INTERVAL,
                function (/*response*/) {
                    vm.prepare.running = false;
                    $state.go('upgrade.backup');
                },
                function (errorResponse) {
                    vm.prepare.running = false;

                    if (angular.isDefined(errorResponse.data.errors)) {
                        vm.errors = errorResponse.data;
                    } else if (angular.isDefined(errorResponse.data.steps)) {
                        vm.errors = { errors: errorResponse.data.steps.prepare.errors };
                    } else {
                        vm.errors = UNEXPECTED_ERROR_DATA;
                    }
                }
            );
        }

        /**
         * Pre validation checks
         */
        function runPrechecks() {
            // Clean other checks in case we re-run the prechecks
            vm.mode.valid = false;
            vm.mode.type = UPGRADE_MODES.none;
            vm.mode.active = false;
            vm.prechecks.running = true;

            upgradeFactory
                .getPreliminaryChecks()
                .then(
                    //Success handler. All precheck passed successfully:
                    function(response) {
                        // Store the upgrade best method
                        vm.mode.type = response.data.best_method;

                        var checksErrors = {};

                        _.forEach(response.data.checks, function(check, checkKey) {
                            // skip unknown checks returned from backend
                            if (checkKey in vm.prechecks.checks) {
                                vm.prechecks.checks[checkKey].status = check.passed;
                                vm.prechecks.checks[checkKey].optional = !check.required;
                                if (check.errors) {
                                    _.merge(checksErrors, check.errors);
                                }
                            }
                        });

                        vm.prechecks.valid = (vm.mode.type !== UPGRADE_MODES.none);

                        // expose all errors
                        if (!_.isEmpty(checksErrors)) {
                            vm.errors = { title: 'prechecks', errors: checksErrors };
                        }

                        updateMode();
                    },
                    //Failure handler:
                    function(errorResponse) {
                        if (angular.isDefined(errorResponse.data.errors)) {
                            vm.errors = errorResponse.data;
                        } else {
                            vm.errors = UNEXPECTED_ERROR_DATA;
                        }
                    }
                ).finally(
                    function() {
                        // Either on sucess or failure, the prechecks has been completed.
                        vm.prechecks.completed = true;
                        vm.prechecks.running = false;
                    }
                );

        }
        /**
        * Sets the type of mode depending on the api response
        */
        function updateMode() {
            // If all prechecks are ok, move to the next step
            vm.mode.active = vm.prechecks.valid;
            if (vm.mode.type === UPGRADE_MODES.nondisruptive) {
                vm.mode.valid = true;
            }
        }

        /**
        * Sets the mode to valid when the continue button is clicked
        */
        function continueNormal() {
            vm.mode.valid = true;
        }
    }
})();
