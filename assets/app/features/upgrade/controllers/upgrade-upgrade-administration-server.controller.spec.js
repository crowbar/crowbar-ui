/* global bard $controller should $httpBackend upgradeStatusFactory
   upgradeFactory crowbarFactory assert $q $rootScope */
describe('Upgrade Flow - Upgrade Administration Server Controller', function () {
    var controller,
        completedUpgradeResponseData = {
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
        initialResponseData = {
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
                    status: 'pending',
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
        activeStatusResponse = { data: null };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', '$q', '$httpBackend', '$rootScope',
            'crowbarFactory', 'upgradeFactory', 'upgradeStatusFactory'
        );

        // reset the active response to the default values
        activeStatusResponse.data = initialResponseData;
        bard.mockService(upgradeFactory, {
            getStatus: $q.when(activeStatusResponse)
        });

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
        it('should set running to true if the upgrade is running', function () {
            activeStatusResponse.data = incompleteUpgradeResponseData;
            // recreate the controller so it can pick our modified initialResponse
            controller = $controller('UpgradeUpgradeAdministrationServerController');
            $rootScope.$digest();
            // initial model should have changed based on the initialization response
            assert.isFalse(controller.adminUpgrade.completed);
            assert.isTrue(controller.adminUpgrade.running);
        });

        it('should set completed to true if upgrade is completed', function () {
            activeStatusResponse.data = completedUpgradeResponseData;
            controller = $controller('UpgradeUpgradeAdministrationServerController');
            $rootScope.$digest();
            assert.isTrue(controller.adminUpgrade.completed);
            assert.isFalse(controller.adminUpgrade.running);
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
            'crowbarFactory', 'upgradeFactory', 'upgradeStatusFactory'
        );

        bard.mockService(upgradeFactory, {
            getStatus: $q.reject(errorResponse)
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
