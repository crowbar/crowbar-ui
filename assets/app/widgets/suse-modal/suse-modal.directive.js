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
                errorBus: '=errorBus'  // not sure how to bind this and to where?
            },
            link: function (scope, elem, attrs) {
                scope.$watch(scope.errorBus, function(value) {
                    if (value) {
                        elem.modal('show');
                    }
                });
            }
        };
    }
})();
