(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:Upgrade7RepositoriesCheckController
    * @description
    * # Upgrade7RepositoriesCheckController
    * This is the controller used on the Upgrade landing page
    */
    angular.module('crowbarApp')
        .controller('Upgrade7RepositoriesCheckController', Upgrade7RepositoriesCheckController);

    Upgrade7RepositoriesCheckController.$inject = ['$scope', '$translate', '$state'];
    // @ngInject
    function Upgrade7RepositoriesCheckController($scope, $translate, $state) {
        var vm = this;
        vm.beginUpdate = beginUpdate;

        /**
        * Move to the next available Step
        */
        function beginUpdate() {
            // Only move forward if all prechecks has been executed and passed.
            if (!vm.prechecks.completed || vm.prechecks.errors) {
                return;
            }

            $state.go('upgrade7.backup');
        }
    }
})();
