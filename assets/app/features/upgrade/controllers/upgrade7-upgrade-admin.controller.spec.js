/*global bard $controller should $httpBackend upgradeUpgradeAdminFactory assert $q $rootScope */
describe('Upgrade Flow - Upgrade Admin Server Controller', function () {
    var controller,
/*        completedUpgradeResponse = {
            completed: true
        },*/
        incompleteUpgradeResponse = {
            completed: false
        },
        errorList = ['1', '2', '3'],
        errorResponse = {
            data: { errors: errorList }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$q', '$httpBackend', '$rootScope', 'upgradeUpgradeAdminFactory');

        //Create the controller
        controller = $controller('Upgrade7UpgradeAdminController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function () {
        should.exist(controller);
    });

    describe('nextStep function', function () {
        it('should be defined', function () {});

        it('should redirect the user to "Create or Connect to Database" page when admin upgrade is successfull',
        function () {
        });

        it('should retain the user on the curent page until the admin upgrade is completed', function () {});
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
            });

            describe('when upgrade is started successfully', function () {
                beforeEach(function () {
                    spyOn(controller.adminUpgrade, 'checkAdminUpgrade');

                    bard.mockService(upgradeUpgradeAdminFactory, {
                        getAdminUpgrade: $q.when(incompleteUpgradeResponse)
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

                    bard.mockService(upgradeUpgradeAdminFactory, {
                        getAdminUpgrade: $q.reject(errorResponse)
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
            });

            describe('when got upgrade status from api successfully', function () {
                describe('when received status is completed', function () {
                    it('should enable "Next button"', function () {});
                    it('should set running attribute of adminUpgrade model to false', function () {});
                    it('should set completed flag set to true', function () {});
                });

                describe('when received status is not completed', function () {
                    it('should keep "Next button" disabled', function () {});
                    it('should keep running flag set to true', function () {});
                    it('should keep completed flag set to false', function () {});
                    it('should schedule another check', function () {});
                });
            });

            describe('when got error from api', function () {
                it('should expose the errors through adminUpgrade.errors object', function () {
//                    expect(controller.adminUpgrade.errors).toEqual(errorList);
                });
            });
        });
    });

/*    describe('cancelUpgrade function', function () {
        it('should be defined', function () {});

        describe('before trigger Admin Node Upgrade', function () {
            it('should be enabled', function () {});

            describe('cancel modal', function () {
                it('should be displayed when cancel button is clicked', function () {});

                it('should trigger the cancellation routine upon user confirmation', function () {});

                it('should be closed and let the user continue with the upgrade flow when canceled', function () {});

            });

        });

        describe('after trigger Admin Node Upgrade', function () {
            it('should be disabled', function () {});

        });

    });*/
});
