(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:NodeFamilyGroupsCtrl
   * @description
   * # NodeFamilyGroupsCtrl
   * Controller of the crowbarApp
   */
  angular.module('crowbarApp')
    .controller('NodeFamilyGroupsCtrl', NodeFamilyGroupsCtrl);

  // @ngInject
  function NodeFamilyGroupsCtrl($scope, $translate, worksFactory) {
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
