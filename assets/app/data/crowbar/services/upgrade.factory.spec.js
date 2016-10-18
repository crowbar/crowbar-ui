/*global bard $httpBackend should expect upgradeFactory COMMON_API_V2_HEADERS */
describe('Upgrade Factory', function () {

    var mockedPreliminaryChecksData = '--mockedNodesRepoChecksData--',
        mockedPrepareNodesData = '--mockedNodesRepoChecksData--',
        mockedNodesRepoChecksData = '--mockedNodesRepoChecksData--',
        preliminaryChecksPromise,
        prepareNodesPromise,
        nodesRepoChecksPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('suseData.crowbar');
        bard.inject('upgradeFactory', '$q', '$httpBackend', 'COMMON_API_V2_HEADERS');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(upgradeFactory);
        });

        it('returns an object with getPreliminaryChecks function defined', function () {
            expect(upgradeFactory.getPreliminaryChecks).toEqual(jasmine.any(Function));
        });

        it('returns an object with prepareNodes function defined', function () {
            expect(upgradeFactory.prepareNodes).toEqual(jasmine.any(Function));
        });

        it('returns an object with getNodesRepoChecks function defined', function () {
            expect(upgradeFactory.getNodesRepoChecks).toEqual(jasmine.any(Function));
        });

        describe('when getPreliminaryChecks method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectGET('/api/upgrade/prechecks', COMMON_API_V2_HEADERS)
                    .respond(200, mockedPreliminaryChecksData);
                preliminaryChecksPromise = upgradeFactory.getPreliminaryChecks();
            });

            it('returns a promise', function () {
                expect(preliminaryChecksPromise).toEqual(jasmine.any(Object));
                expect(preliminaryChecksPromise['then']).toEqual(jasmine.any(Function));
                expect(preliminaryChecksPromise['catch']).toEqual(jasmine.any(Function));
                expect(preliminaryChecksPromise['finally']).toEqual(jasmine.any(Function));
                expect(preliminaryChecksPromise['error']).toEqual(jasmine.any(Function));
                expect(preliminaryChecksPromise['success']).toEqual(jasmine.any(Function));
            });

            // repoChecks success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the repoChecks response', function () {
                preliminaryChecksPromise.then(function (preChecksResponse) {
                    expect(preChecksResponse.status).toEqual(200);
                    expect(preChecksResponse.data).toEqual(mockedPreliminaryChecksData);
                });
                $httpBackend.flush();
            });

        });

        describe('when prepareNodes method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectPOST('/api/upgrade/prepare', null, COMMON_API_V2_HEADERS)
                    .respond(200, mockedPrepareNodesData);
                prepareNodesPromise = upgradeFactory.prepareNodes();
            });

            it('returns a promise', function () {
                expect(prepareNodesPromise).toEqual(jasmine.any(Object));
                expect(prepareNodesPromise['then']).toEqual(jasmine.any(Function));
                expect(prepareNodesPromise['catch']).toEqual(jasmine.any(Function));
                expect(prepareNodesPromise['finally']).toEqual(jasmine.any(Function));
                expect(prepareNodesPromise['error']).toEqual(jasmine.any(Function));
                expect(prepareNodesPromise['success']).toEqual(jasmine.any(Function));
            });

            // prepareNodes success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the prepareNodes response', function () {
                prepareNodesPromise.then(function (prepareNodesResponse) {
                    expect(prepareNodesResponse.status).toEqual(200);
                    expect(prepareNodesResponse.data).toEqual(mockedPrepareNodesData);
                });
                $httpBackend.flush();
            });

        });

        describe('when getNodesRepoChecks method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectGET('/api/upgrade/repocheck', COMMON_API_V2_HEADERS)
                    .respond(200, mockedNodesRepoChecksData);
                nodesRepoChecksPromise = upgradeFactory.getNodesRepoChecks();
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
