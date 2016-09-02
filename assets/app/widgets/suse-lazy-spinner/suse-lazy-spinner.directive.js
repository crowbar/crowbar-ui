(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('suseLazySpinner', lazySpinner);

    lazySpinner.$inject = ['$timeout'];

    function lazySpinner($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'app/widgets/suse-lazy-spinner/suse-lazy-spinner.directive.html',
            scope: {
                active: '=',
                visible: '=?',
                delay: '@'
            },
            link: function(scope, elem) {
                // dummy-init optional binding values
                scope.visible = scope.visible || false;

                scope.$watch('active', function(newVal) {
                    newVal ? showSpinner() : hideSpinner();
                });

                elem.on('$destroy', hideSpinner);

                var timer = null;

                function showSpinner() {
                    if (timer)
                        return;
                    timer = $timeout(function() {
                        elem.addClass('visible');
                        scope.visible = true;
                    }, getDelay());
                }

                function hideSpinner() {
                    // cancel (possibly) pending timer
                    if (timer) {
                        $timeout.cancel(timer);
                        timer = null;
                    }

                    elem.removeClass('visible');
                    scope.visible = false;
                }

                function getDelay() {
                    var delay = parseInt(scope.delay);
                    return isFinite(delay) ? delay : 2000;
                }
            }
        };
    }
})();
