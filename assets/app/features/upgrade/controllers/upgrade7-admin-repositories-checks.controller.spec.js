/*global bard $controller $httpBackend should assert upgradeRepoChecksFactory $q $rootScope */
describe('Upgrade Flow - Admin Repositories Checks Controller', function () {
    var controller,
        passingRepoChecks = {
            SLES_12_SP2: true,
            SLES_12_SP2_Updates: true,
            SLES_OpenStack_Cloud_7: true,
            SLES_OpenStack_Cloud_7_Updates: true
        },
        failingRepoChecks = {
            SLES_12_SP2: false,
            SLES_12_SP2_Updates: false,
            SLES_OpenStack_Cloud_7: false,
            SLES_OpenStack_Cloud_7_Updates: false
        },
        partiallyFailingRepoChecks = {
            SLES_12_SP2: true,
            SLES_12_SP2_Updates: true,
            SLES_OpenStack_Cloud_7: false,
            SLES_OpenStack_Cloud_7_Updates: false
        },
        failingErrors = {
            error_message: 'Authentication failure'
        },
        passingReposChecksResponse = {
            data: passingRepoChecks
        },
        failingReposChecksResponse = {
            data: failingRepoChecks
        },
        partiallyFailingChecksResponse = {
            data: partiallyFailingRepoChecks
        },
        failingReposResponse = {
            data: {
                errors: failingErrors
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', 'upgradeRepoChecksFactory', '$q', '$httpBackend', '$rootScope');

        //Create the controller
        controller = $controller('Upgrade7AdminRepositoriesCheckController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function() {
        should.exist(controller);
    });

    describe('Repo Checks Model', function () {
        it('should be defined', function () {
            should.exist(controller.repoChecks);
        });

        it('is not completed by default', function() {
            assert.isFalse(controller.repoChecks.completed);
        });

        it('is not valid by default', function() {
            assert.isFalse(controller.repoChecks.valid);
        });

        describe('contains a collection of checks that', function () {

            it('should be defined', function () {
                should.exist(controller.repoChecks.checks);
            });

            it('should all be set to false', function () {
                assert.isObject(controller.repoChecks.checks);
                _.forEach(controller.repoChecks.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });
        });
    });

    describe('runRepoChecks function', function () {
        it('should be defined', function () {
            should.exist(controller.repoChecks.runRepoChecks);
        });

        describe('when successfull', function () {
            beforeEach(function () {
                bard.mockService(upgradeRepoChecksFactory, {
                    getAdminRepoChecks: $q.when(passingReposChecksResponse)
                });
                controller.repoChecks.runRepoChecks();
                $rootScope.$digest();
            });

            it('should set repoChecks.completed status to true', function () {
                assert.isTrue(controller.repoChecks.completed);
            });

            it('should update valid attribute of checks model to true', function () {
                assert.isTrue(controller.repoChecks.valid);
            });

            it('should update checks values to true', function () {
                assert.isObject(controller.repoChecks.checks);
                _.forEach(controller.repoChecks.checks, function(value) {
                    assert.isTrue(value.status);
                });
            });
        });

        describe('when checks fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeRepoChecksFactory, {
                    getAdminRepoChecks: $q.when(failingReposChecksResponse)
                });
                controller.repoChecks.runRepoChecks();
                $rootScope.$digest();
            });

            it('should maintain valid attribute of checks model to false', function () {
                assert.isFalse(controller.repoChecks.valid);
            });

            it('should set repoChecks.completed status to true', function () {
                assert.isTrue(controller.repoChecks.completed);
            });

            it('should update checks values to false', function () {
                _.forEach(controller.repoChecks.checks, function(value) {
                    assert.isFalse(value.status);
                });
            }); 
        });

        describe('when checks partially fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeRepoChecksFactory, {
                    getAdminRepoChecks: $q.when(partiallyFailingChecksResponse)
                });
                controller.repoChecks.runRepoChecks();
                $rootScope.$digest();
            });

            it('should maintain valid attribute of checks model to false', function () {
                assert.isFalse(controller.repoChecks.valid);
            });

            it('should set repoChecks.completed status to true', function () {
                assert.isTrue(controller.repoChecks.completed);
            });

            it('should update checks values to true or false as per the response', function () {
                assert.isObject(controller.repoChecks.checks);   
                _.forEach(partiallyFailingChecksResponse.data, function(value, key) {
                    expect(controller.repoChecks.checks[key].status).toEqual(value);
                });
            }); 
        });

        describe('when service call fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeRepoChecksFactory, {
                    getAdminRepoChecks: $q.reject(failingReposResponse)
                });
                controller.repoChecks.runRepoChecks();
                $rootScope.$digest();
            });

            it('should set repoChecks.completed status to true', function () {
                assert.isTrue(controller.repoChecks.completed);
            });

            it('should update valid attribute of checks model to false', function () {
                assert.isFalse(controller.repoChecks.valid);
            });

            it('should leave checks values untouched', function () {
                assert.isObject(controller.repoChecks.checks);
                _.forEach(controller.repoChecks.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });

            it('should expose the errors through vm.repoChecks.errors object', function () {
                expect(controller.repoChecks.errors).toEqual(failingReposResponse.data.errors);
            });
        });
    });
});
