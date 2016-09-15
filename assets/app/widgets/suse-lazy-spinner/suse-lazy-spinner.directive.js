(function() {
    'use strict';

    angular
        .module('crowbarWidgets')
        .directive('suseLazySpinner', suseLazySpinner)
        .constant('SUSE_LAZY_SPINNER', { DEFAULT_DELAY: 2000 });

    suseLazySpinner.$inject = ['$timeout', 'SUSE_LAZY_SPINNER'];

    function suseLazySpinner($timeout, SUSE_LAZY_SPINNER) {
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
                    if (timer) {
                        return;
                    }
                    timer = $timeout(function() {
                        elem.removeClass('hidden');
                        scope.visible = true;
                    }, getDelay());
                }

                function hideSpinner() {
                    // cancel (possibly) pending timer
                    if (timer) {
                        $timeout.cancel(timer);
                        timer = null;
                    }

                    elem.addClass('hidden');
                    scope.visible = false;
                }

                function getDelay() {
                    var delay = parseInt(scope.delay);
                    return isFinite(delay) ? delay : SUSE_LAZY_SPINNER.DEFAULT_DELAY;
                }
            }
        };
    }
})();
