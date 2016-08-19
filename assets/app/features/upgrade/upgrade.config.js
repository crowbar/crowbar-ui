(function () {
  'use strict';

  angular
    .module('crowbarApp.upgrade')
    .config(configuration);

   
  configuration.$inject = ['$stateProvider', '$urlRouterProvider', '$translateProvider'];
  // @ngInject
  function configuration($stateProvider, $urlRouterProvider, $translateProvider) {

    /**
     * Configure States, Views and Urls
     */
    $stateProvider
      .state('upgrade7-landing', {
        url: '/upgrade7/landing',
        templateUrl: 'app/features/upgrade/templates/upgrade7/landing.html',
        controller: 'Upgrade7LandingController',
        controllerAs: 'Upgrade7LandingVm'
      })
      .state('upgrade7', {
        url: '/upgrade7',
        templateUrl: 'app/features/upgrade/templates/upgrade7/upgrade.html',
        controller: 'Upgrade7Controller',
        controllerAs: 'upgradeVm'
      })
      .state('upgrade7.backup', {
        url: '/backup',
        templateUrl: 'app/features/upgrade/templates/upgrade7/backup.html',
        controller: 'Upgrade7BackupController',
        controllerAs: 'Upgrade7BackupVm'
      })
      .state('upgrade7.repository-checks', {
        url: '/repository-checks',
        templateUrl: 'app/features/upgrade/templates/upgrade7/repository-checks.html',
        controller: 'Upgrade7RepositoriesCheckController',
        controllerAs: 'upgrade7RepositoriesCheckControllerVm'
      })
      .state('upgrade7.upgrade-admin', {
        url: '/upgrade-admin',
        templateUrl: 'app/features/upgrade/templates/upgrade7/upgrade-admin.html'
      })

      .state('upgrade', {
        url: '/upgrade',
        templateUrl: 'app/features/upgrade/templates/upgrade.html',
        controller: 'UpgradeController',
        controllerAs: 'upgradeVm'
      })
      .state('upgrade.prepare', {
        url: '/prepare',
        templateUrl: 'app/features/upgrade/templates/prepare.html'
      })
      .state('upgrade.backup', {
        url: '/backup',
        templateUrl: 'app/features/upgrade/templates/backup.html'
      })
      .state('upgrade.reinstall-admin', {
        url: '/reinstall-admin',
        templateUrl: 'app/features/upgrade/templates/reinstall-admin.html'
      })
      .state('upgrade.continue-upgrade', {
        url: '/continue-upgrade',
        templateUrl: 'app/features/upgrade/templates/continue-upgrade.html'
      })
      .state('upgrade.restore-admin', {
        url: '/restore-admin',
        templateUrl: 'app/features/upgrade/templates/restore-admin.html'
      })
      .state('upgrade.verify-repos', {
        url: '/verify-repos',
        templateUrl: 'app/features/upgrade/templates/verify-repos.html'
      })
      .state('upgrade.stop-openstack-services', {
        url: '/stop-openstack-services',
        templateUrl: 'app/features/upgrade/templates/stop-openstack-services.html'
      })
      .state('upgrade.openstack-backup', {
        url: '/openstack-backup',
        templateUrl: 'app/features/upgrade/templates/openstack-backup.html'
      })
      .state('upgrade.upgrade-nodes-os', {
        url: '/upgrade-nodes-os',
        templateUrl: 'app/features/upgrade/templates/upgrade-nodes-os.html'
      })
      .state('upgrade.finishing-upgrade', {
        url: '/finishing-upgrade',
        templateUrl: 'app/features/upgrade/templates/finishing-upgrade.html'
      });

    /**
     * Configure Translations
     */
    $translateProvider.useStaticFilesLoader({
        prefix: 'app/features/upgrade/i18n/',
        suffix: '.json'
      });
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitize');
  }
})(_);
