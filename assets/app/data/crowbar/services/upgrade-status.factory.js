(function() {

    angular
        .module('suseData.crowbar')
        .factory('upgradeStatusFactory', upgradeStatusFactory);

    upgradeStatusFactory.$inject = ['$http', '$timeout', 'upgradeFactory', 'UPGRADE_STEP_STATES'];
    /* @ngInject */
    function upgradeStatusFactory($http, $timeout, upgradeFactory, UPGRADE_STEP_STATES) {
        var factory = {
            waitForStepToEnd: waitForStepToEnd,
            syncStatusFlags: syncStatusFlags,
        };

        return factory;

        /**
         * Fetch status info from backend and update flags in passed object
         *
         * @param {string} step - name of step to be checked
         * @param {Object} flagsObject - object with `running` and `completed` fields to be updated
         * @param {function} onRunning - Callback to be executed if current status is running
         * @param {function} onCompleted - Callback to be executed if current status is completed
         */
        function syncStatusFlags(step, flagsObject, onRunning, onCompleted) {
            upgradeFactory.getStatus()
                .then(
                    function (response) {
                        flagsObject.running = response.data.steps[step].status === UPGRADE_STEP_STATES.running;
                        flagsObject.completed = response.data.steps[step].status === UPGRADE_STEP_STATES.passed;

                        if (flagsObject.running && angular.isDefined(onRunning)) {
                            onRunning();
                        } else if (flagsObject.completed && angular.isDefined(onCompleted)) {
                            onCompleted();
                        }
                    }
                );
        }

        /**
         * Polls for upgrade status until step `step` is `passed`.
         *
         * @param {string} step - Step name as defined in status API response
         * @param {function} onSuccess - Callback to be executed with last response from status API
         *     when waiting time finishes successfully
         * @param {function} onError - Callback to be executed if status API returns error
         * @param {int} pollingInterval - Interval used to poll the upgrade status
         * @param {int} [allowedDowntimeLeft=0] - If specified, temporary unavailability of status
         *     API will not trigger `onError` handler and will not stop polling. The downtime
         *     allowance is common for whole call so if there are multiple short unavailability
         *     periods, the total time (sum) is checked.
         * @param {function} [processPartialStatus=undefined] - If specified, will be executed each time with success
         *     responses as parameter until the specified step is completed.
         */
        function waitForStepToEnd(
            step,
            onSuccess,
            onError,
            pollingInterval,
            allowedDowntimeLeft,
            processPartialStatus
        ) {
            allowedDowntimeLeft = angular.isDefined(allowedDowntimeLeft) ? allowedDowntimeLeft : 0;
            processPartialStatus = angular.isDefined(processPartialStatus) ? processPartialStatus : undefined;
            upgradeFactory.getStatus()
                .then(
                    function (response) {
                        // If the step is completed, trigger its success handler
                        if (response.data.steps[step].status === UPGRADE_STEP_STATES.passed) {
                            onSuccess(response);
                        } else {

                            // If the response needs to be processed before the step if completed
                            if (angular.isDefined(processPartialStatus)) {
                                processPartialStatus(response);
                            }

                            // schedule another check
                            $timeout(
                                factory.waitForStepToEnd, pollingInterval, true,
                                step, onSuccess, onError, pollingInterval, allowedDowntimeLeft, processPartialStatus
                            );
                        }
                    },
                    function (errorResponse) {
                        // stop polling and run error callback if we ran out of allowed downtime
                        if (allowedDowntimeLeft <= 0) {
                            onError(errorResponse);
                        } else {
                            // schedule another check but with less downtime allowance
                            $timeout(
                                factory.waitForStepToEnd, pollingInterval, true,
                                step, onSuccess, onError, pollingInterval,
                                allowedDowntimeLeft - pollingInterval, processPartialStatus
                            );
                        }
                    }
                );
        }
    }
})();
