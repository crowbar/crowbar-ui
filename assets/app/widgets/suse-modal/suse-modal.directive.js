(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('suseModal', suseModal)
        .filter('normalizeErrorData', normalizeErrorData);

    function normalizeErrorData() {
        return function(data) {
            // convert plain strings to arrays for easier handling
            if (!angular.isArray(data)) {
                data = [data];
            }
            // split every "multi-line" into separate lines
            var lines = [];
            _.forEach(data, function (line) {
                lines = lines.concat(line.split('\n'));
            });
            return lines;
        }
    }

    suseModal.$inject = ['$uibModal'];

    function suseModal($uibModal) {
        return {
            restrict: 'E',
            scope: {
                error: '=',
                translationPrefix: '@',
            },
            link: function (scope) {
                // init optional binding values
                scope.translationPrefix = scope.translationPrefix || 'modal';

                scope.$watch('error', function(value) {
                    if (angular.isDefined(value)) {
                        // store instance in scope to expose `dismiss()` to the view
                        scope.modalInstance = $uibModal.open({
                            templateUrl: 'app/widgets/suse-modal/suse-modal.directive.html',
                            scope: scope
                        });
                        // clear the errors when window is closed
                        scope.modalInstance.closed.then(function () {
                            scope.error = undefined;
                        });

                    }
                });
            }
        };
    }
})();
