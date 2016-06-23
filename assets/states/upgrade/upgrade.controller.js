(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:UpgradeCtrl
   * @description
   * # UpgradeCtrl
   * Controller of the crowbarApp
   */
  angular.module('crowbarApp')
    .controller('UpgradeCtrl', UpgradeCtrl);

  // @ngInject
  function UpgradeCtrl($scope, $translate, worksFactory) {
    var controller = this;
    controller.steps = [
      {
        title: 'Prepare Client Node',
        state: 'upgrade.prepare',
        active: true
      },
      {
        title: 'Download Upgrade Data',
        state: 'upgrade.backup',
        active: false
      },
      {
        title: 'Reinstall Admin Server',
        state: 'upgrade.reinstall-admin',
        active: false
      },
      {
        title: 'Continue Upgrade',
        state: 'upgrade.continue-upgrade',
        active: false
      },
      {
        title: 'Restore',
        state: 'upgrade.restore-admin',
        active: false
      },
      {
        title: 'Verify Repositories',
        state: 'upgrade.verify-repos',
        active: false
      },
      {
        title: 'Stop OpenStack Services',
        state: 'upgrade.stop-openstack-services',
        active: false
      },
      {
        title: 'Data Backup',
        state: 'upgrade.openstack-backup',
        active: false
      },
      {
        title: 'Upgrading Nodes OS',
        state: 'upgrade.upgrade-nodes-os',
        active: false
      },
      {
        title: 'Finishing Upgrade',
        state: 'upgrade.finishing-upgrade',
        active: false
      }
    ];
  }
})();
