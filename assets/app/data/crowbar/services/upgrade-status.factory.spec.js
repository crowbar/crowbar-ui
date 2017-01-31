/*global bard assert $q $rootScope should expect module upgradeFactory upgradeStatusFactory */
describe('Upgrade Status Factory', function () {
    var pollingInterval = 1234,
        testedStep = 'admin',
        allowedDowntime = 4321,
        completedUpgradeResponseData = {
            current_step: 'database',
            substep: null,
            current_node: null,
            steps: {
                prechecks: {
                    status: 'passed',
                    errors: {}
                },
                backup_crowbar: {
                    status: 'passed',
                    errors: {}
                },
                repocheck_crowbar: {
                    status: 'passed',
                    errors: {}
                },
                admin: {
                    status: 'passed',
                    errors: {}
                },
                database: {
                    status: 'pending',
                    errors: {}
                },
                repocheck_nodes: {
                    status: 'pending',
                    errors: {}
                },
                services: {
                    status: 'pending',
                    errors: {}
                },
                backup_openstack: {
                    status: 'pending',
                    errors: {}
                },
                nodes: {
                    status: 'pending',
                    errors: {}
                },
                finished: {
                    status: 'pending',
                    errors: {}
                }
            }
        },
        completedUpgradeResponse = {
            data: completedUpgradeResponseData
        },
        incompleteUpgradeResponseData = {
            current_step: 'admin',
            substep: null,
            current_node: null,
            steps: {
                prechecks: {
                    status: 'passed',
                    errors: {}
                },
                backup_crowbar: {
                    status: 'passed',
                    errors: {}
                },
                repocheck_crowbar: {
                    status: 'passed',
                    errors: {}
                },
                admin: {
                    status: 'running',
                    errors: {}
                },
                database: {
                    status: 'pending',
                    errors: {}
                },
                repocheck_nodes: {
                    status: 'pending',
                    errors: {}
                },
                services: {
                    status: 'pending',
                    errors: {}
                },
                backup_openstack: {
                    status: 'pending',
                    errors: {}
                },
                nodes: {
                    status: 'pending',
                    errors: {}
                },
                finished: {
                    status: 'pending',
                    errors: {}
                }
            }
        },
        incompleteUpgradeResponse = {
            data: incompleteUpgradeResponseData
        },
        failedUpgradeResponseData = {
            current_step: 'admin',
            substep: null,
            current_node: null,
            steps: {
                prechecks: {
                    status: 'passed',
                    errors: {}
                },
                backup_crowbar: {
                    status: 'passed',
                    errors: {}
                },
                repocheck_crowbar: {
                    status: 'passed',
                    errors: {}
                },
                admin: {
                    status: 'failed',
                    errors: { some_error: { data: 'error message', help: 'hints for the user', } },
                },
                database: {
                    status: 'pending',
                    errors: {}
                },
                repocheck_nodes: {
                    status: 'pending',
                    errors: {}
                },
                services: {
                    status: 'pending',
                    errors: {}
                },
                backup_openstack: {
                    status: 'pending',
                    errors: {}
                },
                nodes: {
                    status: 'pending',
                    errors: {}
                },
                finished: {
                    status: 'pending',
                    errors: {}
                }
            }
        },
        failedUpgradeResponse = {
            data: failedUpgradeResponseData
        },
        flagsObject,
        mockedSuccessCallback,
        mockedErrorCallback,
        mockedRunningCallback,
        mockedCompletedCallback,
        mockedFailedCallback,
        mockedPostSyncCallback,
        mockedTimeout,
        errorResponse = {
            error: 'some error'
        };

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('suseData.crowbar');

        mockedSuccessCallback = jasmine.createSpy('onSuccess');
        mockedErrorCallback = jasmine.createSpy('onError');
        mockedCompletedCallback = jasmine.createSpy('onCompleted');
        mockedRunningCallback = jasmine.createSpy('onRunning');
        mockedFailedCallback = jasmine.createSpy('onFailed');
        mockedPostSyncCallback = jasmine.createSpy('postSync');

        // mock $timeout service
        module(function($provide) {
            $provide.factory('$timeout', function () {
                mockedTimeout = jasmine.createSpy('$timeout');
                return mockedTimeout;
            });
        });

        // inject the rest of dependencies using BardJS
        bard.inject('upgradeStatusFactory', 'upgradeFactory', '$q', '$rootScope');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(upgradeStatusFactory);
        });

        describe('syncStatusFlags function', function () {
            it('should be defined', function () {
                should.exist(upgradeStatusFactory.syncStatusFlags);
                expect(upgradeStatusFactory.syncStatusFlags).toEqual(jasmine.any(Function));
            });

            describe('when received status is completed', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        getStatus: $q.when(completedUpgradeResponse)
                    });

                    flagsObject = { running: true, completed: false };

                    upgradeStatusFactory.syncStatusFlags(
                        testedStep, flagsObject,
                        mockedRunningCallback, mockedCompletedCallback,
                        mockedFailedCallback, mockedPostSyncCallback
                    );

                    $rootScope.$digest();
                });

                it('should call completed callback', function () {
                    expect(mockedCompletedCallback).toHaveBeenCalledTimes(1);
                });

                it('should not call running callback', function () {
                    expect(mockedRunningCallback).not.toHaveBeenCalled();
                });

                it('should not call failed callback', function () {
                    expect(mockedFailedCallback).not.toHaveBeenCalled();
                });

                it('should call post sync callback', function () {
                    expect(mockedPostSyncCallback).toHaveBeenCalledTimes(1);
                });

                it('should set completed flag to true', function () {
                    assert.isTrue(flagsObject.completed);
                });

                it('should set running flag to false', function () {
                    assert.isFalse(flagsObject.running);
                });
            });

            describe('when received status is running', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        getStatus: $q.when(incompleteUpgradeResponse)
                    });

                    flagsObject = { running: false, completed: true };

                    upgradeStatusFactory.syncStatusFlags(
                        testedStep, flagsObject,
                        mockedRunningCallback, mockedCompletedCallback,
                        mockedFailedCallback, mockedPostSyncCallback
                    );

                    $rootScope.$digest();
                });

                it('should not call completed callback', function () {
                    expect(mockedCompletedCallback).not.toHaveBeenCalled();
                });

                it('should call running callback', function () {
                    expect(mockedRunningCallback).toHaveBeenCalledTimes(1);
                });

                it('should not call failed callback', function () {
                    expect(mockedFailedCallback).not.toHaveBeenCalled();
                });

                it('should call post sync callback', function () {
                    expect(mockedPostSyncCallback).toHaveBeenCalledTimes(1);
                });

                it('should set completed flag to false', function () {
                    assert.isFalse(flagsObject.completed);
                });

                it('should set running flag to true', function () {
                    assert.isTrue(flagsObject.running);
                });
            });

            describe('when received status is failed (with callback)', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        getStatus: $q.when(failedUpgradeResponse)
                    });

                    flagsObject = { running: true, completed: true };

                    upgradeStatusFactory.syncStatusFlags(
                        testedStep, flagsObject,
                        mockedRunningCallback, mockedCompletedCallback,
                        mockedFailedCallback, mockedPostSyncCallback
                    );

                    $rootScope.$digest();
                });

                it('should not call completed callback', function () {
                    expect(mockedCompletedCallback).not.toHaveBeenCalled();
                });

                it('should not call running callback', function () {
                    expect(mockedRunningCallback).not.toHaveBeenCalled();
                });

                it('should call failed callback', function () {
                    expect(mockedFailedCallback).toHaveBeenCalledTimes(1);
                });

                it('should call post sync callback', function () {
                    expect(mockedPostSyncCallback).toHaveBeenCalledTimes(1);
                });

                it('should set completed flag to false', function () {
                    assert.isFalse(flagsObject.completed);
                });

                it('should set running flag to false', function () {
                    assert.isFalse(flagsObject.running);
                });
            });

            describe('when received status is failed (without callback)', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        getStatus: $q.when(failedUpgradeResponse)
                    });

                    flagsObject = { running: true, completed: true };

                    upgradeStatusFactory.syncStatusFlags(
                        testedStep, flagsObject,
                        mockedRunningCallback, mockedCompletedCallback,
                        null, mockedPostSyncCallback
                    );

                    $rootScope.$digest();
                });

                it('should not call completed callback', function () {
                    expect(mockedCompletedCallback).not.toHaveBeenCalled();
                });

                it('should not call running callback', function () {
                    expect(mockedRunningCallback).not.toHaveBeenCalled();
                });

                it('should call post sync callback', function () {
                    expect(mockedPostSyncCallback).toHaveBeenCalledTimes(1);
                });

                it('should set completed flag to false', function () {
                    assert.isFalse(flagsObject.completed);
                });

                it('should set running flag to false', function () {
                    assert.isFalse(flagsObject.running);
                });
            });

            describe('when there is no post sync callback', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        getStatus: $q.when(completedUpgradeResponse)
                    });

                    flagsObject = { running: true, completed: false };

                    upgradeStatusFactory.syncStatusFlags(
                        testedStep, flagsObject,
                        mockedRunningCallback, mockedCompletedCallback,
                        mockedFailedCallback, null
                    );

                    $rootScope.$digest();
                });

                it('should set completed flag to true', function () {
                    assert.isTrue(flagsObject.completed);
                });

                it('should set running flag to false', function () {
                    assert.isFalse(flagsObject.running);
                });
            });
        });

        describe('waitForStepToEnd function', function () {
            it('should be defined', function () {
                should.exist(upgradeStatusFactory.waitForStepToEnd);
                expect(upgradeStatusFactory.waitForStepToEnd).toEqual(jasmine.any(Function));
            });

            describe('when got upgrade status from api successfully', function () {
                describe('when received status is completed', function () {

                    beforeEach(function () {
                        bard.mockService(upgradeFactory, {
                            getStatus: $q.when(completedUpgradeResponse)
                        });

                        upgradeStatusFactory.waitForStepToEnd(
                            testedStep, pollingInterval, mockedSuccessCallback, mockedErrorCallback
                        );

                        $rootScope.$digest();
                    });

                    it('should call success callback', function () {
                        expect(mockedSuccessCallback).toHaveBeenCalledTimes(1);
                        expect(mockedSuccessCallback).toHaveBeenCalledWith(completedUpgradeResponse);
                    });
                    it('should not call error callback', function () {
                        expect(mockedErrorCallback).not.toHaveBeenCalled();
                    });
                    it('should not schedule another check', function () {
                        expect(mockedTimeout).not.toHaveBeenCalled();
                    });
                });

                describe('when received status is running', function () {
                    describe('without onRunning callback', function () {
                        beforeEach(function () {
                            bard.mockService(upgradeFactory, {
                                getStatus: $q.when(incompleteUpgradeResponse)
                            });

                            upgradeStatusFactory.waitForStepToEnd(
                                testedStep, pollingInterval,
                                mockedSuccessCallback, mockedErrorCallback, null, allowedDowntime
                            );

                            $rootScope.$digest();
                        });

                        it('should not call success callback', function () {
                            expect(mockedSuccessCallback).not.toHaveBeenCalled();
                        });
                        it('should not call error callback', function () {
                            expect(mockedErrorCallback).not.toHaveBeenCalled();
                        });
                        it('should schedule another check', function () {
                            expect(mockedTimeout).toHaveBeenCalledTimes(1);
                            expect(mockedTimeout).toHaveBeenCalledWith(
                                upgradeStatusFactory.waitForStepToEnd, pollingInterval, true,
                                testedStep, pollingInterval,
                                mockedSuccessCallback, mockedErrorCallback, null, allowedDowntime
                            );
                        });
                    });

                    describe('with onRunning callback', function () {
                        beforeEach(function () {
                            bard.mockService(upgradeFactory, {
                                getStatus: $q.when(incompleteUpgradeResponse)
                            });

                            upgradeStatusFactory.waitForStepToEnd(
                                testedStep, pollingInterval,
                                mockedSuccessCallback, mockedErrorCallback, mockedRunningCallback
                            );

                            $rootScope.$digest();
                        });

                        it('should not call success callback', function () {
                            expect(mockedSuccessCallback).not.toHaveBeenCalled();
                        });
                        it('should not call error callback', function () {
                            expect(mockedErrorCallback).not.toHaveBeenCalled();
                        });
                        it('should call onRunning callback', function () {
                            expect(mockedRunningCallback).toHaveBeenCalledTimes(1);
                            expect(mockedRunningCallback).toHaveBeenCalledWith(incompleteUpgradeResponse);
                        });
                        it('should schedule another check', function () {
                            expect(mockedTimeout).toHaveBeenCalledTimes(1);
                            expect(mockedTimeout).toHaveBeenCalledWith(
                                upgradeStatusFactory.waitForStepToEnd, pollingInterval, true,
                                testedStep, pollingInterval,
                                mockedSuccessCallback, mockedErrorCallback, mockedRunningCallback, 0
                            );
                        });
                    });
                });

                describe('when received status is failed', function () {
                    beforeEach(function () {
                        bard.mockService(upgradeFactory, {
                            getStatus: $q.when(failedUpgradeResponse)
                        });

                        upgradeStatusFactory.waitForStepToEnd(
                            testedStep, pollingInterval,
                            mockedSuccessCallback, mockedErrorCallback, mockedRunningCallback, allowedDowntime
                        );

                        $rootScope.$digest();
                    });
                    it('should not call success callback', function () {
                        expect(mockedSuccessCallback).not.toHaveBeenCalled();
                    });
                    it('should not call onRunning callback', function () {
                        expect(mockedRunningCallback).not.toHaveBeenCalled();
                    });
                    it('should call error callback', function () {
                        expect(mockedErrorCallback).toHaveBeenCalledWith(failedUpgradeResponse);
                    });
                    it('should not schedule another check', function () {
                        expect(mockedTimeout).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when got upgrade status from api unsuccessfully', function () {
                describe('when timeout == 0', function () {
                    beforeEach(function () {
                        bard.mockService(upgradeFactory, {
                            getStatus: $q.reject(errorResponse)
                        });

                        upgradeStatusFactory.waitForStepToEnd(
                            testedStep, pollingInterval, mockedSuccessCallback, mockedErrorCallback, null, 0
                        );

                        $rootScope.$digest();
                    });

                    it('should not call success callback', function () {
                        expect(mockedSuccessCallback).not.toHaveBeenCalled();
                    });

                    it('should call error callback', function () {
                        expect(mockedErrorCallback).toHaveBeenCalledTimes(1);
                        expect(mockedErrorCallback).toHaveBeenCalledWith(errorResponse);
                    });

                    it('should not schedule another check', function () {
                        expect(mockedTimeout).not.toHaveBeenCalled();
                    });
                });

                describe('when timeout > 0', function () {
                    beforeEach(function () {
                        bard.mockService(upgradeFactory, {
                            getStatus: $q.reject()
                        });

                        upgradeStatusFactory.waitForStepToEnd(
                            testedStep, 1, mockedSuccessCallback, mockedErrorCallback, null, 10
                        );

                        $rootScope.$digest();
                    });

                    it('should not call success callback', function () {
                        expect(mockedSuccessCallback).not.toHaveBeenCalled();
                    });

                    it('should not call error callback', function () {
                        expect(mockedErrorCallback).not.toHaveBeenCalled();
                    });

                    it('should schedule another check', function () {
                        expect(mockedTimeout).toHaveBeenCalledTimes(1);
                        expect(mockedTimeout).toHaveBeenCalledWith(
                            upgradeStatusFactory.waitForStepToEnd, 1, true,
                            testedStep, 1, mockedSuccessCallback, mockedErrorCallback, null, 9
                        );
                    });
                });

            })
        });

    });

});
