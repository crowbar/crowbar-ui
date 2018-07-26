(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:UpgradeNodesController
    * @description
    * # UpgradeNodesController
    * This is the controller used on the Upgrade Nodes step
    */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeNodesController', UpgradeNodesController);

    UpgradeNodesController.$inject = [
        'upgradeFactory',
        'upgradeStatusFactory',
        'upgradeStepsFactory',
        'UPGRADE_STEPS',
        'UPGRADE_STEP_STATES',
        'NODE_UPGRADE_STEPS',
        'NODE_UPGRADE_TIMEOUT_INTERVAL',
        'RESUME_UPGRADE_TIMEOUT_INTERVAL',
        'UNEXPECTED_ERROR_DATA',
        '$timeout'
    ];
    // @ngInject
    function UpgradeNodesController(
        upgradeFactory,
        upgradeStatusFactory,
        upgradeStepsFactory,
        UPGRADE_STEPS,
        UPGRADE_STEP_STATES,
        NODE_UPGRADE_STEPS,
        NODE_UPGRADE_TIMEOUT_INTERVAL,
        RESUME_UPGRADE_TIMEOUT_INTERVAL,
        UNEXPECTED_ERROR_DATA,
        $timeout
    ) {
        var vm = this;

        vm.nodesUpgrade = {
            beginUpgradeNodes: beginUpgradeNodes,
            currentNodes: [],
            currentAction: null,
            maxDisplayNodes: 4,
            upgradedNodes: 0,
            totalNodes: 0,
            completed: false,
            running: false,
            spinnerVisible: false,
            subStep: null,
            subStepStatus: null,
            computeUpgradeEnabled: null,
            getUpgradeStep: upgradeStepsFactory.getUpgradeStep,
            computeNodesPostponedFlag: false,
            toggleComputeUpgrade: toggleComputeUpgrade,
            resumeUpgradeComputeNodes: resumeUpgradeComputeNodes,
            setDefaultComputeUpgrade: false,
        };

        activate();

        function activate() {
            upgradeStatusFactory.syncStatusFlags(
                UPGRADE_STEPS.nodes,
                vm.nodesUpgrade,
                waitForUpgradeNodesToEnd,
                upgradeSuccess,
                upgradeError,
                updateModel
            );
        }

        function beginUpgradeNodes() {
            vm.nodesUpgrade.running = true;

            if (vm.nodesUpgrade.subStep === 'controller_nodes' && vm.nodesUpgrade.subStepStatus === 'finished') {
                resumeUpgradeComputeNodes();
            } else {
                upgradeFactory.upgradeNodes(vm.nodesUpgrade.computeUpgradeEnabled)
                    .then(
                        waitForUpgradeNodesToEnd,
                        upgradeError
                    );
            }
        }

        function resumeUpgradeComputeNodes() {
            if (vm.nodesUpgrade.computeNodesPostponedFlag) {
                upgradeFactory.setResumeComputeNodes()
                    .then(
                        function() {
                            $timeout(upgradeAllNodes, RESUME_UPGRADE_TIMEOUT_INTERVAL);
                        },
                        upgradeError
                    )
            } else {
                upgradeAllNodes();
            }
        }

        function upgradeAllNodes() {
            upgradeFactory.upgradeNodes(true)
                .then(
                    waitForUpgradeNodesToEnd,
                    upgradeError
                )
        }

        function waitForUpgradeNodesToEnd () {
            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.nodes,
                NODE_UPGRADE_TIMEOUT_INTERVAL,
                upgradeSuccess,
                upgradeError,
                updateModel
            );

        }

        function updateModel(response) {
            // do nothing if called with error-only response (e.g. via postSync)
            if (response.data.errors) {
                return;
            }

            // set default upgrade compute checkbox state one time only, so not to override user's choice
            if (vm.nodesUpgrade.computeUpgradeEnabled === null) {
                vm.nodesUpgrade.computeUpgradeEnabled = true;
                if (angular.isDefined(response.data.nodes_selected_for_upgrade)) {
                    vm.nodesUpgrade.computeUpgradeEnabled = (response.data.nodes_selected_for_upgrade === 'all');
                }
                upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.computeUpgradeEnabled);
                if (response.data.current_substep === 'compute_nodes') {
                    upgradeStepsFactory.setUpgradeStep(NODE_UPGRADE_STEPS.compute);
                } else {
                    upgradeStepsFactory.setUpgradeStep(NODE_UPGRADE_STEPS.controller);
                }
            }

            // nodes info is not available in main status response before step is started
            if (response.data.remaining_nodes === null) {
                // fetch base counts from the nodes status api
                upgradeFactory.getNodesStatus()
                    .then(
                        function (response) {
                            vm.nodesUpgrade.upgradedNodes = response.data.upgraded.length;
                            vm.nodesUpgrade.totalNodes =
                                response.data.not_upgraded.length + vm.nodesUpgrade.upgradedNodes;
                        },
                        upgradeError
                    );
                return;
            }

            vm.nodesUpgrade.upgradedNodes = response.data.upgraded_nodes;
            vm.nodesUpgrade.totalNodes = response.data.upgraded_nodes + response.data.remaining_nodes;
            vm.nodesUpgrade.currentNodes = response.data.current_nodes;
            vm.nodesUpgrade.currentAction = response.data.current_node_action;
            vm.nodesUpgrade.computeNodesPostponedFlag = response.data.compute_nodes_postponed;

            // check for the case of postpone upgrade of compute nodes, after controller nodes were
            // upgraded, step status would still be 'running' while substep status would be 'finished'
            vm.nodesUpgrade.subStep = response.data.current_substep;
            vm.nodesUpgrade.subStepStatus = response.data.current_substep_status;
            if (vm.nodesUpgrade.subStep === 'controller_nodes' && vm.nodesUpgrade.subStepStatus === 'finished'
                && response.data.nodes_selected_for_upgrade === 'controllers') {
                vm.nodesUpgrade.running = false;

                // show partially upgrade message
                upgradeStepsFactory.setUpgradeStep(NODE_UPGRADE_STEPS.compute);

                // automatically set check box to checked after upgrade controllers
                if (!vm.nodesUpgrade.setDefaultComputeUpgrade) {
                    vm.nodesUpgrade.computeUpgradeEnabled = true;
                    upgradeStepsFactory.setUpgradeAll(true)
                    vm.nodesUpgrade.setDefaultComputeUpgrade = true;
                }
            } else {
                // in case of resume upgrade
                upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.computeUpgradeEnabled);
                if (vm.nodesUpgrade.subStep === 'compute_nodes') {
                    upgradeStepsFactory.setUpgradeStep(NODE_UPGRADE_STEPS.compute);
                    vm.nodesUpgrade.running = vm.nodesUpgrade.subStepStatus === 'running';
                }
            }
        }

        function upgradeSuccess(response) {
            updateModel(response);

            vm.nodesUpgrade.running = false;
            vm.nodesUpgrade.completed = true;

            // only set step completed after upgrade all
            if (vm.nodesUpgrade.subStep === 'end_of_upgrade' && response.data.current_substep_status === 'finished') {
                upgradeStepsFactory.setCurrentStepCompleted();
            }
        }

        function upgradeError(errorResponse) {
            // make sure we update the UI with latest status even if it contained errors
            updateModel(errorResponse);

            vm.nodesUpgrade.running = false;
            vm.nodesUpgrade.completed = false;
            // Expose the error list to nodesUpgrade object
            if (angular.isDefined(errorResponse.data.errors)) {
                vm.nodesUpgrade.errors = errorResponse.data;
            } else if (angular.isDefined(errorResponse.data.steps)) {
                vm.nodesUpgrade.errors = { errors: errorResponse.data.steps.nodes.errors };
            } else {
                vm.nodesUpgrade.errors = UNEXPECTED_ERROR_DATA;
            }
        }

        function toggleComputeUpgrade() {
            upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.computeUpgradeEnabled);
        }
    }
})();
