/*global bard assert $q $rootScope should expect module upgradeFactory upgradeStatusFactory */
describe('Upgrade Status Factory', function () {
    var pollingInterval = 1234,
        testedStep = 'admin_upgrade',
        allowedDowntime = 4321,
        completedUpgradeResponseData = {
            current_step: 'database',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                    errors: {}
                },
                admin_backup: {
                    status: 'passed',
                    errors: {}
                },
                admin_repo_checks: {
                    status: 'passed',
                    errors: {}
                },
                admin_upgrade: {
                    status: 'passed',
                    errors: {}
                },
                database: {
                    status: 'pending',
                    errors: {}
                },
                nodes_repo_checks: {
                    status: 'pending',
                    errors: {}
                },
                nodes_services: {
                    status: 'pending',
                    errors: {}
                },
                nodes_db_dump: {
                    status: 'pending',
                    errors: {}
                },
                nodes_upgrade: {
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
            current_step: 'admin_upgrade',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                    errors: {}
                },
                admin_backup: {
                    status: 'passed',
                    errors: {}
                },
                admin_repo_checks: {
                    status: 'passed',
                    errors: {}
                },
                admin_upgrade: {
                    status: 'running',
                    errors: {}
                },
                database: {
                    status: 'pending',
                    errors: {}
                },
                nodes_repo_checks: {
                    status: 'pending',
                    errors: {}
                },
                nodes_services: {
                    status: 'pending',
                    errors: {}
                },
                nodes_db_dump: {
                    status: 'pending',
                    errors: {}
                },
                nodes_upgrade: {
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
        flagsObject,
        mockedSuccessCallback,
        mockedErrorCallback,
        mockedRunningCallback,
        mockedCompletedCallback,
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
                        testedStep, flagsObject, mockedRunningCallback, mockedCompletedCallback
                    );

                    $rootScope.$digest();
                });

                it('should call completed callback', function () {
                    expect(mockedCompletedCallback).toHaveBeenCalledTimes(1);
                });

                it('should not call running callback', function () {
                    expect(mockedRunningCallback).not.toHaveBeenCalled();
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
                        testedStep, flagsObject, mockedRunningCallback, mockedCompletedCallback
                    );

                    $rootScope.$digest();
                });

                it('should not call completed callback', function () {
                    expect(mockedCompletedCallback).not.toHaveBeenCalled();
                });

                it('should call running callback', function () {
                    expect(mockedRunningCallback).toHaveBeenCalledTimes(1);
                });

                it('should set completed flag to false', function () {
                    assert.isFalse(flagsObject.completed);
                });

                it('should set running flag to true', function () {
                    assert.isTrue(flagsObject.running);
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
                            testedStep, mockedSuccessCallback, mockedErrorCallback, pollingInterval
                        );

                        $rootScope.$digest();
                    });

                    it('should call success callback', function () {
                        expect(mockedSuccessCallback).toHaveBeenCalled();
                    });
                    it('should not call error callback', function () {
                        expect(mockedErrorCallback).not.toHaveBeenCalled();
                    });
                    it('should not schedule another check', function () {
                        expect(mockedTimeout).not.toHaveBeenCalled();
                    });
                });

                describe('when received status is not completed', function () {
                    beforeEach(function () {
                        bard.mockService(upgradeFactory, {
                            getStatus: $q.when(incompleteUpgradeResponse)
                        });

                        upgradeStatusFactory.waitForStepToEnd(
                            testedStep, mockedSuccessCallback, mockedErrorCallback, pollingInterval, allowedDowntime
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
                        expect(mockedTimeout).toHaveBeenCalledWith(
                            upgradeStatusFactory.waitForStepToEnd, pollingInterval, true,
                            testedStep, mockedSuccessCallback, mockedErrorCallback, pollingInterval, allowedDowntime
                        );
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
                            testedStep, mockedSuccessCallback, mockedErrorCallback, pollingInterval, 0
                        );

                        $rootScope.$digest();
                    });

                    it('should not call success callback', function () {
                        expect(mockedSuccessCallback).not.toHaveBeenCalled();
                    });

                    it('should call error callback', function () {
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
                            testedStep, mockedSuccessCallback, mockedErrorCallback, 1, 10
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
                    });
                });

            })
        });

    });

});
