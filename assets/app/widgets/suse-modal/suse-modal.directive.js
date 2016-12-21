(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('suseModal', suseModal);

    var modalController = function ($uibModalInstance, $scope) {
        $scope.dismiss = function() {
            $uibModalInstance.dismiss();
        };
    };

    suseModal.$inject = ['$uibModal'];
    modalController.$inject = ['$uibModalInstance', '$scope'];

    function suseModal($uibModal) {
        return {
            restrict: 'E',
            scope: {
                error: '='
            },
            link: function (scope) {
                scope.$watch('error', function(value) {
                    if (angular.isDefined(value)) {
                        $uibModal.open({
                            templateUrl: 'app/widgets/suse-modal/suse-modal.directive.html',
                            controller: modalController,
                            scope: scope
                        });

                    }
                });
            }
        };
    }
})();
