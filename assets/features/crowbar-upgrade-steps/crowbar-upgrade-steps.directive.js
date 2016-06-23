(function() {
  'use strict';

  angular
    .module('crowbarApp.crowbar-upgrade-steps')
    .directive('crowbarUpgradeSteps', [crowbarUpgradeSteps]);

  function crowbarUpgradeSteps() {
    return {
      restrict: 'E',
      templateUrl: 'features/crowbar-upgrade-steps/crowbar-upgrade-steps.directive.html',
      scope: {
        steps: '='
      }
    };
  }
})();
