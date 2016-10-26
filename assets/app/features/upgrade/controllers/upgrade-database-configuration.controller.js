(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.upgrade.controller:UpgradeDatabaseConfigurationController
     * @description
     * # UpgradeDatabaseConfigurationController
     * This is the controller used on the Upgrade Database Configuration page
     */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeDatabaseConfigurationController', UpgradeDatabaseConfigurationController);

    UpgradeDatabaseConfigurationController.$inject = [];
    // @ngInject
    function UpgradeDatabaseConfigurationController() {
        var vm = this;
        vm.databaseForm = {
            username: '',
            password: '',
            server: '',
            port: 5432,
            tablePrefix: ''
        }
    }
})();
