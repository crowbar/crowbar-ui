(function() {
  'use strict';

  angular
    .module('crowbarWidgets')
    .directive('crowbarHeader', crowbarHeader);

  function crowbarHeader() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/crowbar-header/crowbar-header.directive.html'
    };
  }
})();
