(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:Upgrade7StopOpenStackServicesController
    * @description
    * # Upgrade7StopOpenStackServicesController
    * This is the controller used on the Stop OpenStack Services page
    */
    angular.module('crowbarApp')
        .controller('Upgrade7StopOpenStackServicesController', Upgrade7StopOpenStackServicesController);

    Upgrade7StopOpenStackServicesController.$inject = ['$translate'];
    // @ngInject
    function Upgrade7StopOpenStackServicesController() {
        var vm = this;

        vm.stopServices = {
            services: {
                services_stop: false,
                heat: false,
                backup: false
            }
        };


        /**
         *  Validate Admin Repositories required for Cloud 7 Upgrade
         */

    }
})();
