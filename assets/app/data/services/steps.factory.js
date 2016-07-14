(function() {

  angular
    .module('crowbarData')
    .factory('stepsFactory', stepsFactory);

  stepsFactory.$inject = ['$q', '$http'];
  /* @ngInject */
  function stepsFactory($q, $http) {
    var factory = {
      getAll: getStepsFactory,
      getAllStatic: function() {
        return [
          {
            id: 0,
            title: 'Prepare Client Node',
            state: 'upgrade.prepare',
            active: true,
            enabled: true
          },
          {
            id: 1,
            title: 'Download Upgrade Data',
            state: 'upgrade.backup',
            active: false,
            enabled: false
          },
          {
            id: 2,
            title: 'Reinstall Admin Server',
            state: 'upgrade.reinstall-admin',
            active: false,
            enabled: false
          },
          {
            id: 3,
            title: 'Continue Upgrade',
            state: 'upgrade.continue-upgrade',
            active: false,
            enabled: false
          },
          {
            id: 4,
            title: 'Restore',
            state: 'upgrade.restore-admin',
            active: false,
            enabled: false
          },
          {
            id: 5,
            title: 'Verify Repositories',
            state: 'upgrade.verify-repos',
            active: false,
            enabled: false
          },
          {
            id: 6,
            title: 'Stop OpenStack Services',
            state: 'upgrade.stop-openstack-services',
            active: false,
            enabled: false
          },
          {
            id: 7,
            title: 'Data Backup',
            state: 'upgrade.openstack-backup',
            active: false,
            enabled: false
          },
          {
            id: 8,
            title: 'Upgrading Nodes OS',
            state: 'upgrade.upgrade-nodes-os',
            active: false,
            enabled: false
          },
          {
            id: 9,
            title: 'Finishing Upgrade',
            state: 'upgrade.finishing-upgrade',
            active: false,
            enabled: false
          }
        ];
      }
    };

    return factory;
    function getStepsFactory() {

      return $http({
        method: 'GET',
        url: '/api/steps'
      });
    }
  }
})();
