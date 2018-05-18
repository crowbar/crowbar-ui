/*global module bard $controller $httpBackend should assert upgradeFactory $q $rootScope*/
describe('Upgrade Flow - Admin Repositories Checks Controller', function () {
    var controller,
        passingRepoChecks = {
            os: {
                available: true,
                repos: ['SLES12-SP3-Pool', 'SLES12-SP3-Updates'],
            },
            openstack: {
                available: true,
                repos: ['SUSE-OpenStack-Cloud-8-Pool', 'SUSE-OpenStack-Cloud-8-Updates'],
            }
        },
        failingRepoChecks = {
            os: {
                available: false,
                repos: ['SLES12-SP3-Pool', 'SLES12-SP3-Updates'],
            },
            openstack: {
                available: false,
                repos: ['SUSE-OpenStack-Cloud-8-Pool', 'SUSE-OpenStack-Cloud-8-Updates'],
            }
        },
        partiallyFailingRepoChecks = {
            os: {
                available: true,
                repos: ['SLES12-SP3-Pool', 'SLES12-SP3-Updates'],
            },
            openstack: {
                available: false,
                repos: ['SUSE-OpenStack-Cloud-8-Pool', 'SUSE-OpenStack-Cloud-8-Updates'],
            }
        },
        failingErrors = {
            auth_error: {
                data: 'Authentication failure',
                help: 'Please authenticate'
            }
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
        // load ngSanitize to make translations happy
        module('ngSanitize');
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', 'upgradeFactory', '$q', '$httpBackend',
            '$rootScope'
        );

        //Create the controller
        controller = $controller('UpgradeAdministrationRepositoriesCheckController');

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
                bard.mockService(upgradeFactory, {
                    getRepositoriesChecks: $q.when(passingReposChecksResponse)
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

            it('should not create the controller.error', function () {
                should.not.exist(controller.error);
            });
        });

        describe('when checks fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeFactory, {
                    getRepositoriesChecks: $q.when(failingReposChecksResponse)
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
                bard.mockService(upgradeFactory, {
                    getRepositoriesChecks: $q.when(partiallyFailingChecksResponse)
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
                _.forEach(partiallyFailingChecksResponse.data, function(productData, product) {
                    _.forEach(productData.repos, function (repo) {
                        if (controller.repoChecks.checks.hasOwnProperty(repo)) {
                            expect(controller.repoChecks.checks[repo].status)
                                .toEqual(partiallyFailingChecksResponse.data[product].available)
                        }
                    });
                });
            });
        });

        describe('when service call fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeFactory, {
                    getRepositoriesChecks: $q.reject(failingReposResponse)
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

            it('should expose the errors through vm.error object', function () {
                expect(controller.errors).toEqual(failingReposResponse.data);
            });
        });
    });
});
