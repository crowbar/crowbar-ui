(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:NodeListCtrl
   * @description
   * # NodeListCtrl
   * Controller of the crowbarApp
   */
  angular.module('crowbarApp')
    .controller('NodeListCtrl', NodeListCtrl);

  // @ngInject
  function NodeListCtrl($scope, $translate, worksFactory) {
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
