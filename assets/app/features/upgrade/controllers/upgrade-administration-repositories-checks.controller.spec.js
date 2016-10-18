/*global bard $controller $httpBackend should assert crowbarFactory $q $rootScope PRODUCTS_REPO_CHECKS_MAP*/
describe('Upgrade Flow - Admin Repositories Checks Controller', function () {
    var controller,
        scope,
        passingRepoChecks = {
            os: {
                available: true
            },
            openstack: {
                available: true
            }
        },
        failingRepoChecks = {
            os: {
                available: false
            },
            openstack: {
                available: false
            }
        },
        partiallyFailingRepoChecks = {
            os: {
                available: true
            },
            openstack: {
                available: false
            }
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
        },
        upgradeVm = {
            steps: {
                activeStep: {
                    finished: false
                }
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject(
            '$controller', 'crowbarFactory', '$q', '$httpBackend',
            '$rootScope', 'PRODUCTS_REPO_CHECKS_MAP'
        );
        scope = $rootScope.$new();
        scope.upgradeVm = upgradeVm;
        //Create the controller
        controller = $controller('UpgradeAdministrationRepositoriesCheckController', {$scope: scope});

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
                bard.mockService(crowbarFactory, {
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
        });

        describe('when checks fails', function () {
            beforeEach(function () {
                bard.mockService(crowbarFactory, {
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
                bard.mockService(crowbarFactory, {
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
                _.forEach(PRODUCTS_REPO_CHECKS_MAP, function(repos, type) {
                    // Admin repochecks only checks for os or openstack repos
                    if (type == 'os' || type == 'openstack') {
                        _.forEach(repos, function (repo) {
                            expect(controller.repoChecks.checks[repo].status)
                                .toEqual(partiallyFailingChecksResponse.data[type].available)
                        });
                    }
                });
            });
        });

        describe('when service call fails', function () {
            beforeEach(function () {
                bard.mockService(crowbarFactory, {
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

            it('should expose the errors through vm.repoChecks.errors object', function () {
                expect(controller.repoChecks.errors).toEqual(failingReposResponse.data.errors);
            });
        });
    });
});
