/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert upgradeFactory upgradeStatusFactory
  crowbarFactory $q $rootScope module $state UPGRADE_STEPS PREPARE_TIMEOUT_INTERVAL */
describe('Upgrade Landing Controller', function() {
    var controller,
        completedUpgradeResponseData = {
            current_step: 'backup_crowbar',
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
                    status: 'pending',
                },
                repocheck_crowbar: {
                    status: 'pending',
                },
                admin: {
                    status: 'pending',
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
        },
        completedUpgradeResponse = {
            data: completedUpgradeResponseData,
        },
        incompleteUpgradeResponseData = {
            current_step: 'prepare',
            substep: null,
            current_node: null,
            steps: {
                prechecks: {
                    status: 'passed',
                },
                prepare: {
                    status: 'running',
                },
                backup_crowbar: {
                    status: 'pending',
                },
                repocheck_crowbar: {
                    status: 'pending',
                },
                admin: {
                    status: 'pending',
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
        },
        incompleteUpgradeResponse = {
            data: incompleteUpgradeResponseData,
        },
        initialResponseData = {
            current_step: 'prechecks',
            substep: null,
            current_node: null,
            steps: {
                prechecks: {
                    status: 'pending',
                },
                prepare: {
                    status: 'pending',
                },
                backup_crowbar: {
                    status: 'pending',
                },
                repocheck_crowbar: {
                    status: 'pending',
                },
                admin: {
                    status: 'pending',
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
        },
        initialStatusResponse = {
            data: initialResponseData,
        },
        passingChecks = {
            maintenance_updates_installed: { required: true, passed: true },
            network_checks: { required: true, passed: true },
            cloud_healthy: { required: true, passed: true },
            clusters_healthy: { required: false, passed: true },
            ceph_healthy: { required: false, passed: true },
            compute_resources_available: { required: false, passed: true }
        },
        failingChecks = {
            maintenance_updates_installed: { required: true, passed: false },
            network_checks: { required: true, passed: false },
            cloud_healthy: { required: true, passed: false },
            clusters_healthy: { required: false, passed: false },
            ceph_healthy: { required: false, passed: false },
            compute_resources_available: { required: false, passed: false }
        },
        partiallyFailingChecks = {
            maintenance_updates_installed: { required: true, passed: true },
            network_checks: { required: true, passed: true },
            cloud_healthy: { required: true, passed: true },
            clusters_healthy: { required: false, passed: false },
            ceph_healthy: { required: false, passed: false },
            compute_resources_available: { required: true, passed: true }
        },
        failingErrors = {
            error_message: 'Authentication failure'
        },
        passingChecksResponse = {
            data: { checks: passingChecks, best_method: 'non-disruptive' }
        },
        failingChecksResponse = {
            data: { checks: failingChecks, best_method: 'none' }
        },
        partiallyFailingChecksResponse = {
            data: { checks: partiallyFailingChecks, best_method: 'disruptive' }
        },
        failingResponse = {
            data: {
                errors: failingErrors
            }
        },
        entityResponseWithAddons = {
            data: {
                addons: ['ha', 'ceph']
            }
        },
        entityResponseWithoutAddons = {
            data: {
                addons: []
            }
        };

    beforeEach(function() {
        // load ngSanitize to make translations happy
        module('ngSanitize');

        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject('$controller', '$rootScope', 'upgradeFactory',
            'crowbarFactory', '$q', '$httpBackend', 'upgradeStatusFactory');

        bard.mockService(crowbarFactory, {
            getEntity: $q.when(entityResponseWithAddons)
        });

        bard.mockService(upgradeFactory, {
            getStatus: $q.when(initialStatusResponse),
        });

        spyOn(upgradeStatusFactory, 'waitForStepToEnd');

        controller = $controller('UpgradeLandingController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function() {
        should.exist(controller);
    });

    describe('when created while prepare is not running', function() {
        it('should not start polling for status', function() {
            expect(upgradeStatusFactory.waitForStepToEnd).not.toHaveBeenCalled();
        });

        it('prepare should not be running', function() {
            assert.isFalse(controller.prepare.running);
        });

        it('prepare should not be completed', function() {
            assert.isFalse(controller.prepare.completed);
        });
    });

    describe('when created while prepare is running', function() {
        beforeEach(function() {
            bard.inject('UPGRADE_STEPS', 'PREPARE_TIMEOUT_INTERVAL');
            // local change in mocked service
            spyOn(upgradeFactory, 'getStatus').and.returnValue($q.when(incompleteUpgradeResponse));

            controller = $controller('UpgradeLandingController');

            $rootScope.$digest();
        });

        it('should start polling for status', function() {
            expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledTimes(1);
            expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledWith(
                UPGRADE_STEPS.prepare,
                PREPARE_TIMEOUT_INTERVAL,
                jasmine.any(Function),
                jasmine.any(Function)
            );
        });

        it('prepare should be running', function() {
            assert.isTrue(controller.prepare.running);
        });

        it('prepare should not be completed', function() {
            assert.isFalse(controller.prepare.completed);
        });
    });

    describe('when created after prepare is finished', function() {
        beforeEach(function() {
            // local change in mocked service
            spyOn(upgradeFactory, 'getStatus').and.returnValue($q.when(completedUpgradeResponse));

            controller = $controller('UpgradeLandingController');

            $rootScope.$digest();
        });

        it('should not start polling for status', function() {
            expect(upgradeStatusFactory.waitForStepToEnd).not.toHaveBeenCalled();
        });

        it('prepare should not be running', function() {
            assert.isFalse(controller.prepare.running);
        });

        it('prepare should be completed', function() {
            assert.isTrue(controller.prepare.completed);
        });
    });


    describe('Begin Upgrade', function() {
        it('should have a beginUpgrade function defined', function() {
            should.exist(controller.beginUpgrade);
        });
    });

    it('should have a continueNormal function defined', function () {
        should.exist(controller.continueNormal);
    });

    describe('Prechecks object', function() {

        it('should exist', function() {
            should.exist(controller.prechecks);
        });

        it('is not completed by default', function() {
            assert.isFalse(controller.prechecks.completed);
        });

        it('is not valid by default', function() {
            assert.isFalse(controller.prechecks.valid);
        });

        describe('contains a collection of checks that', function () {

            it('should be defined', function () {
                should.exist(controller.prechecks.checks);
            });

            it('should all be set to false', function () {
                assert.isObject(controller.prechecks.checks);
                _.forEach(controller.prechecks.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });

            it('should contain checks for addons', function () {
                expect(controller.prechecks.checks).toEqual(
                    jasmine.objectContaining({
                        'clusters_healthy': jasmine.objectContaining({
                            status: jasmine.any(Boolean),
                            label: 'upgrade.steps.landing.prechecks.codes.high_availability'
                        }),
                        'ceph_healthy': jasmine.objectContaining({
                            status: jasmine.any(Boolean),
                            label: 'upgrade.steps.landing.prechecks.codes.storage'
                        })
                    }));
            });
        });

        describe('with no addons installed', function () {
            beforeEach(function () {
                // local change in mocked service
                spyOn(crowbarFactory, 'getEntity').and.returnValue($q.when(entityResponseWithoutAddons));

                controller = $controller('UpgradeLandingController');
            });

            it('should not contain checks for addons', function () {
                expect(controller.prechecks.checks).not.toEqual(
                    jasmine.objectContaining({
                        'clusters_healthy': jasmine.anything(),
                        'ceph_healthy': jasmine.anything()
                    }));
            });
        });

        describe('runPrechecks function', function() {

            it('is defined', function() {
                should.exist(controller.prechecks.runPrechecks);
            });

            describe('when checks pass successfully', function () {
                beforeEach(function () {
                    // local change in mocked service
                    spyOn(upgradeFactory, 'getPreliminaryChecks').and.returnValue($q.when(passingChecksResponse));

                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to true', function () {
                    assert.isTrue(controller.prechecks.valid);
                });

                it('should update checks values to true', function () {
                    assert.isObject(controller.prechecks.checks);
                    _.forEach(controller.prechecks.checks, function(value) {
                        assert.isTrue(value.status);
                    });
                });

                it('should set the mode to non-disruptive', function () {
                    expect(controller.mode.type).toEqual('non-disruptive');
                });

                it('should set the mode.valid to true', function () {
                    assert.isTrue(controller.mode.valid);
                });

                it('should set the mode.active to true', function () {
                    assert.isTrue(controller.mode.active);
                });

            });

            describe('when checks fails', function () {
                beforeEach(function () {
                    // local change in mocked service
                    spyOn(upgradeFactory, 'getPreliminaryChecks').and.returnValue($q.when(failingChecksResponse));

                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to false', function () {
                    assert.isFalse(controller.prechecks.valid);
                });

                it('should update required checks values to false', function () {
                    assert.isObject(controller.prechecks.checks);
                    _.forEach(controller.prechecks.checks, function(value) {
                        assert.isFalse(value.status);
                    });
                });
            });

            describe('when checks partially fail', function () {
                beforeEach(function () {
                    // local change in mocked service
                    spyOn(upgradeFactory, 'getPreliminaryChecks').and
                        .returnValue($q.when(partiallyFailingChecksResponse));

                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to true (disruptive only)', function () {
                    assert.isTrue(controller.prechecks.valid);
                });

                it('should update checks values to true or false as per the response', function () {
                    assert.isObject(controller.prechecks.checks);
                    _.forEach(partiallyFailingChecksResponse.data.checks, function(value, key) {
                        expect(controller.prechecks.checks[key].status).toEqual(value.passed);
                    });
                });

                it('should set the mode to disruptive', function () {
                    expect(controller.mode.type).toEqual('disruptive');
                });

                it('should set the mode.valid to false', function () {
                    assert.isFalse(controller.mode.valid);
                });

                it('should set the mode.active to true', function () {
                    assert.isTrue(controller.mode.active);
                });

                describe('when executing continueNormal to continue with the upgrade', function () {
                    beforeEach(function () {
                        controller.continueNormal();
                        $rootScope.$digest();
                    });

                    it('mode should be disruptive', function () {
                        expect(controller.mode.type).toEqual('disruptive');
                    });

                    it('should set the mode.valid to true', function () {
                        assert.isTrue(controller.mode.valid);
                    });
                })
            });

            describe('when service call fails', function () {
                beforeEach(function () {
                    // local change in mocked service
                    spyOn(upgradeFactory, 'getPreliminaryChecks').and.returnValue($q.reject(failingResponse));

                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to false', function () {
                    assert.isFalse(controller.prechecks.valid);
                });

                it('should expose the errors through vm.prechecks.errors object', function () {
                    expect(controller.errors).toEqual(failingResponse.data);
                });
            });
        });

    });
});

// Bardjs' appModule() cannot be used to test States and states transitions
// @see: https://github.com/wardbell/bardjs#dont-use-appmodule-when-testing-routes
describe('Upgrade Landing Controller - States', function () {
    var controller,
        statusResponseData = {
            current_step: 'prechecks',
            substep: null,
            current_node: null,
            steps: {
                prepare: {
                    status: 'pending',
                },
                prechecks: {
                    status: 'pending',
                },
                backup_crowbar: {
                    status: 'pending',
                },
                repocheck_crowbar: {
                    status: 'pending',
                },
                admin: {
                    status: 'pending',
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
        },
        statusResponse = {
            data: statusResponseData,
        },
        entityResponseWithoutAddons = {
            data: {
                addons: []
            }
        },
        successResponse = {},
        errorResponse = { data: {} };

    // inject the services using Angular "underscore wrapping"
    beforeEach(function () {
        module('crowbarApp.upgrade');
        bard.inject('$state', '$httpBackend', '$controller', '$rootScope', '$q', 'upgradeFactory',
                    'upgradeStatusFactory', 'crowbarFactory');

        spyOn($state, 'go');

        bard.mockService(crowbarFactory, {
            getEntity: $q.when(entityResponseWithoutAddons)
        });

        bard.mockService(upgradeFactory, {
            getStatus: $q.when(statusResponse),
            prepareNodes: $q.when(),
        });

        controller = $controller('UpgradeLandingController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should avoid any redirection if prechecks are not successfully validated', function() {
        controller.prechecks.completed = false;
        controller.prechecks.valid = false;

        controller.beginUpgrade();
        expect($state.go).not.toHaveBeenCalled();
    });

    describe('when node prepare starts successfully', function () {
        beforeEach(function () {
            bard.inject('UPGRADE_STEPS', 'PREPARE_TIMEOUT_INTERVAL');

            spyOn(upgradeStatusFactory, 'waitForStepToEnd');

            controller.prechecks.completed = true;
            controller.prechecks.valid = true;

            controller.beginUpgrade();

            $rootScope.$digest();
        });

        it('should start polling for status', function () {
            expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledTimes(1);
            expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledWith(
                UPGRADE_STEPS.prepare,
                PREPARE_TIMEOUT_INTERVAL,
                jasmine.any(Function),
                jasmine.any(Function)
            );
        });
    });

    describe('when node prepare start fails', function () {
        beforeEach(function () {
            bard.inject('UPGRADE_STEPS', 'PREPARE_TIMEOUT_INTERVAL');

            // local change in mocked service
            spyOn(upgradeFactory, 'prepareNodes').and.returnValue($q.reject(errorResponse));

            spyOn(upgradeStatusFactory, 'waitForStepToEnd');

            controller.prechecks.completed = true;
            controller.prechecks.valid = true;

            controller.beginUpgrade();

            $rootScope.$digest();
        });

        it('should not start polling for status', function () {
            expect(upgradeStatusFactory.waitForStepToEnd).not.toHaveBeenCalled();
        });
    });

    describe('when polling is finished successfully', function () {
        beforeEach(function () {
            bard.mockService(upgradeStatusFactory, {
                waitForStepToEnd: function (step, interval, onSuccess/*, onError*/) { onSuccess(successResponse); }
            });

            controller.prechecks.completed = true;
            controller.prechecks.valid = true;

            controller.beginUpgrade();

            $rootScope.$digest();
        });

        it('user should be redirected to backup page', function() {
            expect($state.go).toHaveBeenCalledWith('upgrade.backup');
        });
    });

    describe('when polling is finished with an error', function () {
        beforeEach(function () {
            bard.mockService(upgradeStatusFactory, {
                waitForStepToEnd: function (step, interval, onSuccess, onError) { onError(errorResponse); }
            });

            controller.prechecks.completed = true;
            controller.prechecks.valid = true;

            controller.beginUpgrade();

            $rootScope.$digest();
        });

        it('user should not be redirected to backup page', function() {
            expect($state.go).not.toHaveBeenCalled();
        });
    });
});
