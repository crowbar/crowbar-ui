(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:UpgradeNodesController
    * @description
    * # UpgradeNodesController
    * This is the controller used on the Upgrade Nodes step
    */
    angular.module('crowbarApp')
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

                        vm.nodesUpgrade.running = false;
                        vm.nodesUpgrade.completed = true;

                        upgradeStatusFactory.waitForStepToEnd(
                            UPGRADE_STEPS.nodes_upgrade,
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
                    },
                    function (errorResponse) {
                        vm.nodesUpgrade.running = false;
                        // Expose the error list to nodesUpgrade object
                        vm.nodesUpgrade.errors = errorResponse.data.errors;
                    }
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
