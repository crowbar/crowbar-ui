(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:Upgrade7DatabaseConfigController
     * @description
     * # Upgrade7DatabaseConfigController
     * This is the controller used on the Upgrade landing page
     */
    angular.module('crowbarApp')
        .controller('Upgrade7DatabaseConfigController', Upgrade7DatabaseConfigController);

    Upgrade7DatabaseConfigController.$inject = ['$scope', '$translate', '$state'];
    // @ngInject
    function Upgrade7DatabaseConfigController($scope, $translate, $state) {
        var vm = this;
        vm.beginUpdate = beginUpdate;
        vm.form = {
            username: '',
            password: '',
            server: '',
            port: '',
            table_prefix: ''
        }

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
