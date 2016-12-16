/*global $ */
(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('suseModal', suseModal);

    function suseModal() {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/suse-modal/suse-modal.directive.html',
            scope: {
                error: '='
            },
            link: function (scope) {
                scope.$watch('error', function(value) {
                    if (angular.isDefined(value)) {
                        scope.title = value.title;
                        scope.body = value.body;
                        $('#suseModal').modal('show');
                    }
                });
            }
        };
    }
})();
