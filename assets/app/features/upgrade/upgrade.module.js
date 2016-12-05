(function () {
    'use strict';

    angular
        .module('crowbarApp.upgrade', ['ui.router', 'ngFileSaver', 'pascalprecht.translate', 'suseData'])
        .run(run);

    run.$inject = ['$rootScope', 'upgradeStepsFactory'];

    /**
     * This function is executed during module bootstrap. Event handlers which need to work in whole module
     * are attached here.
     */
    function run($rootScope, upgradeStepsFactory) {
        var cleanup = $rootScope.$on('$stateChangeStart', upgradeStepsFactory.validateRequestedState);
        $rootScope.$on('$destroy', cleanup);
    }

})();
