(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('crowbarChecklist', crowbarChecklist);

    function crowbarChecklist() {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/crowbar-checklist/crowbar-checklist.directive.html',
            scope: {
                checklist: '=',
                completed: '='
            }
        };
    }
})();
