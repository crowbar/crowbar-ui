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

    UpgradeDatabaseConfigurationController.$inject = ['upgradeStepsFactory'];
    // @ngInject
    function UpgradeDatabaseConfigurationController(upgradeStepsFactory) {
        var vm = this;
        vm.databaseForm = {
            username: '',
            password: '',
            server: '',
            port: 5432,
            tablePrefix: ''
        };
        // Set the current step as completed by default to enable the next button
        // TODO(itxaka): remove this when we have the proper workflow for this step
        upgradeStepsFactory.setCurrentStepCompleted();

    }
})();
