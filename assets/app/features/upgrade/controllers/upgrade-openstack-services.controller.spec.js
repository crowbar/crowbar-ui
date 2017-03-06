/*global bard $controller $httpBackend should assert upgradeFactory $q $rootScope
  upgradeStepsFactory upgradeStatusFactory UNEXPECTED_ERROR_DATA */
describe('openStack Services Controller', function() {
    var controller,
        failingErrors = {
            auth_error: { data: 'Authentication failure', help: 'Please authenticate' },
        },
        initialStatusResponseData = {
            current_step: 'services',
            substep: null,
            current_node: null,
            remaining_nodes: null,
            upgraded_nodes: null,
            steps: {
                prechecks: {
                    status: 'passed',
                    errors: {}
                },
                prepare: {
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
                    status: 'passed',
                    errors: {}
                },
                repocheck_nodes: {
                    status: 'passed',
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
            }
        },
        initialStatusResponse = {
            data: initialStatusResponseData,
        },
        failedStatusData = _.merge(
            {},
            initialStatusResponseData,
            {
                steps: {
                    services: {
                        status: 'failed',
                        errors: failingErrors,
                    }
                }
            }
        ),
        failedStatusResponse = {
            data: failedStatusData,
        },
        failingResponse = {
            data: {
                errors: failingErrors
            }
        },
        emptyResponse = {
            data: {}
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject('$controller', '$rootScope',
            'upgradeFactory', '$q', '$httpBackend', 'upgradeStatusFactory',
            'upgradeStepsFactory', 'UNEXPECTED_ERROR_DATA');

        spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
            // make sure postSync is called even in test scenarios
            function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                postSync(initialStatusResponse);
            }
        );
        spyOn(upgradeStepsFactory, 'setCurrentStepCompleted');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

        //Create the controller
        controller = $controller('UpgradeOpenStackServicesController');
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function() {
        should.exist(controller);
    });

    describe('openStackServices Model', function () {
        it('should be defined', function () {
            should.exist(controller.openStackServices);
        });

        it('is not completed by default', function() {
            assert.isFalse(controller.openStackServices.completed);
        });

        it('is not running by default', function() {
            assert.isFalse(controller.openStackServices.running);
        });

        describe('stopServices function', function () {
            it('should be defined', function () {
                should.exist(controller.openStackServices.stopServices);
            });

            describe('when services stop successfully', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.when(),
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess/*, onError*/) { onSuccess(); }
                    );
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should set openStackServices.completed status to true', function () {
                    assert.isTrue(controller.openStackServices.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.openStackServices.running);
                });

                it('should call stopOpenstack service', function () {
                    assert.isTrue(upgradeFactory.stopServices.calledOnce);
                });

                it('should start polling for status', function () {
                    expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledTimes(1);
                });
            });

            describe('when stopping services fail', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.when()
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess, onError) { onError(failedStatusResponse); }
                    );
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should leave openStackServices.completed status at false', function () {
                    assert.isFalse(controller.openStackServices.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.openStackServices.running);
                });

                it('should expose the errors through vm.openStackServices.errors object', function () {
                    expect(controller.errors).toEqual(failingResponse.data);
                });

            });

            describe('when stopServices call fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.reject(failingResponse)
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd');

                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should leave openStackServices.completed status at false', function () {
                    assert.isFalse(controller.openStackServices.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.openStackServices.running);
                });

                it('should not start polling for status', function () {
                    expect(upgradeStatusFactory.waitForStepToEnd).not.toHaveBeenCalled();
                });

                it('should expose the errors through vm.openStackServices.errors object', function () {
                    expect(controller.errors).toEqual(failingResponse.data);
                });
            });

            describe('when stopServices call fails unexpectedly', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.reject(emptyResponse)
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd');

                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should leave openStackServices.completed status at false', function () {
                    assert.isFalse(controller.openStackServices.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.openStackServices.running);
                });

                it('should not start polling for status', function () {
                    expect(upgradeStatusFactory.waitForStepToEnd).not.toHaveBeenCalled();
                });

                it('should expose default errors data through vm.openStackServices.errors object', function () {
                    expect(controller.errors).toEqual(UNEXPECTED_ERROR_DATA);
                });

            });
        });

    });

});
