/*global bard $controller should $httpBackend crowbarFactory assert $q $rootScope */
describe('Upgrade Flow - Upgrade Administration Server Controller', function () {
    var controller,
        completedUpgradeResponse = {
            data: { completed: true }
        },
        incompleteUpgradeResponse = {
            data: { completed: false }
        },
        errorList = ['1', '2', '3'],
        errorResponse = {
            data: { errors: errorList }
        },
        mockedTimeout;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$q', '$httpBackend', '$rootScope', 'crowbarFactory');

        mockedTimeout = jasmine.createSpy('$timeout');

        //Create the controller
        controller = $controller('UpgradeUpgradeAdministrationServerController', { '$timeout': mockedTimeout });

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function () {
        should.exist(controller);
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
                    spyOn(controller.adminUpgrade, 'checkAdminUpgrade');

                    bard.mockService(crowbarFactory, {
                        upgrade: $q.when(incompleteUpgradeResponse)
                    });
                    controller.adminUpgrade.beginAdminUpgrade();
                    $rootScope.$digest();
                });

                it('should set running to true', function () {
                    assert.isTrue(controller.adminUpgrade.running);
                });

                it('should call checkAdminUpgrade() to start polling', function () {
                    expect(controller.adminUpgrade.checkAdminUpgrade).toHaveBeenCalledTimes(1);
                });
            });

            describe('when starting upgrade failed', function () {
                beforeEach(function () {
                    spyOn(controller.adminUpgrade, 'checkAdminUpgrade');

                    bard.mockService(crowbarFactory, {
                        upgrade: $q.reject(errorResponse)
                    });
                    controller.adminUpgrade.beginAdminUpgrade();
                    $rootScope.$digest();
                });

                it('should leave running at false', function () {
                    assert.isFalse(controller.adminUpgrade.running);
                });

                it('should not call checkAdminUpgrade()', function () {
                    expect(controller.adminUpgrade.checkAdminUpgrade).not.toHaveBeenCalled();
                });

                it('should expose the errors through adminUpgrade.errors object', function () {
                    expect(controller.adminUpgrade.errors).toEqual(errorList);
                });
            });

        });

        describe('checkAdminUpgrade function', function () {
            it('should be defined', function () {
                should.exist(controller.adminUpgrade.checkAdminUpgrade);
                expect(controller.adminUpgrade.checkAdminUpgrade).toEqual(jasmine.any(Function));
            });

            describe('when got upgrade status from api successfully', function () {
                describe('when received status is completed', function () {
                    beforeEach(function () {
                        bard.mockService(crowbarFactory, {
                            getUpgradeStatus: $q.when(completedUpgradeResponse)
                        });
                        controller.adminUpgrade.checkAdminUpgrade();
                        $rootScope.$digest();
                    });

                    it('should set running attribute of adminUpgrade model to false', function () {
                        assert.isFalse(controller.adminUpgrade.running);
                    });
                    it('should set completed flag to true', function () {
                        assert.isTrue(controller.adminUpgrade.completed);
                    });
                    it('should not schedule another check', function () {
                        expect(mockedTimeout).not.toHaveBeenCalled();
                    });
                });

                describe('when received status is not completed', function () {
                    beforeEach(function () {
                        bard.mockService(crowbarFactory, {
                            getUpgradeStatus: $q.when(incompleteUpgradeResponse)
                        });
                        controller.adminUpgrade.running = true;
                        controller.adminUpgrade.checkAdminUpgrade();
                        $rootScope.$digest();
                    });
                    it('should keep running flag set to true', function () {
                        assert.isTrue(controller.adminUpgrade.running);
                    });
                    it('should keep completed flag set to false', function () {
                        assert.isFalse(controller.adminUpgrade.completed);
                    });
                    it('should schedule another check', function () {
                        // TODO: remove magic number (1000)?!
                        expect(mockedTimeout).toHaveBeenCalledWith(controller.adminUpgrade.checkAdminUpgrade, 1000);
                    });
                });
            });

            describe('when got error from api', function () {
                beforeEach(function () {
                    bard.mockService(crowbarFactory, {
                        getUpgradeStatus: $q.reject(errorResponse)
                    });
                    controller.adminUpgrade.checkAdminUpgrade();
                    $rootScope.$digest();
                });
                it('should expose the errors through adminUpgrade.errors object', function () {
                    expect(controller.adminUpgrade.errors).toEqual(errorList);
                });
            });
        });
    });
});
