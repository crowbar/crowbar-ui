(function() {
  'use strict';

  angular
    .module('crowbarApp.crowbar-menu')
    .directive('crowbarMenu', crowbarMenu);

  function crowbarMenu() {
    return {
      restrict: 'E',
      templateUrl: 'features/crowbar-menu/crowbar-menu.directive.html'
    };
  }
})();
