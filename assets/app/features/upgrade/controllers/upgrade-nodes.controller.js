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

    UpgradeNodesController.$inject = ['upgradeFactory', 'upgradeStatusFactory','$timeout',
        'UPGRADE_STEPS', 'NODES_UPGRADE_TIMEOUT_INTERVAL'];
    // @ngInject
    function UpgradeNodesController(
        upgradeFactory,
        upgradeStatusFactory,
        $timeout,
        UPGRADE_STEPS,
        NODES_UPGRADE_TIMEOUT_INTERVAL
    ) {
        var vm = this;

        vm.nodesUpgrade = {
            beginUpgradeNodes: beginUpgradeNodes,
            currentNode: '',
            upgradedNodes: 0,
            totalNodes: 0,
            completed: false,
            running: false,
            spinnerVisible: false,
        };

        activate();

        function activate() {
            upgradeFactory.getStatus()
                .then(
                    function (response) {
                        updateModel(response);

                        // If the nodes upgrade is currently running,
                        // start pooling for the upgrade status until is completed
                        if (response.data.steps.nodes.status === 'running') {
                            waitForUpgradeNodesToEnd();
                        }
                    },
                    function (errorResponse) {

                        vm.nodesUpgrade.running = false;
                        // Expose the error list to nodesUpgrade object
                        vm.nodesUpgrade.errors = errorResponse.data.errors;
                    }
                );
        }

        function beginUpgradeNodes() {
            upgradeFactory.upgradeNodes()
                .then(
                    function () {
                        waitForUpgradeNodesToEnd();
                    },
                    function (errorResponse) {
                        vm.nodesUpgrade.running = false;
                        // Expose the error list to nodesUpgrade object
                        vm.nodesUpgrade.errors = errorResponse.data.errors;
                    }
                );
        }

        function waitForUpgradeNodesToEnd () {
            vm.nodesUpgrade.running = true;
            vm.nodesUpgrade.completed = false;

            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.nodes,
                NODES_UPGRADE_TIMEOUT_INTERVAL,
                function (response) {

                    vm.nodesUpgrade.running = false;
                    vm.nodesUpgrade.completed = true;

                    updateModel(response);
                },
                function (errorResponse) {

                    vm.nodesUpgrade.running = false;
                    // Expose the error list to nodesUpgrade object
                    vm.nodesUpgrade.errors = errorResponse.data.errors;
                },
                updateModel
            );

        }

        function updateModel(response) {
            vm.nodesUpgrade.currentNode = {
                name: response.data.current_node.alias,
                role: response.data.current_node.role,
                state: response.data.current_node.state
            };
            vm.nodesUpgrade.upgradedNodes = response.data.upgraded_nodes;
            vm.nodesUpgrade.totalNodes = response.data.upgraded_nodes + response.data.remaining_nodes;
        }
    }
})();
