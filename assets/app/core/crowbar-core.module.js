(function () {
    'use strict';

    angular.module('crowbarCore', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngCookies', 'ngResource', 'ui.router', 'ngSanitize', 'ngTouch',

        /*
         * Our reusable cross app code modules
         */

        /*
         * 3rd Party modules
         */
        'ui.bootstrap',     // ui-bootstrap (ex: carousel, pagination, dialog)
        'pascalprecht.translate',
        'angular-loading-bar'
    ]);
})();
