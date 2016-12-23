/* global bard $controller should $httpBackend upgradeStatusFactory
   crowbarFactory assert $q $rootScope upgradeStepsFactory
   UPGRADE_STEPS ADMIN_UPGRADE_TIMEOUT_INTERVAL ADMIN_UPGRADE_ALLOWED_DOWNTIME */
describe('Upgrade Flow - Upgrade Administration Server Controller', function () {
    var controller;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', '$q', '$httpBackend', '$rootScope',
            'crowbarFactory', 'upgradeStatusFactory', 'upgradeStepsFactory'
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
                'admin_upgrade', controller.adminUpgrade,
                jasmine.any(Function), upgradeStepsFactory.setCurrentStepCompleted
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
                        UPGRADE_STEPS.admin_upgrade,
                        ADMIN_UPGRADE_TIMEOUT_INTERVAL,
                        jasmine.any(Function),
                        jasmine.any(Function),
                        null,
                        ADMIN_UPGRADE_ALLOWED_DOWNTIME
                    );
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
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', '$q', '$httpBackend', '$rootScope',
            'crowbarFactory', 'upgradeStatusFactory'
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
            describe('when starting upgrade failed', function () {
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

                it('should expose the errors through adminUpgrade.errors object', function () {
                    expect(controller.adminUpgrade.errors).toEqual(errorList);
                });
            });
        });
    });
});
