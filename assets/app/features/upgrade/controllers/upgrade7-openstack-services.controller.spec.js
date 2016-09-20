/*global bard $controller $httpBackend should assert openStackFactory $q $rootScope */
fdescribe('openStack Services Controller', function() {
    var controller,
        passingOpenStackChecks = {
            'services': true,
            'backup': true
        },
        failingOpenStackChecks = {
            'services': false,
            'backup': false
        },
        partiallyfailOpenStackChecks= {
            'services': true,
            'backup': false
        },
        failingErrors = {
            error_message: 'Authentication failure'
        },
        passingOpenStackChecksResponse = {
            data: passingOpenStackChecks
        },
        failingOpenStackChecksResponse = {
            data: failingOpenStackChecks
        },
        partiallyFailOpenStackChecksResponse = {
            data: partiallyfailOpenStackChecks
        },
        failingResponse = {
            data: {
                errors: failingErrors
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$rootScope', 'openStackFactory', '$q', '$httpBackend');

        //Create the controller
        controller = $controller('Upgrade7OpenStackServicesController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

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

        it('is not valid by default', function() {
            assert.isFalse(controller.openStackServices.valid);
        });

        describe('contains a collection of checks that', function () {

            it('should be defined', function () {
                should.exist(controller.openStackServices.checks);
            });

            it('should all be set to false', function () {
                assert.isObject(controller.openStackServices.checks);
                _.forEach(controller.openStackServices.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });
        });
    });

    describe('runOpenStackServices function', function () {
        it('should be defined', function () {
            should.exist(controller.openStackServices.runOpenStackServices);
        });

        describe('when checks pass successfull', function () {
            beforeEach(function () {
                bard.mockService(openStackFactory, {
                    getOpenStackServices: $q.when(passingOpenStackChecksResponse)
                });
                controller.openStackServices.runOpenStackServices();
                $rootScope.$digest();
            });

            it('should set openStackServices.completed status to true', function () {
                assert.isTrue(controller.openStackServices.completed);
            });

            it('should update valid attribute of checks model to true', function () {
                assert.isTrue(controller.openStackServices.valid);
            });

            it('should update openStackServices checks values to true', function () {
                assert.isObject(controller.openStackServices.checks);
                _.forEach(controller.openStackServices.checks, function(value) {
                    assert.isTrue(value.status);
                });
            });
        });

        describe('when checks fails', function () {
            beforeEach(function () {
                bard.mockService(openStackFactory, {
                    getOpenStackServices: $q.when(failingOpenStackChecksResponse)
                });
                controller.openStackServices.runOpenStackServices();
                $rootScope.$digest();
            });

            it('should set openStackServices.completed status to true', function () {
                assert.isTrue(controller.openStackServices.completed);
            });

            it('should update valid attribute of checks model to false', function () {
                assert.isFalse(controller.openStackServices.valid);
            });

            it('should update checks values to false', function () {
                assert.isObject(controller.openStackServices.checks);
                _.forEach(controller.openStackServices.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });
        });

        describe('when checks partially fails', function () {
            beforeEach(function () {
                bard.mockService(openStackFactory, {
                    getOpenStackServices: $q.when(partiallyFailOpenStackChecksResponse)
                });
                controller.openStackServices.runOpenStackServices();
                $rootScope.$digest();
            });

            it('should set openStackServices.completed status to true', function () {
                assert.isTrue(controller.openStackServices.completed);
            });

            it('should update valid attribute of checks model to false', function () {
                assert.isFalse(controller.openStackServices.valid);
            });

            it('should update checks values to true or false as per the response', function () {
                assert.isObject(controller.openStackServices.checks);
                _.forEach(partiallyFailOpenStackChecksResponse.data, function(value, key) {
                    expect(controller.openStackServices.checks[key].status).toEqual(value);
                });
            });
        });

        describe('when service call fails', function () {
            beforeEach(function () {
                bard.mockService(openStackFactory, {
                    getOpenStackServices: $q.reject(failingResponse)
                });
                controller.openStackServices.runOpenStackServices();
                $rootScope.$digest();
            });

            it('should set openStackServices.completed status to true', function () {
                assert.isTrue(controller.openStackServices.completed);
            });

            it('should update valid attribute of checks model to false', function () {
                assert.isFalse(controller.openStackServices.valid);
            });

            it('should expose the errors through vm.openStackServices.errors object', function () {
                expect(controller.openStackServices.errors).toEqual(failingResponse.data.errors);
            });
        });
    });
});
