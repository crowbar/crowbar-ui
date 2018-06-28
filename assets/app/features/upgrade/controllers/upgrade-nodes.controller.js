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
        'UNEXPECTED_ERROR_DATA',
    ];
    // @ngInject
    function UpgradeNodesController(
        upgradeFactory,
        upgradeStatusFactory,
        upgradeStepsFactory,
        UPGRADE_STEPS,
        UPGRADE_STEP_STATES,
        NODES_UPGRADE_TIMEOUT_INTERVAL,
        UNEXPECTED_ERROR_DATA
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
            upgradeComputeSelected: true,
            upgradeComputePostponed: false,
            computeNodesPostponed: false,
            startAtComputeUpgrade: false,
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
            if (vm.nodesUpgrade.upgradedNodes === 0) {
                vm.nodesUpgrade.running = true;
                upgradeFactory.upgradeNodes(vm.nodesUpgrade.upgradeComputeSelected)
                    .then(
                        waitForUpgradeNodesToEnd,
                        upgradeError
                    );
            } else {
                resumeUpgradeComputeNodes();
            }
        }

        function resumeUpgradeComputeNodes() {
            vm.nodesUpgrade.startAtComputeUpgrade = true;
            if (vm.nodesUpgrade.computeNodesPostponed) {
                upgradeFactory.setResumeComputeNodes()
                    .then(
                        upgradeAllNodes
                    )
            } else {
                upgradeAllNodes();
            }
        }

        function upgradeAllNodes() {
            vm.nodesUpgrade.running = true;
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
            // nodes info is not available in main status response before step is started
            if (response.data.remaining_nodes === null) {
                // fetch base counts from the nodes status api
                upgradeFactory.getNodesStatus()
                    .then(
                        function (response) {
                            vm.nodesUpgrade.upgradedNodes = response.data.upgraded.length;
                            vm.nodesUpgrade.totalNodes =
                                response.data.not_upgraded.length + vm.nodesUpgrade.upgradedNodes;
                            upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.upgradeComputeSelected);
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
            vm.nodesUpgrade.computeNodesPostponed = response.data.compute_nodes_postponed;

            // in case of resume upgrade or refreshing page
            upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.upgradeComputeSelected);
            if (response.data.current_substep === 'controller_nodes' &&
                response.data.current_substep_status === 'finished' && vm.nodesUpgrade.running) {
                vm.nodesUpgrade.running = false;
                vm.nodesUpgrade.upgradeComputePostponed = response.data.compute_nodes_postponed;
                upgradeStepsFactory.setUpgradeStep(2);
            } else if (response.data.current_substep === 'compute_nodes') {
                upgradeStepsFactory.setUpgradeAll(true);
                upgradeStepsFactory.setUpgradeStep(2);
            }
        }

        function upgradeSuccess(response) {
            updateModel(response);

            vm.nodesUpgrade.running = false;
            vm.nodesUpgrade.completed = true;

            // only sets step completed after upgrade all, not after upgrade controllers
            if (!(response.data.current_substep === 'controller_nodes' &&
                response.data.current_substep_status === 'finished')) {
                upgradeStepsFactory.setCurrentStepCompleted();
            }

            if (!vm.nodesUpgrade.upgradeComputeSelected) {
                vm.nodesUpgrade.upgradeComputePostponed = true;
                upgradeFactory.setPostponeComputeNodes();
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
            upgradeStepsFactory.setUpgradeAll(vm.nodesUpgrade.upgradeComputeSelected);
        }
    }
})();
