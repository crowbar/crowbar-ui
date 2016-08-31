/*global bard $httpBackend should expect upgradeRepoChecksFactory */
describe('Upgrade Repo Checks Factory', function () {

    var mockedAdminRepoChecksData = {
            'SLES_12_SP2': false,
            'SLES_12_SP2_Updates': false,
            'SLES_OpenStack_Cloud_7': false,
            'SLES_OpenStack_Cloud_7_Updates': false
        },
        adminRepoChecksPromise,
        mockedNodesRepoChecksData = {
            'SLES_12_SP2': false,
            'SLES_12_SP2_Updates': false,
            'SLES_OpenStack_Cloud_7': false,
            'SLES_OpenStack_Cloud_7_Updates': false,
            'SLE_HA_12_SP2': false,
            'SLE_HA_12_SP2_Updates': false,
            'SUSE_Enterprise_Storage_4': false,
            'SUSE_Enterprise_Storage_4_Updates': false  
        },
        nodesRepoChecksPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarData.upgrade');
        bard.inject('upgradeRepoChecksFactory', '$q', '$httpBackend');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(upgradeRepoChecksFactory);
        });

        it('returns an object with getAdminRepoChecks function is defined', function () {
            expect(upgradeRepoChecksFactory.getAdminRepoChecks).toEqual(jasmine.any(Function));
        });

        it('returns an object with getNodesRepoChecks function is defined', function () {
            expect(upgradeRepoChecksFactory.getNodesRepoChecks).toEqual(jasmine.any(Function));
        });

        describe('when getAdminRepoChecks method is executed', function () {

            beforeEach(function () {

                $httpBackend.expect('GET', '/api/upgrade7/admin-repo-checks')
                    .respond(200, mockedAdminRepoChecksData);
                adminRepoChecksPromise = upgradeRepoChecksFactory.getAdminRepoChecks();
            });

            it('returns a promise', function () {
                expect(adminRepoChecksPromise).toEqual(jasmine.any(Object));
                expect(adminRepoChecksPromise['then']).toEqual(jasmine.any(Function));
                expect(adminRepoChecksPromise['catch']).toEqual(jasmine.any(Function));
                expect(adminRepoChecksPromise['finally']).toEqual(jasmine.any(Function));
                expect(adminRepoChecksPromise['error']).toEqual(jasmine.any(Function));
                expect(adminRepoChecksPromise['success']).toEqual(jasmine.any(Function));
            });

            // repoChecks success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the repoChecks response', function () {
                adminRepoChecksPromise.then(function (repoChecksResponse) {
                    expect(repoChecksResponse.status).toEqual(200);
                    expect(repoChecksResponse.data).toEqual(mockedAdminRepoChecksData);
                });
                $httpBackend.flush();
            });

        });

        describe('when getNodesRepoChecks method is executed', function () {

            beforeEach(function () {

                $httpBackend.expect('GET', '/api/upgrade7/nodes-repo-checks')
                    .respond(200, mockedNodesRepoChecksData);
                nodesRepoChecksPromise = upgradeRepoChecksFactory.getNodesRepoChecks();
            });

            it('returns a promise', function () {
                expect(nodesRepoChecksPromise).toEqual(jasmine.any(Object));
                expect(nodesRepoChecksPromise['then']).toEqual(jasmine.any(Function));
                expect(nodesRepoChecksPromise['catch']).toEqual(jasmine.any(Function));
                expect(nodesRepoChecksPromise['finally']).toEqual(jasmine.any(Function));
                expect(nodesRepoChecksPromise['error']).toEqual(jasmine.any(Function));
                expect(nodesRepoChecksPromise['success']).toEqual(jasmine.any(Function));
            });

            // repoChecks success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the repoChecks response', function () {
                nodesRepoChecksPromise.then(function (repoChecksResponse) {
                    expect(repoChecksResponse.status).toEqual(200);
                    expect(repoChecksResponse.data).toEqual(mockedNodesRepoChecksData);
                });
                $httpBackend.flush();
            });

        });
        
    });

});
