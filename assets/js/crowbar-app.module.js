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
      'crowbarApp.crowbar-menu',
      'crowbarApp.crowbar-card',
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

      // For any unmatched url, redirect to /
      $urlRouterProvider.otherwise('/node/dashboard');
      // Now set up the states
      $stateProvider
        .state('node', {
          url: '/node',
          templateUrl: 'states/node/node-dashboard.html',
          controller: 'NodeDashboardCtrl',
          controllerAs: 'nodeDashboardVm'
        })
        .state('node.list', {
          url: '/list',
          templateUrl: 'states/node/node-list.html',
          controller: 'NodeListCtrl',
          controllerAs: 'nodeListVm'
        })
        .state('node.cluster', {
          url: '/cluster',
          templateUrl: 'states/node/node-cluster.html',
          controller: 'NodeClusterCtrl',
          controllerAs: 'nodeClusterVm'
        })
        .state('node.active-roles', {
          url: '/active-roles',
          templateUrl: 'states/node/node-active-roles.html',
          controller: 'NodeActiveRolesCtrl',
          controllerAs: 'nodeActiveRolesVm'
        })
        .state('node.family-groups', {
          url: '/family-groups',
          templateUrl: 'states/node/node-family-groups.html',
          controller: 'NodeFamilyGroupsCtrl',
          controllerAs: 'nodeFamilyGroupsVm'
        })
        .state('about', {
          url: '/about',
          templateUrl: 'states/about/about.html',
          controller: 'AboutCtrl',
          controllerAs: 'aboutVm'
        });
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
