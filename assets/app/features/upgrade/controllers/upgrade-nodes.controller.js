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
        'NODES_UPGRADE_TIMEOUT_INTERVAL',
        'UNEXPECTED_ERROR_DATA',
    ];
    // @ngInject
    function UpgradeNodesController(
        upgradeFactory,
        upgradeStatusFactory,
        upgradeStepsFactory,
        UPGRADE_STEPS,
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
        };

        activate();

        function activate() {
            upgradeStatusFactory.syncStatusFlags(
                UPGRADE_STEPS.nodes,
                vm.nodesUpgrade,
                waitForUpgradeNodesToEnd,
                upgradeStepsFactory.setCurrentStepCompleted,
                upgradeError,
                updateModel
            );
        }

        function beginUpgradeNodes() {
            vm.nodesUpgrade.running = true;

            upgradeFactory.upgradeNodes()
                .then(
                    waitForUpgradeNodesToEnd,
                    upgradeError
                );
        }

        function waitForUpgradeNodesToEnd () {
            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.nodes,
                NODES_UPGRADE_TIMEOUT_INTERVAL,
                function (response) {
                    vm.nodesUpgrade.running = false;
                    vm.nodesUpgrade.completed = true;

                    upgradeStepsFactory.setCurrentStepCompleted();

                    updateModel(response);
                },
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
                        },
                        upgradeError
                    );
                return;
            }

            vm.nodesUpgrade.upgradedNodes = response.data.upgraded_nodes;
            vm.nodesUpgrade.totalNodes = response.data.upgraded_nodes + response.data.remaining_nodes;
            vm.nodesUpgrade.currentNodes = response.data.current_nodes;
            vm.nodesUpgrade.currentAction = response.data.current_node_action;
        }

        function upgradeError(errorResponse) {
            // make sure we update the UI with latest status even if it contained errors
            updateModel(errorResponse);

            vm.nodesUpgrade.running = false;
            // Expose the error list to nodesUpgrade object
            if (angular.isDefined(errorResponse.data.errors)) {
                vm.nodesUpgrade.errors = errorResponse.data;
            } else if (angular.isDefined(errorResponse.data.steps)) {
                vm.nodesUpgrade.errors = { errors: errorResponse.data.steps.nodes.errors };
            } else {
                vm.nodesUpgrade.errors = UNEXPECTED_ERROR_DATA;
            }
        }
    }
})();
