(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:Upgrade7DatabaseConfigurationController
     * @description
     * # Upgrade7DatabaseConfigurationController
     * This is the controller used on the Upgrade Database Configuration page
     */
    angular.module('crowbarApp')
        .controller('Upgrade7DatabaseConfigurationController', Upgrade7DatabaseConfigurationController);

    Upgrade7DatabaseConfigurationController.$inject = [];
    // @ngInject
    function Upgrade7DatabaseConfigurationController() {
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
