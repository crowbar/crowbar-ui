(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('suseModal', suseModal);

    suseModal.$inject = ['$uibModal'];

    var modalController = function ($uibModalInstance, $scope) {
        $scope.dismiss = function() {
            $uibModalInstance.dismiss();
        };
    };

    modalController.$inject = ['$uibModalInstance', '$scope'];

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
                        $uibModal.open({
                            templateUrl: 'app/widgets/suse-modal/suse-modal.directive.html',
                            controller: modalController,
                            scope: scope
                        }).closed.then(function () {
                            // clear the errors when window is closed
                            scope.error = undefined;
                        });

                    }
                });
            }
        };
    }
})();
