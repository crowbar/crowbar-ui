(function() {
  'use strict';

  angular
    .module('crowbarApp.crowbar-upgrade-nav')
    .directive('crowbarUpgradeNav', [crowbarUpgradeNav]);

  function crowbarUpgradeNav() {
    return {
      restrict: 'E',
      templateUrl: 'features/crowbar-upgrade-nav/crowbar-upgrade-nav.directive.html',
      scope: {
        steps: '='
      }
    };
  }
})();
