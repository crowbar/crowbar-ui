(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('suseModal', suseModal);

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
                            controller: function($uibModalInstance, $scope){
                                $scope.dismiss = function() {
                                    $uibModalInstance.dismiss();
                                };
                                $scope.error = value;
                            }
                        });

                    }
                });
            }
        };
    }
})();
