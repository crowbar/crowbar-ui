(function() {

  angular
    .module('crowbarData')
    .factory('upgradeStepsFactory', upgradeStepsFactory);

  upgradeStepsFactory.$inject = ['$q', '$http'];
  /* @ngInject */
  function upgradeStepsFactory($q, $http) {
    var factory = {
      getAll: getStepsFactory,
      getAllStatic: function() {
        return [
          {
            id: 0,
            title: 'Backup Admin Node',
            state: 'upgrade7.backup',
            active: true,
            enabled: true
          },
          {
            id: 1,
            title: 'Repositories check',
            state: 'upgrade7.repository-checks',
            active: false,
            enabled: false
          },
          {
            id: 2,
            title: 'Upgrade Admin Server',
            state: 'upgrade7.upgrade-admin',
            active: false,
            enabled: false
          },
          {
            id: 3,
            title: 'Database Configuration',
            state: 'upgrade7.databse',
            active: false,
            enabled: false
          },
          {
            id: 4,
            title: 'Migrate OpenStack Database',
            state: 'upgrade7.migrate-openstack-database',
            active: false,
            enabled: false
          },
          {
            id: 5,
            title: 'Finish Upgrade',
            state: 'upgrade7.finish-upgrade',
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
        url: '/api/upgrade7/steps'
      });
    }
  }
})();
