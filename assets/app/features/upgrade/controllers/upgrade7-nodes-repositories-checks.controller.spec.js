/*global bard $controller $httpBackend should assert upgradeRepoChecksFactory $q $rootScope */
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
        passingReposResponse = {
            data: passingRepoChecks
        },
        failingReposResponse = {
            data: {
                errors: failingRepoChecks
            }
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', 'upgradeRepoChecksFactory', '$q', '$httpBackend', '$rootScope');

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
                expect(controller.repoChecks.checks).toEqual(failingRepoChecks);
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
                    getNodesRepoChecks: $q.when(passingReposResponse)
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
                expect(controller.repoChecks.checks).toEqual(passingRepoChecks);
            });

        });

        describe('on failure', function () {
            beforeEach(function () {
                bard.mockService(upgradeRepoChecksFactory, {
                    getNodesRepoChecks: $q.reject(failingReposResponse)
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
                expect(controller.repoChecks.errors).toEqual(failingRepoChecks);
            }); 
        });

    });
});
