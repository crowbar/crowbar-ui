(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:UpgradeDatabaseConfigurationController
     * @description
     * # UpgradeDatabaseConfigurationController
     * This is the controller used on the Upgrade Database Configuration page
     */
    angular.module('crowbarApp')
        .controller('UpgradeDatabaseConfigurationController', UpgradeDatabaseConfigurationController);

    UpgradeDatabaseConfigurationController.$inject = ['$scope'];
    // @ngInject
    function UpgradeDatabaseConfigurationController($scope) {
        var vm = this;
        vm.databaseForm = {
            username: '',
            password: '',
            server: '',
            port: 5432,
            tablePrefix: ''
        };
        // Temporary to allow the next button
        $scope.upgradeVm.steps.activeStep.finished = true;
    }
})();
