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
        'NODES_UPGRADE_TIMEOUT_INTERVAL',
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
        NODES_UPGRADE_TIMEOUT_INTERVAL,
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
            upgradeComputeCheckboxSelected: null,
            upgradeControllersDone: false,
            computeNodesPostponedFlag: null,
            resumeUpgrade: false,
            toggleComputeUpgrade: toggleComputeUpgrade,
            resumeUpgradeComputeNodes: resumeUpgradeComputeNodes,
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

            if (vm.nodesUpgrade.upgradedNodes === 0) {
                upgradeFactory.upgradeNodes(vm.nodesUpgrade.upgradeComputeCheckboxSelected)
                    .then(
                        waitForUpgradeNodesToEnd,
                        upgradeError
                    );
            } else {
                resumeUpgradeComputeNodes();
            }
        }

        function resumeUpgradeComputeNodes() {
            vm.nodesUpgrade.resumeUpgrade = true;
            if (vm.nodesUpgrade.computeNodesPostponedFlag) {
                upgradeFactory.setResumeComputeNodes()
                    .then(
                        function() {
                            $timeout(upgradeAllNodes, RESUME_UPGRADE_TIMEOUT_INTERVAL);
                        },
                        function(errorResponse) {
                            upgradeError(errorResponse);
                        }
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
                NODES_UPGRADE_TIMEOUT_INTERVAL,
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

            // init upgrade compute checkbox
            if (vm.nodesUpgrade.upgradeComputeCheckboxSelected === null) {
                if (angular.isDefined(response.data.nodes_selected_for_upgrade)) {
                    vm.nodesUpgrade.upgradeComputeCheckboxSelected = response.data.nodes_selected_for_upgrade === 'all';
                } else {
                    vm.nodesUpgrade.upgradeComputeCheckboxSelected = true;
                }
            }

            // init compute node postponed flag
            if (vm.nodesUpgrade.computeNodesPostponedFlag === null) {
                vm.nodesUpgrade.computeNodesPostponedFlag = response.data.compute_nodes_postponed;
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
                            upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.upgradeComputeCheckboxSelected);
                            upgradeStepsFactory.setUpgradeStep(1);
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
            var subStep = response.data.current_substep;
            var subStepStatus = response.data.current_substep_status;
            var nodesSelected = response.data.nodes_selected_for_upgrade
            if (subStep === 'controller_nodes' && subStepStatus === 'finished' && nodesSelected === 'controllers') {
                vm.nodesUpgrade.running = false;
                // show partially upgrade message
                vm.nodesUpgrade.upgradeControllersDone = true;
                upgradeStepsFactory.setUpgradeStep(2);
                if (!vm.nodesUpgrade.computeNodesPostponedFlag && !vm.nodesUpgrade.resumeUpgrade) {
                    upgradeFactory.setPostponeComputeNodes();
                }
                // set checkbox to checked
                vm.nodesUpgrade.upgradeComputeCheckboxSelected = true;
                upgradeStepsFactory.setUpgradeAll(true);
            } else {
                // in case of resume upgrade
                upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.upgradeComputeCheckboxSelected);
                if (subStep === 'compute_nodes') {
                    upgradeStepsFactory.setUpgradeStep(2);
                    vm.nodesUpgrade.upgradeControllersDone = true;
                    vm.nodesUpgrade.running = subStepStatus === 'running';
                }
            }
        }

        function upgradeSuccess(response) {
            updateModel(response);

            vm.nodesUpgrade.running = false;
            vm.nodesUpgrade.completed = true;

            // only sets step completed after upgrade all, not after upgrade controllers
            if (response.data.current_substep === 'end_of_upgrade' &&
                response.data.current_substep_status === 'finished') {
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
            upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.upgradeComputeCheckboxSelected);
        }
    }
})();
