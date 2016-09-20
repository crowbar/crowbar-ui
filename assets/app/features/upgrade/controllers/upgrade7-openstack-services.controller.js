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

    Upgrade7OpenStackServicesController.$inject = ['$translate', 'openStackFactory'];
    // @ngInject
    function Upgrade7OpenStackServicesController($translate, openStackFactory) {
        var vm = this;

        vm.openStackServices = {
            completed: false,
            valid: false,
            checks: {
                services: {
                    status: false, 
                    label: 'upgrade7.steps.openstack-services.codes.services'
                },
                backup: {
                    status: false, 
                    label: 'upgrade7.steps.openstack-services.codes.backup'
                }
            },
            runOpenStackServices: runOpenStackServices
        };


        /**
         *  Validate OpenStackServices required for Cloud 7 Upgrade
         */
        function runOpenStackServices() {
            openStackFactory.getOpenStackServices()
                .then(
                    //Success handler. Al OpenStackServices passed successfully:
                    function(openStackServicesResponse) {

                        _.forEach(openStackServicesResponse.data, function(value, key) {
                            vm.openStackServices.checks[key].status = value;
                        });

                        var openStackServicesResult = true;

                        // Update openStackServices status
                        _.forEach(vm.openStackServices.checks, function (checkStatus) {
                            if (false === checkStatus.status) {
                                openStackServicesResult = false;
                                return false;
                            }
                        });

                        // Update openStackServices validity
                        vm.openStackServices.valid = openStackServicesResult;
                    },
                    //Failure handler:
                    function(errorOpenStackServicesResponse) {

                        // Expose the error list to openStackServices object
                        vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
                    }
                )
                .finally(function() {
                    // Either on sucess or failure, the openStackServices has been completed.
                    vm.openStackServices.completed = true;
                });
        }
    }
})();
