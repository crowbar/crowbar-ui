/* global bard $controller should $httpBackend upgradeStatusFactory
   crowbarFactory assert $q $rootScope upgradeStepsFactory
   UPGRADE_STEPS ADMIN_UPGRADE_TIMEOUT_INTERVAL ADMIN_UPGRADE_ALLOWED_DOWNTIME
   UNEXPECTED_ERROR_DATA */
describe('Upgrade Flow - Upgrade Administration Server Controller', function () {
    var controller;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', '$q', '$httpBackend', '$rootScope',
            'crowbarFactory', 'upgradeStatusFactory', 'upgradeStepsFactory',
            'UNEXPECTED_ERROR_DATA'
        );

        spyOn(upgradeStatusFactory, 'syncStatusFlags');
        spyOn(upgradeStepsFactory, 'setCurrentStepCompleted');

        //Create the controller
        controller = $controller('UpgradeUpgradeAdministrationServerController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function () {
        should.exist(controller);
    });

    describe('on controller creation', function () {
        it('should call syncStatusFlags() to update the state', function () {
            expect(upgradeStatusFactory.syncStatusFlags).toHaveBeenCalledWith(
                'admin', controller.adminUpgrade,
                jasmine.any(Function), jasmine.any(Function), null,
                jasmine.any(Function)
            );
        });
    });

    describe('adminUpgrade model', function () {
        it('should exist', function() {
            should.exist(controller.adminUpgrade);
        });

        it('is not completed by default', function() {
            assert.isFalse(controller.adminUpgrade.completed);
        });

        it('is not running by default', function() {
            assert.isFalse(controller.adminUpgrade.running);
        });

        describe('beginAdminUpgrade function', function () {
            it('should be defined', function () {
                should.exist(controller.adminUpgrade.beginAdminUpgrade);
                expect(controller.adminUpgrade.beginAdminUpgrade).toEqual(jasmine.any(Function));
            });

            describe('when upgrade is started successfully', function () {
                beforeEach(function () {
                    bard.inject('UPGRADE_STEPS', 'ADMIN_UPGRADE_TIMEOUT_INTERVAL', 'ADMIN_UPGRADE_ALLOWED_DOWNTIME');
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd');

                    bard.mockService(crowbarFactory, {
                        upgrade: $q.when({})
                    });
                    controller.adminUpgrade.beginAdminUpgrade();
                    $rootScope.$digest();
                });

                it('should set running to true', function () {
                    assert.isTrue(controller.adminUpgrade.running);
                });

                it('should call waitForStepToEnd() to start polling', function () {
                    expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledTimes(1);
                    expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledWith(
                        UPGRADE_STEPS.admin,
                        ADMIN_UPGRADE_TIMEOUT_INTERVAL,
                        jasmine.any(Function),
                        jasmine.any(Function),
                        null,
                        ADMIN_UPGRADE_ALLOWED_DOWNTIME
                    );
                });
            });

            describe('when upgrade is finished successfully', function () {
                beforeEach(function () {
                    bard.mockService(upgradeStatusFactory, {
                        waitForStepToEnd: function (step, interval, onSuccess/*, onError*/) { onSuccess(); }
                    });
                    bard.mockService(crowbarFactory, {
                        upgrade: $q.when({})
                    });

                    controller.adminUpgrade.beginAdminUpgrade();

                    $rootScope.$digest();
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.adminUpgrade.running);
                });
                it('should set completed to true', function () {
                    assert.isTrue(controller.adminUpgrade.completed);
                });
            });
        });
    });
});

describe('Upgrade Flow - Upgrade Administration Server Controller - errors', function () {
    var controller,
        errorList = ['1', '2', '3'],
        // TODO(itxaka): change this to the proper response from the API
        errorResponse = {
            data: { errors: errorList }
        },
        errorStatusResponse = {
            data: {
                current_step: 'admin',
                substep: null,
                current_node: null,
                steps: {
                    prechecks: {
                        status: 'passed',
                    },
                    prepare: {
                        status: 'passed',
                    },
                    backup_crowbar: {
                        status: 'passed',
                    },
                    repocheck_crowbar: {
                        status: 'passed',
                    },
                    admin: {
                        status: 'failed',
                        errors: {
                            err1: { data: 'err1 data', help: 'err1 help' },
                            err2: { data: 'err2 data', help: 'err2 help' }
                        }
                    },
                    database: {
                        status: 'pending',
                    },
                    repocheck_nodes: {
                        status: 'pending',
                    },
                    services: {
                        status: 'pending',
                    },
                    backup_openstack: {
                        status: 'pending',
                    },
                    nodes: {
                        status: 'pending',
                    },
                    finished: {
                        status: 'pending',
                    }
                }
            }
        },
        emptyResponse = {
            data: {}
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', '$q', '$httpBackend', '$rootScope',
            'crowbarFactory', 'upgradeStatusFactory',
            'UNEXPECTED_ERROR_DATA'
        );

        bard.mockService(upgradeStatusFactory, {
            syncStatusFlags: undefined,
        });

        //Create the controller
        controller = $controller('UpgradeUpgradeAdministrationServerController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    describe('adminUpgrade model', function () {
        describe('beginAdminUpgrade function', function () {
            describe('when starting upgrade failed with error info', function () {
                beforeEach(function () {
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd');

                    bard.mockService(crowbarFactory, {
                        upgrade: $q.reject(errorResponse)
                    });
                    controller.adminUpgrade.beginAdminUpgrade();
                    $rootScope.$digest();
                });

                it('should leave running at false', function () {
                    assert.isFalse(controller.adminUpgrade.running);
                });

                it('should not call waitForStepToEnd()', function () {
                    expect(upgradeStatusFactory.waitForStepToEnd).not.toHaveBeenCalled();
                });

                it('should expose the errors through errors object', function () {
                    expect(controller.errors.errors).toEqual(errorList);
                });
            });

            describe('when starting upgrade failed unexpectedly', function () {
                beforeEach(function () {
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd');

                    bard.mockService(crowbarFactory, {
                        upgrade: $q.reject(emptyResponse)
                    });
                    controller.adminUpgrade.beginAdminUpgrade();
                    $rootScope.$digest();
                });

                it('should leave running at false', function () {
                    assert.isFalse(controller.adminUpgrade.running);
                });

                it('should not call waitForStepToEnd()', function () {
                    expect(upgradeStatusFactory.waitForStepToEnd).not.toHaveBeenCalled();
                });

                it('should expose default error message through errors object', function () {
                    expect(controller.errors).toEqual(UNEXPECTED_ERROR_DATA);
                });
            });

            describe('when upgrade fails with error info', function () {
                beforeEach(function () {
                    // local change in mocked service
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess, onError) { onError(errorResponse); }
                    );
                    bard.mockService(crowbarFactory, {
                        upgrade: $q.when({})
                    });

                    controller.adminUpgrade.beginAdminUpgrade();

                    $rootScope.$digest();
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.adminUpgrade.running);
                });
                it('should leave completed at false', function () {
                    assert.isFalse(controller.adminUpgrade.completed);
                });
                it('should expose the errors through errors object', function () {
                    expect(controller.errors.errors).toEqual(errorList);
                });
            });

            describe('when upgrade fails with status response', function () {
                beforeEach(function () {
                    // local change in mocked service
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess, onError) { onError(errorStatusResponse); }
                    );
                    bard.mockService(crowbarFactory, {
                        upgrade: $q.when({})
                    });

                    controller.adminUpgrade.beginAdminUpgrade();

                    $rootScope.$digest();
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.adminUpgrade.running);
                });
                it('should leave completed at false', function () {
                    assert.isFalse(controller.adminUpgrade.completed);
                });
                it('should expose the errors through errors object', function () {
                    expect(controller.errors.errors).toEqual(errorStatusResponse.data.steps.admin.errors);
                });
            });

            describe('when upgrade fails unexpectedly', function () {
                beforeEach(function () {
                    // local change in mocked service
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess, onError) { onError(emptyResponse); }
                    );
                    bard.mockService(crowbarFactory, {
                        upgrade: $q.when({})
                    });

                    controller.adminUpgrade.beginAdminUpgrade();

                    $rootScope.$digest();
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.adminUpgrade.running);
                });
                it('should leave completed at false', function () {
                    assert.isFalse(controller.adminUpgrade.completed);
                });
                it('should expose default error message through errors object', function () {
                    expect(controller.errors).toEqual(UNEXPECTED_ERROR_DATA);
                });
            });
        });
    });
});
