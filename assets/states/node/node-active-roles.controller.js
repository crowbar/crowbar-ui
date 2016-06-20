(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:NodeActiveRolesCtrl
   * @description
   * # NodeActiveRolesCtrl
   * Controller of the crowbarApp
   */
  angular.module('crowbarApp')
    .controller('NodeActiveRolesCtrl', NodeActiveRolesCtrl);

  // @ngInject
  function NodeActiveRolesCtrl($scope, $translate, worksFactory) {
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
