/*global bard $controller $httpBackend should assert upgradeFactory $q $rootScope
  upgradeStepsFactory upgradeStatusFactory */
describe('openStack Services Controller', function() {
    var controller,
        failingOpenStackServices = {},
        passingOpenStackBackup = {},
        failingOpenStackBackup = {},
        failingErrors = {
            error_message: 'Authentication failure'
        },
        failingOpenStackServicesResponse = {
            data: failingOpenStackServices
        },
        passingBackupResponse = {
            data: passingOpenStackBackup
        },
        failingBackupResponse = {
            data: failingOpenStackBackup
        },
        failingResponse = {
            data: {
                errors: failingErrors
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject('$controller', '$rootScope',
            'upgradeFactory', '$q', '$httpBackend', 'upgradeStatusFactory',
            'upgradeStepsFactory');

        spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
            // make sure postSync is called even in test scenarios
            function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                if (angular.isFunction(postSync)) {
                    postSync();
                }
            }
        );
        spyOn(upgradeStepsFactory, 'setCurrentStepCompleted');

        //Create the controller
        controller = $controller('UpgradeOpenStackServicesController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function() {
        should.exist(controller);
    });

    describe('checks', function () {

        it('should be defined', function () {
            should.exist(controller.checks);
        });

        it('should all be set to false', function () {
            assert.isObject(controller.checks);
            _.forEach(controller.checks, function(value) {
                assert.isFalse(value.status);
            });
        });

        it('all should have a label set', function () {
            assert.isObject(controller.checks);
            _.forEach(controller.checks, function(key, value) {
                expect(key.label).toEqual('upgrade.steps.openstack-services.codes.' + value);
            });
        });
    });

    describe('openStackServices Model', function () {
        it('should be defined', function () {
            should.exist(controller.openStackServices);
        });

        it('is not completed by default', function() {
            assert.isFalse(controller.checks.services.completed);
        });

        it('is not running by default', function() {
            assert.isFalse(controller.checks.services.running);
        });

        describe('stopServices function', function () {
            it('should be defined', function () {
                should.exist(controller.openStackServices.stopServices);
            });

            describe('when services check and backup check pass successfully', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.when(),
                        createOpenstackBackup: $q.when(passingBackupResponse),
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess/*, onError*/) { onSuccess(); }
                    );
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should set checks.services.completed status to true', function () {
                    assert.isTrue(controller.checks.services.completed);
                });

                it('should set checks.services.status status to true', function () {
                    assert.isTrue(controller.checks.services.status);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.checks.services.running);
                });

                it('should call stopOpenstack service', function () {
                    assert.isTrue(upgradeFactory.stopServices.calledOnce);
                });

                it('should update services check value to true', function () {
                    assert.isTrue(controller.checks.services.status);
                });

                it('should set checks.backup.completed status to true', function () {
                    assert.isTrue(controller.checks.backup.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.checks.backup.running);
                });

                it('should call backup service', function () {
                    assert.isTrue(upgradeFactory.createOpenstackBackup.calledOnce);
                });

                it('should update backup check value to true', function () {
                    assert.isTrue(controller.checks.backup.status);
                });

            });

            describe('when services check pass successfull and backup check fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.when(),
                        createOpenstackBackup: $q.reject(failingBackupResponse),
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess/*, onError*/) { onSuccess(); }
                    );
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should set checks.services.completed status to true', function () {
                    assert.isTrue(controller.checks.services.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.checks.services.running);
                });

                it('should call stopOpenstack service', function () {
                    assert.isTrue(upgradeFactory.stopServices.calledOnce);
                });

                it('should update services check value to true', function () {
                    assert.isTrue(controller.checks.services.status);
                });

                it('should set checks.backup.completed status to true', function () {
                    assert.isTrue(controller.checks.backup.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.checks.backup.running);
                });

                it('should call backup service', function () {
                    assert.isTrue(upgradeFactory.createOpenstackBackup.calledOnce);
                });

                it('should update backup check value to false', function () {
                    assert.isFalse(controller.checks.backup.status);
                });

            });

            describe('when services check pass successfull and backup service call fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.when(),
                        createOpenstackBackup: $q.reject(failingResponse),
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess/*, onError*/) { onSuccess(); }
                    );
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should set checks.services.completed status to true', function () {
                    assert.isTrue(controller.checks.services.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.checks.services.running);
                });

                it('should call stopOpenstack service', function () {
                    assert.isTrue(upgradeFactory.stopServices.calledOnce);
                });

                it('should update services check value to true', function () {
                    assert.isTrue(controller.checks.services.status);
                });

                it('should set checks.backup.completed status to true', function () {
                    assert.isTrue(controller.checks.backup.completed);
                });

                it('should set checks.backup.status status to false', function () {
                    assert.isFalse(controller.checks.backup.status);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.checks.backup.running);
                });

                it('should call backup service', function () {
                    assert.isTrue(upgradeFactory.createOpenstackBackup.calledOnce);
                });

                it('should expose the errors through vm.openStackServices.errors object', function () {
                    expect(controller.errors).toEqual(failingResponse.data);
                });

            });

            describe('when services check fails', function () {
                beforeEach(function () {
                    spyOn(upgradeFactory, 'createOpenstackBackup');

                    bard.mockService(upgradeFactory, {
                        stopServices: $q.reject(failingOpenStackServicesResponse)
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess, onError) { onError(); }
                    );
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();

                });

                it('should set checks.services.completed status to true', function () {
                    assert.isTrue(controller.checks.services.completed);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.checks.services.running);
                });

                it('should call stopOpenstack service', function () {
                    assert.isTrue(upgradeFactory.stopServices.calledOnce);
                });

                it('should update services checks values to false', function () {
                    assert.isFalse(controller.checks.services.status);
                });

                it('should not call backup service', function () {
                    expect(upgradeFactory.createOpenstackBackup).not.toHaveBeenCalled();
                });

            });

            describe('when stopOpenstack service call fails', function () {
                beforeEach(function () {
                    spyOn(upgradeFactory, 'createOpenstackBackup');
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.reject(failingResponse)
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd').and.callFake(
                        function (step, interval, onSuccess, onError) { onError(); }
                    );
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should set checks.services.completed status to true', function () {
                    assert.isTrue(controller.checks.services.completed);
                });

                it('should set checks.services.status status to false', function () {
                    assert.isFalse(controller.checks.services.status);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.checks.services.running);
                });

                it('should not call backup service', function () {
                    expect(upgradeFactory.createOpenstackBackup).not.toHaveBeenCalled();
                });

                it('should expose the errors through vm.openStackServices.errors object', function () {
                    expect(controller.errors).toEqual(failingResponse.data);
                });

            });

            describe('when services were stopped already before and backup was not created', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.when(),
                        createOpenstackBackup: $q.when(),
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd');

                    controller.checks.services.status = true;
                    controller.checks.backup.status = false;

                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should not set running to true', function () {
                    assert.isFalse(controller.checks.services.running);
                });

                it('should not call stopOpenstack service', function () {
                    assert.isFalse(upgradeFactory.stopServices.called);
                });

                it('should start backup creation', function () {
                    assert.isTrue(upgradeFactory.createOpenstackBackup.calledOnce);
                });
            });

            describe('when services were stopped already before and backup was created', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        stopServices: $q.when(),
                        createOpenstackBackup: $q.when(),
                    });
                    spyOn(upgradeStatusFactory, 'waitForStepToEnd');

                    controller.checks.services.status = true;
                    controller.checks.backup.status = true;

                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should not set running to true', function () {
                    assert.isFalse(controller.checks.services.running);
                });

                it('should not call stopOpenstack service', function () {
                    assert.isFalse(upgradeFactory.stopServices.called);
                });

                it('should not start backup creation', function () {
                    assert.isFalse(upgradeFactory.createOpenstackBackup.called);
                });
            });
        });

    });

});
