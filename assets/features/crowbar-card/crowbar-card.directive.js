(function() {
  'use strict';

  angular
    .module('crowbarApp.crowbar-card')
    .directive('crowbarCard', crowbarCard);

  function crowbarCard() {
    return {
      restrict: 'E',
      templateUrl: 'features/crowbar-card/crowbar-card.directive.html'
    };
  }
})();
