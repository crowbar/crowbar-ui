(function() {

  angular
    .module('crowbarData')
    .factory('worksFactory', worksFactory);

  /* @ngInject */
  function worksFactory($q, $http) {
    var factory = {
      getAll: getWorksFactory
    };

    return factory;
    function getWorksFactory() {

      return $http({
        method: 'GET',
        url: '/api/dashboard'
      });
    }
  }
})();
