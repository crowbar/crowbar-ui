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

  configuration.$inject = ['$urlRouterProvider', '$translateProvider'];

  function configuration($urlRouterProvider, $translateProvider) {

    configureRouter();
    configureTranslate();

    //@todo: SOC - Store routing configurations into separate files
    function configureRouter() {
      // For any unmatched url, redirect to /upgrade/prepare
      $urlRouterProvider.otherwise('/upgrade/prepare');
    }

    //@todo: SOC - Store translation keys into separate files
    function configureTranslate() {
      $translateProvider.translations('en', {
        'dashboard': {
          'title': 'UI/UX Dashboard Page'
        },
        'about': {
          'title': 'About Page'
        },
        'header': {
          'title': 'SUSE UI/UX Dashboard',
          'search': {
            'placeholder': 'Search...',
            'button': 'Go!'
          }
        },
        'menu': {
          'home': 'Home',
          'about': 'About',
          'dashboard': 'Dashboard'
        },
        'footer': {
          'copyright': 'SUSE - 2016'
        }
      });

      $translateProvider.preferredLanguage('en');
      $translateProvider.useSanitizeValueStrategy('escaped');
    }
  }
})(_);
