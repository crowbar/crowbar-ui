(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:NodeDashboardCtrl
   * @description
   * # NodeDashboardCtrl
   * Controller of the crowbarApp
   */
  angular.module('crowbarApp')
    .controller('NodeDashboardCtrl', NodeDashboardCtrl);

  // @ngInject
  function NodeDashboardCtrl($scope, $translate, worksFactory) {
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
