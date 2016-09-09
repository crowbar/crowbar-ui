(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:Upgrade7OpenStackServicesController
    * @description
    * # Upgrade7OpenStackServicesController
    * This is the controller used on the Stop OpenStack Services page
    */
    angular.module('crowbarApp')
        .controller('Upgrade7OpenStackServicesController', Upgrade7OpenStackServicesController);

    Upgrade7OpenStackServicesController.$inject = ['$translate', 'upgradeOpenStackServicesFactory'];
    // @ngInject
    function Upgrade7OpenStackServicesController($translate, upgradeOpenStackServicesFactory) {
        var vm = this;

        vm.openStackServices = {
            completed: false,
            valid: false,
            checks: {
                services_stop: false,
                heat: false,
                backup: false
            },
            runOpenStackServices: runOpenStackServices
        };


        /**
         *  Validate Admin Repositories required for Cloud 7 Upgrade
         */
        function runOpenStackServices() {
            upgradeOpenStackServicesFactory.getOpenStackServices()
                .then(
                    //Success handler. Al precheck passed successfully:
                    function(openStackServicesResponse) {

                        _.merge(vm.openStackServices.checks, openStackServicesResponse.data);
                        var openStackServicesResult = true;
                        // Update prechecks status
                        _.forEach(vm.openStackServices.checks, function (checkStatus) {
                            if (false === checkStatus) {
                                openStackServicesResult = false;
                                return false;
                            }
                        });

                        // Update prechecks validity
                        vm.openStackServices.valid = openStackServicesResult;
                    },
                    //Failure handler:
                    function(errorOpenStackServicesResponse) {

                        // Expose the error list to prechecks object
                        vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
                    }
                ).finally(
                    function() {
                        // Either on sucess or failure, the prechecks has been completed.
                        vm.openStackServices.completed = true;
                    }
                );
        }

    }
})();
