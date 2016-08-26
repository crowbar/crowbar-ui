/*global bard $httpBackend should expect upgradeRepoChecks */
describe('Upgrade Repo Checks Factory', function () {

    var mockedRepoChecksData = {
            'SLES_12_SP2': false,
            'SLES_12_SP2_Updates': false,
            'SLES_OpenStack_Cloud_7': false,
            'SLES_OpenStack_Cloud_7_Updates': false
        },
        repoChecksPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarData.upgrade');
        bard.inject('upgradeRepoChecks', '$q', '$httpBackend');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(upgradeRepoChecks);
        });

        it('returns an object with getAdminRepoChecks function is defined', function () {
            expect(upgradeRepoChecks.getAdminRepoChecks).toEqual(jasmine.any(Function));
        });

        describe('when getAdminRepoChecks method is executed', function () {

            beforeEach(function () {

                $httpBackend.expect('GET', '/api/upgrade7/admin-repo-checks')
                    .respond(200, mockedRepoChecksData);
                repoChecksPromise = upgradeRepoChecks.getAdminRepoChecks();
            });

            it('returns a promise', function () {
                expect(repoChecksPromise).toEqual(jasmine.any(Object));
                expect(repoChecksPromise['then']).toEqual(jasmine.any(Function));
                expect(repoChecksPromise['catch']).toEqual(jasmine.any(Function));
                expect(repoChecksPromise['finally']).toEqual(jasmine.any(Function));
                expect(repoChecksPromise['error']).toEqual(jasmine.any(Function));
                expect(repoChecksPromise['success']).toEqual(jasmine.any(Function));
            });

            // repoChecks success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the repoChecks response', function () {
                repoChecksPromise.then(function (repoChecksResponse) {
                    expect(repoChecksResponse.status).toEqual(200);
                    expect(repoChecksResponse.data).toEqual(mockedRepoChecksData);
                });
                $httpBackend.flush();
            });

        });
        
    });

});
