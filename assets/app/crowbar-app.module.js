(function(_) {
    'use strict';

    /**
    * @ngdoc overview
    * @name crowbarApp
    * @description
    * # crowbarApp
    *
    * Main module of the application.
    */
    angular
        .module('crowbarApp', [
            'crowbarCore',
            'crowbarData',
            'crowbarWidgets',

            /*
            * Feature areas
            */
            'crowbarApp.upgrade'
        ])
        .config(configuration)
        // lodash support
        .constant('_', _);

    configuration.$inject = ['$urlRouterProvider'];

    function configuration($urlRouterProvider) {

        configureRouter();

        //@todo: SOC - Store routing configurations into separate files
        function configureRouter() {
            // For any unmatched url, redirect to /upgrade/prepare
            $urlRouterProvider.otherwise('/upgrade/prepare');
        }
    }
})(_);
