(function () {
    'use strict';

    angular
        .module('crowbarApp.upgrade', ['ui.router', 'ngFileSaver', 'pascalprecht.translate', 'suseData'])
        .run(run);

    run.$inject = ['$rootScope', 'upgradeStepsFactory'];

    function run($rootScope, upgradeStepsFactory) {
        var cleanup = $rootScope.$on('$stateChangeStart', upgradeStepsFactory.validateRequestedState);
        $rootScope.$on('$destroy', cleanup);
    }

})();
