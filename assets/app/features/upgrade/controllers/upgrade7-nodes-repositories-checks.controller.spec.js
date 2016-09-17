/*global bard $controller $httpBackend should assert upgradeRepositoriesChecksFactory $q $rootScope */
describe('Upgrade Flow - Nodes Repositories Checks Controller', function () {
    var controller,
        failingRepoChecks = {
            'SLES_12_SP2': false,
            'SLES_12_SP2_Updates': false,
            'SLES_OpenStack_Cloud_7': false,
            'SLES_OpenStack_Cloud_7_Updates': false,
            'SLE_HA_12_SP2': false,
            'SLE_HA_12_SP2_Updates': false,
            'SUSE_Enterprise_Storage_4': false,
            'SUSE_Enterprise_Storage_4_Updates': false
        },
        passingRepoChecks = {
            'SLES_12_SP2': true,
            'SLES_12_SP2_Updates': true,
            'SLES_OpenStack_Cloud_7': true,
            'SLES_OpenStack_Cloud_7_Updates': true,
            'SLE_HA_12_SP2': true,
            'SLE_HA_12_SP2_Updates': true,
            'SUSE_Enterprise_Storage_4': true,
            'SUSE_Enterprise_Storage_4_Updates': true
        },
        partiallyFailingRepoChecks = {
            'SLES_12_SP2': true,
            'SLES_12_SP2_Updates': false,
            'SLES_OpenStack_Cloud_7': false,
            'SLES_OpenStack_Cloud_7_Updates': true,
            'SLE_HA_12_SP2': true,
            'SLE_HA_12_SP2_Updates': true,
            'SUSE_Enterprise_Storage_4': true,
            'SUSE_Enterprise_Storage_4_Updates': true
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
        partiallyFailingReposChecksResponse = {
            data: partiallyFailingRepoChecks
        },
        failingResponse = {
            data: {
                errors: failingErrors
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', 'upgradeRepositoriesChecksFactory', '$q', '$httpBackend', '$rootScope');

        //Create the controller
        controller = $controller('Upgrade7NodesRepositoriesCheckController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function () {
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

        describe('when checks pass successfull', function () {
            beforeEach(function () {
                bard.mockService(upgradeRepositoriesChecksFactory, {
                    getNodesRepoChecks: $q.when(passingReposChecksResponse)
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
                bard.mockService(upgradeRepositoriesChecksFactory, {
                    getNodesRepoChecks: $q.when(failingReposChecksResponse)
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

            it('should update checks values to false', function () {
                assert.isObject(controller.repoChecks.checks);
                _.forEach(controller.repoChecks.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });
        });

        describe('when checks partially fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeRepositoriesChecksFactory, {
                    getNodesRepoChecks: $q.when(partiallyFailingReposChecksResponse)
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

            it('should update checks values to true or false as per the response', function () {
                assert.isObject(controller.repoChecks.checks);
                _.forEach(partiallyFailingReposChecksResponse.data, function(value, key) {
                    expect(controller.repoChecks.checks[key].status).toEqual(value);
                });
            });
        });

        describe('when service call fails', function () {
            beforeEach(function () {
                bard.mockService(upgradeRepositoriesChecksFactory, {
                    getNodesRepoChecks: $q.reject(failingResponse)
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

            it('should expose the errors through vm.repoChecks.errors object', function () {
                expect(controller.repoChecks.errors).toEqual(failingResponse.data.errors);
            }); 
        });

        it('should leave checks values untouched', function () {
            assert.isObject(controller.repoChecks.checks);
            _.forEach(controller.repoChecks.checks, function(value) {
                assert.isFalse(value.status);
            });
        });
    });
});
