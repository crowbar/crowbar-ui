(function() {

  angular
    .module('crowbarData.upgrade')
    .factory('backupFactory', backupFactory);

  backupFactory.$inject = ['$q', '$http'];
  /* @ngInject */
  function backupFactory($q, $http) {
    var factory = {
      create: getBackup
    };

    return factory;

    function getBackup() {

      var requestOptions = {
        method: 'GET',
        url: '/api/upgrade7/prechecks'
      };

      return $http(requestOptions);
    }
  }
})();
