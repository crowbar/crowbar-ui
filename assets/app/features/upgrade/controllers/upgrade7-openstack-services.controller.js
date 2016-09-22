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
            stopServicesErrorMessage: false,
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
   
            openStackFactory.stopOpenstackServices()
                .then(
                    //Success handler. Stop all OpenStackServices successfully:
                    function(openStackServicesResponse) {

                        vm.openStackServices.checks.services.status = openStackServicesResponse.data.services;
                        
                        if (true === vm.openStackServices.checks.services.status) {

                            openStackFactory.createOpenstackBackup()
                                .then(
                                    //Success handler. Backup OpenStackServices successfully:
                                    function(openStackServicesResponse) {
                                        var ResponseData = openStackServicesResponse.data

                                        vm.openStackServices.checks.backup.status = ResponseData.backup;
                                        vm.openStackServices.valid = vm.openStackServices.checks.backup.status;

                                    },
                                    //Failure handler:
                                    function(errorOpenStackServicesResponse) {

                                        // Expose the error list to openStackServices object
                                        vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
                                    }
                                )
                        } else { 
                            vm.openStackServices.stopServicesErrorMessage = true;
                        }
                    },
                    //Failure handler:
                    function(errorOpenStackServicesResponse) {

                        // Expose the error list to openStackServices object
                        vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
                    }
                ).finally(function() {
                    // Either on sucess or failure, the openStackServices has been completed.
                    vm.openStackServices.completed = true;

                    var openStackServicesResult = true;

                    _.forEach(vm.openStackServices.checks, function(value) {

                        if (false === value.status) {
                            openStackServicesResult = false;
                            return false;
                        }
                    });

                    // Update openStackServices validity
                    vm.openStackServices.valid = openStackServicesResult;

                });   
                
        }
    }
})();
