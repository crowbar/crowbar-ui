(function() {
  'use strict';

  angular
    .module('crowbarWidgets')
    .directive('crowbarUpgradeNav', [crowbarUpgradeNav]);

  function crowbarUpgradeNav() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/crowbar-upgrade-nav/crowbar-upgrade-nav.directive.html',
      scope: {
        steps: '='
      }
    };
  }
})();
