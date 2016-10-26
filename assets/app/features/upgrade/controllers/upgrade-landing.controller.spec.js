/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert upgradeFactory crowbarFactory $q $rootScope module $state */
describe('Upgrade Landing Controller', function() {
    var controller,
        passingChecks = {
            maintenance_updates_installed: { required: true, passed: true },
            network_checks: { required: true, passed: true },
            clusters_healthy: { required: true, passed: true },
            ceph_healthy: { required: true, passed: true },
            compute_resources_available: { required: false, passed: true }
        },
        failingChecks = {
            maintenance_updates_installed: { required: true, passed: false },
            network_checks: { required: true, passed: false },
            clusters_healthy: { required: true, passed: false },
            ceph_healthy: { required: true, passed: false },
            compute_resources_available: { required: false, passed: false }
        },
        partiallyFailingChecks = {
            maintenance_updates_installed: { required: true, passed: true },
            network_checks: { required: true, passed: true },
            clusters_healthy: { required: true, passed: false },
            ceph_healthy: { required: true, passed: true },
            compute_resources_available: { required: false, passed: false }
        },
        failingErrors = {
            error_message: 'Authentication failure'
        },
        passingChecksResponse = {
            data: passingChecks
        },
        failingChecksResponse = {
            data: failingChecks
        },
        partiallyFailingChecksResponse = {
            data: partiallyFailingChecks
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
        },
        activeEntityResponse;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject('$controller', '$rootScope', 'upgradeFactory', 'crowbarFactory', '$q', '$httpBackend');

        // mock crowbarEntity with different response using an additional variable
        activeEntityResponse = entityResponseWithAddons;
        bard.mockService(crowbarFactory, {
            getEntity: $q.when(activeEntityResponse)
        });

        //Create the controller
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

    describe('Begin Upgrade', function() {
        it('should have a beginUpgrade function defined', function() {
            should.exist(controller.beginUpgrade);
        });
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
                activeEntityResponse = entityResponseWithoutAddons;
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
                    bard.mockService(upgradeFactory, {
                        getPreliminaryChecks: $q.when(passingChecksResponse)
                    });
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
            });

            describe('when checks fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        getPreliminaryChecks: $q.when(failingChecksResponse)
                    });
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
                        assert.isFalse(value.status && value.required);
                    });
                });
            });

            describe('when checks partially fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        getPreliminaryChecks: $q.when(partiallyFailingChecksResponse)
                    });
                    controller.prechecks.runPrechecks();
                    $rootScope.$digest();
                });

                it('should set prechecks.completed status to true', function () {
                    assert.isTrue(controller.prechecks.completed);
                });

                it('should update valid attribute of checks model to false', function () {
                    assert.isFalse(controller.prechecks.valid);
                });

                it('should update checks values to true or false as per the response', function () {
                    assert.isObject(controller.prechecks.checks);
                    _.forEach(partiallyFailingChecksResponse.data, function(value, key) {
                        expect(controller.prechecks.checks[key].status).toEqual(value.passed || !value.required);
                    });
                });
            });

            describe('when service call fails', function () {
                beforeEach(function () {
                    bard.mockService(upgradeFactory, {
                        getPreliminaryChecks: $q.reject(failingResponse)
                    });
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
                    expect(controller.prechecks.errors).toEqual(failingResponse.data.errors);
                });
            });
        });

    });
});

// Bardjs' appModule() cannot be used to test States and states transitions
// @see: https://github.com/wardbell/bardjs#dont-use-appmodule-when-testing-routes
describe('Upgrade Landing Controller - States', function () {
    var controller,
        entityResponseWithoutAddons = {
            data: {
                addons: []
            }
        };

    // inject the services using Angular "underscore wrapping"
    beforeEach(function () {
        module('crowbarApp.upgrade');
        bard.inject('$state', '$httpBackend', '$controller', '$rootScope', '$q', 'upgradeFactory', 'crowbarFactory');

        spyOn($state, 'go');

        bard.mockService(upgradeFactory, {
            prepareNodes: $q.when()
        });

        bard.mockService(crowbarFactory, {
            getEntity: $q.when(entityResponseWithoutAddons)
        });

        controller = $controller('UpgradeLandingController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('Begin Upgrade button should redirect the user to /backup when clicked', function() {
        controller.prechecks.completed = true;
        controller.prechecks.valid = true;

        controller.beginUpgrade();

        $rootScope.$digest();

        expect($state.go).toHaveBeenCalledWith('upgrade.backup');
    });

    it('should avoid any redirection if prechecks are not successfully validated', function() {
        controller.prechecks.completed = false;
        controller.prechecks.valid = false;

        controller.beginUpgrade();

        expect($state.go).not.toHaveBeenCalled();
    });
});
