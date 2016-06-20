(function() {
  'use strict';

  angular
    .module('crowbarApp.crowbar-header')
    .directive('crowbarHeader', crowbarHeader);

  function crowbarHeader() {
    return {
      restrict: 'E',
      templateUrl: 'features/crowbar-header/crowbar-header.directive.html'
    };
  }
})();
