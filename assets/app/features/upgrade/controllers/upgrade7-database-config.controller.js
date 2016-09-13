(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:Upgrade7DatabaseConfigController
     * @description
     * # Upgrade7DatabaseConfigController
     * This is the controller used on the Upgrade Database Configuration page
     */
    angular.module('crowbarApp')
        .controller('Upgrade7DatabaseConfigController', Upgrade7DatabaseConfigController);

    Upgrade7DatabaseConfigController.$inject = [];
    // @ngInject
    function Upgrade7DatabaseConfigController() {
        var vm = this;
        vm.form = {
            username: '',
            password: '',
            server: '',
            port: '',
            table_prefix: ''
        }
    }
})();
