(function() {

  angular
    .module('crowbarData')
    .factory('prechecksFactory', prechecksFactory);

  prechecksFactory.$inject = ['$q', '$http'];
  /* @ngInject */
  function prechecksFactory($q, $http) {
    var factory = {
      getAll: getStepsFactory,
      getAllStatic: function() {
        return {
          "errors": ["001", "002", "003"]
        };
      }
    };

    return factory;
    function getStepsFactory(forceFailure = false) {

      var requestOptions = {
        method: 'GET',
        url: '/api/upgrade7/prechecks'
      };

      if (forceFailure) {
        requestOptions.url += '?fail=' + forceFailure;
      }
      return $http(requestOptions);
    }
  }
})();
