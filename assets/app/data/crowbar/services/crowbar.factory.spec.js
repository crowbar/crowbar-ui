/*global bard $httpBackend should expect crowbarFactory COMMON_API_V2_HEADERS */
describe('Crowbar Factory', function () {

    var mockedCrowbarEntityData = '--mockedCrowbarEntityData--',
        mockedRepositoriesChecksData = '--mockedRepositoriesChecksData--',
        mockedUpgradeData = '--mockedUpgradeData--',
        mockedUpgradeStatusData = '--mockedUpgradeStatusData--',
        crowbarEntityPromise,
        repositoriesChecksPromise,
        upgradePromise,
        upgradeStatusPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('suseData.crowbar');
        bard.inject('crowbarFactory', '$q', '$httpBackend', 'COMMON_API_V2_HEADERS');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(crowbarFactory);
        });

        it('returns an object with getEntity function is defined', function () {
            expect(crowbarFactory.getEntity).toEqual(jasmine.any(Function));
        });

        it('returns an object with getRepositoriesChecks function is defined', function () {
            expect(crowbarFactory.getRepositoriesChecks).toEqual(jasmine.any(Function));
        });

        it('returns an object with upgrade function is defined', function () {
            expect(crowbarFactory.upgrade).toEqual(jasmine.any(Function));
        });

        it('returns an object with getUpgradeStatus function is defined', function () {
            expect(crowbarFactory.getUpgradeStatus).toEqual(jasmine.any(Function));
        });

        describe('when getEntity method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectGET('/api/crowbar', COMMON_API_V2_HEADERS)
                    .respond(200, mockedCrowbarEntityData);
                crowbarEntityPromise = crowbarFactory.getEntity();
            });

            it('returns a promise', function () {
                expect(crowbarEntityPromise).toEqual(jasmine.any(Object));
                expect(crowbarEntityPromise['then']).toEqual(jasmine.any(Function));
                expect(crowbarEntityPromise['catch']).toEqual(jasmine.any(Function));
                expect(crowbarEntityPromise['finally']).toEqual(jasmine.any(Function));
                expect(crowbarEntityPromise['error']).toEqual(jasmine.any(Function));
                expect(crowbarEntityPromise['success']).toEqual(jasmine.any(Function));
            });

            // getEntity success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the crowbar entity response', function () {
                crowbarEntityPromise.then(function (getEntityResponse) {
                    expect(getEntityResponse.status).toEqual(200);
                    expect(getEntityResponse.data).toEqual(mockedCrowbarEntityData);
                });
                $httpBackend.flush();
            });

        });

        describe('when getRepositoriesChecks method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectGET('/api/crowbar/repocheck', COMMON_API_V2_HEADERS)
                    .respond(200, mockedRepositoriesChecksData);
                repositoriesChecksPromise = crowbarFactory.getRepositoriesChecks();
            });

            it('returns a promise', function () {
                expect(repositoriesChecksPromise).toEqual(jasmine.any(Object));
                expect(repositoriesChecksPromise['then']).toEqual(jasmine.any(Function));
                expect(repositoriesChecksPromise['catch']).toEqual(jasmine.any(Function));
                expect(repositoriesChecksPromise['finally']).toEqual(jasmine.any(Function));
                expect(repositoriesChecksPromise['error']).toEqual(jasmine.any(Function));
                expect(repositoriesChecksPromise['success']).toEqual(jasmine.any(Function));
            });

            // getRepositoriesChecks success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the Repositories Checks response', function () {
                repositoriesChecksPromise.then(function (repositoriesChecksResponse) {
                    expect(repositoriesChecksResponse.status).toEqual(200);
                    expect(repositoriesChecksResponse.data).toEqual(mockedRepositoriesChecksData);
                });
                $httpBackend.flush();
            });

        });

        describe('when upgrade method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectPOST('/api/crowbar/upgrade', null, COMMON_API_V2_HEADERS)
                    .respond(200, mockedUpgradeData);
                upgradePromise = crowbarFactory.upgrade();
            });

            it('returns a promise', function () {
                expect(upgradePromise).toEqual(jasmine.any(Object));
                expect(upgradePromise['then']).toEqual(jasmine.any(Function));
                expect(upgradePromise['catch']).toEqual(jasmine.any(Function));
                expect(upgradePromise['finally']).toEqual(jasmine.any(Function));
                expect(upgradePromise['error']).toEqual(jasmine.any(Function));
                expect(upgradePromise['success']).toEqual(jasmine.any(Function));
            });

            // upgrade success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the crowbar upgrade response', function () {
                upgradePromise.then(function (upgradeResponse) {
                    expect(upgradeResponse.status).toEqual(200);
                    expect(upgradeResponse.data).toEqual(mockedUpgradeData);
                });
                $httpBackend.flush();
            });

        });

        describe('when getUpgradeStatus method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectGET('/api/crowbar/upgrade', COMMON_API_V2_HEADERS)
                    .respond(200, mockedUpgradeStatusData);
                upgradeStatusPromise = crowbarFactory.getUpgradeStatus();
            });

            it('returns a promise', function () {
                expect(upgradeStatusPromise).toEqual(jasmine.any(Object));
                expect(upgradeStatusPromise['then']).toEqual(jasmine.any(Function));
                expect(upgradeStatusPromise['catch']).toEqual(jasmine.any(Function));
                expect(upgradeStatusPromise['finally']).toEqual(jasmine.any(Function));
                expect(upgradeStatusPromise['error']).toEqual(jasmine.any(Function));
                expect(upgradeStatusPromise['success']).toEqual(jasmine.any(Function));
            });

            // getUpgradeStatus success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the upgrade crowbar status response', function () {
                upgradeStatusPromise.then(function (getUpgradeStatusResponse) {
                    expect(getUpgradeStatusResponse.status).toEqual(200);
                    expect(getUpgradeStatusResponse.data).toEqual(mockedUpgradeStatusData);
                });
                $httpBackend.flush();
            });

        });
        
    });

});
