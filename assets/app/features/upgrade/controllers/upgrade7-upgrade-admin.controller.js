(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:Upgrade7UpgradeAdminController
    * @description
    * # Upgrade7UpgradeAdminController
    * This is the controller used on the Upgrade Admin Server page
    */
    angular.module('crowbarApp')
        .controller('Upgrade7UpgradeAdminController', Upgrade7UpgradeAdminController);

    Upgrade7UpgradeAdminController.$inject = [];
    // @ngInject
    function Upgrade7UpgradeAdminController() {
        var vm = this;
        vm.beginUpgrade = beginUpgrade;

        function beginUpgrade() {
            // TODO:
        }
    }
})();
