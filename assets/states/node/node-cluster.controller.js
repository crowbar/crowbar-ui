(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:NodeClusterCtrl
   * @description
   * # NodeClusterCtrl
   * Controller of the crowbarApp
   */
  angular.module('crowbarApp')
    .controller('NodeClusterCtrl', NodeClusterCtrl);

  // @ngInject
  function NodeClusterCtrl($scope, $translate, worksFactory) {
    var controller = this;
    controller.works = [];
    worksFactory.getAll().then(
      function(worksCollection) {
        controller.works = worksCollection.data;
      },
      function(response) {
        controller.works = {'Error': response};
      }
    );
  }
})();
