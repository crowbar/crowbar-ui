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
            'suseData',
            'crowbarWidgets',

            /*
            * Feature areas
            */
            'crowbarApp.upgrade'
        ])
        .config(configuration)
        .run(run)
        // lodash support
        .constant('_', _);

    configuration.$inject = ['$urlRouterProvider'];

    function configuration($urlRouterProvider) {

        configureRouter();

        //@todo: SOC - Store routing configurations into separate files
        function configureRouter() {
            // For any unmatched url, redirect to /upgrade/prepare
            $urlRouterProvider.otherwise('/upgrade/landing');
        }
    }

    run.$inject = ['$rootScope', '$state', 'upgradeFactory', 'upgradeStepsFactory'];

    function run($rootScope, $state, upgradeFactory, upgradeStepsFactory) {
        var cleanup = $rootScope.$on('$stateChangeStart',
                function(event, toState/*, toParams, fromState, fromParams*/) {
                    upgradeFactory.getStatus()
                        .then(
                            function (response) {
                                var expectedState = upgradeStepsFactory.lastStateForRestore(response.data);

                                if (toState.name !== expectedState) {
                                    event.preventDefault();
                                    $state.go(expectedState)
                                        .then(function () { upgradeStepsFactory.refeshStepsList(); });
                                }
                            },
                            function (/*errorResponse*/) {
                            }
                        );
                });
        $rootScope.$on('$destroy', cleanup);
    }
})(_);
