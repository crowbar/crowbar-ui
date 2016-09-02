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
                delay: '@'
            },
            link: function(scope, elem) {
                hideSpinner();

                scope.$watch('active', function(newVal) {
                    newVal ? showSpinner() : hideSpinner();
                });

                elem.on('$destroy', function() {
                    if (timer)
                        $timeout.cancel(timer);
                });

                var timer = null;

                function showSpinner() {
                    if (timer)
                        return;
                    timer = $timeout(function() { elem.css({display: ''}); }, getDelay());
                }

                function hideSpinner() {
                    // cancel (possibly) pending timer
                    if (timer) {
                        $timeout.cancel(timer);
                        timer = null;
                    }

                    elem.css({display: 'none'});
                }

                function getDelay() {
                    var delay = parseInt(scope.delay);
                    return isFinite(delay) ? delay : 2000;
                }
            }
        };
    }
})();
