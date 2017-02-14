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
            .state('upgrade-landing', {
                url: '/upgrade/landing',
                templateUrl: 'app/features/upgrade/templates/landing-page.html',
                controller: 'UpgradeLandingController',
                controllerAs: 'upgradeLandingVm'
            })
            .state('upgrade', {
                url: '/upgrade',
                templateUrl: 'app/features/upgrade/templates/upgrade.html',
                controller: 'UpgradeController',
                controllerAs: 'upgradeVm'
            })
            .state('upgrade.backup', {
                url: '/backup',
                templateUrl: 'app/features/upgrade/templates/backup-page.html',
                controller: 'UpgradeBackupController',
                controllerAs: 'upgradeBackupVm'
            })
            .state('upgrade.administration-repository-checks', {
                url: '/administration-repositories-checks',
                templateUrl: 'app/features/upgrade/templates/administration-repositories-checks-page.html',
                controller: 'UpgradeAdministrationRepositoriesCheckController',
                controllerAs: 'upgradeAdminRepoChecksVm'
            })
            .state('upgrade.upgrade-administration-server', {
                url: '/upgrade-administration-server',
                templateUrl: 'app/features/upgrade/templates/upgrade-administration-server-page.html',
                controller: 'UpgradeUpgradeAdministrationServerController',
                controllerAs: 'upgradeAdminUpgradeVm'
            })
            .state('upgrade.database-configuration', {
                url: '/database-configuration',
                templateUrl: 'app/features/upgrade/templates/database-configuration-page.html',
                controller: 'UpgradeDatabaseConfigurationController',
                controllerAs: 'upgradeDatabaseVm'
            })
            .state('upgrade.nodes-repositories-checks', {
                url: '/nodes-repositories-checks',
                templateUrl: 'app/features/upgrade/templates/nodes-repositories-checks-page.html',
                controller: 'UpgradeNodesRepositoriesCheckController',
                controllerAs: 'upgradeNodesRepoChecksVm'
            })
            .state('upgrade.openstack-services', {
                url: '/openstack-services',
                templateUrl: 'app/features/upgrade/templates/openstack-services.html',
                controller: 'UpgradeOpenStackServicesController',
                controllerAs: 'upgradeOpenStackServicesVm'
            })
            .state('upgrade.openstack-backup', {
                url: '/openstack-backup',
                templateUrl: 'app/features/upgrade/templates/openstack-backup.html',
                controller: 'UpgradeOpenStackBackupController',
                controllerAs: 'upgradeOpenStackBackupVm'
            })
            .state('upgrade.upgrade-nodes', {
                url: '/upgrade-nodes',
                templateUrl: 'app/features/upgrade/templates/upgrade-nodes-page.html',
                controller: 'UpgradeNodesController',
                controllerAs: 'upgradeNodesVm'
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
