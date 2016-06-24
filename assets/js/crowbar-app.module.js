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
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ui.router',
      'ngSanitize',
      'ngTouch',
      'pascalprecht.translate',
      'angular-loading-bar',
      'crowbarApp.crowbar-header',
      'crowbarApp.crowbar-upgrade-steps',
      'crowbarApp.crowbar-upgrade-nav',
      'crowbarApp.services.works',
      'ui.bootstrap'
      ])
    .config(configuration)
    // lodash support
    .constant('_', _);

  configuration.$inject = ['$stateProvider', '$urlRouterProvider', '$translateProvider'];

  function configuration($stateProvider, $urlRouterProvider, $translateProvider) {

    configureRouter();
    configureTranslate();

    //@todo: SOC - Store routing configurations into separate files
    function configureRouter() {

      // Now set up the states
      $stateProvider
        .state('upgrade', {
          url: '/upgrade',
          templateUrl: 'states/upgrade/upgrade.html',
          controller: 'UpgradeCtrl',
          controllerAs: 'upgradeVm'
        })
        .state('upgrade.prepare', {
          url: '/prepare',
          templateUrl: 'states/upgrade/prepare.html'
        })
        .state('upgrade.backup', {
          url: '/backup',
          templateUrl: 'states/upgrade/backup.html'
        })
        .state('upgrade.reinstall-admin', {
          url: '/reinstall-admin',
          templateUrl: 'states/upgrade/reinstall-admin.html'
        })
        .state('upgrade.continue-upgrade', {
          url: '/continue-upgrade',
          templateUrl: 'states/upgrade/continue-upgrade.html'
        })
        .state('upgrade.restore-admin', {
          url: '/restore-admin',
          templateUrl: 'states/upgrade/restore-admin.html'
        })
        .state('upgrade.verify-repos', {
          url: '/verify-repos',
          templateUrl: 'states/upgrade/verify-repos.html'
        })
        .state('upgrade.stop-openstack-services', {
          url: '/stop-openstack-services',
          templateUrl: 'states/upgrade/stop-openstack-services.html'
        })
        .state('upgrade.openstack-backup', {
          url: '/openstack-backup',
          templateUrl: 'states/upgrade/openstack-backup.html'
        })
        .state('upgrade.upgrade-nodes-os', {
          url: '/upgrade-nodes-os',
          templateUrl: 'states/upgrade/upgrade-nodes-os.html'
        })
        .state('upgrade.finishing-upgrade', {
          url: '/finishing-upgrade',
          templateUrl: 'states/upgrade/finishing-upgrade.html'
        });

      // For any unmatched url, redirect to /
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
