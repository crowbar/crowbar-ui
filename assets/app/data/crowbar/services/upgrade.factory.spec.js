/*global bard $httpBackend should expect upgradeFactory COMMON_API_V2_HEADERS */
describe('Upgrade Factory', function () {

    var mockedPreliminaryChecksData = '--mockedNodesRepoChecksData--',
        mockedPrepareNodesData = '--mockedNodesRepoChecksData--',
        mockedNodesRepoChecksData = '--mockedNodesRepoChecksData--',
        mockedRepositoriesChecksData = '--mockedRepositoriesChecksData--',
        mockedStatusData = '--mockedStatusData--',
        mockedCreateAdminBackupResponse = {
            id: 42
        },
        mockedNewDatabaseServerResponse = {
            'database_setup': {
                'success': true
            },
            'database_migration': {
                'success': true
            },
            'schema_migration': {
                'success': true
            },
            'crowbar_init': {
                'success': true
            }
        },
        mockedConnectDatabaseServerResponse = mockedNewDatabaseServerResponse,
        preliminaryChecksPromise,
        repositoriesChecksPromise,
        prepareNodesPromise,
        nodesRepoChecksPromise,
        statusPromise,
        cancelUpgradePromise,
        backupPromise,
        createNewDatabaseServerPromise,
        connectDatabaseServerPromise,
        mockedStopServicesPromise = {
            'services': true
        },
        stopServicesPromise;

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

        it('returns an object with getRepositoriesChecks function is defined', function () {
            expect(upgradeFactory.getRepositoriesChecks).toEqual(jasmine.any(Function));
        });

        it('returns an object with getStatus function is defined', function () {
            expect(upgradeFactory.getStatus).toEqual(jasmine.any(Function));
        });

        it('returns an object with createAdminBackup function is defined', function () {
            expect(upgradeFactory.createAdminBackup).toEqual(jasmine.any(Function));
        });

        it('returns an object with createNewDatabaseServer function is defined', function () {
            expect(upgradeFactory.createNewDatabaseServer).toEqual(jasmine.any(Function));
        });

        it('returns an object with connectDatabaseServer function is defined', function () {
            expect(upgradeFactory.connectDatabaseServer).toEqual(jasmine.any(Function));
        });

        it('returns an object with stopServices function is defined', function () {
            expect(upgradeFactory.stopServices).toEqual(jasmine.any(Function));
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

                $httpBackend.expectGET('/api/upgrade/noderepocheck', COMMON_API_V2_HEADERS)
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

        describe('when getRepositoriesChecks method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectGET('/api/upgrade/adminrepocheck', COMMON_API_V2_HEADERS)
                    .respond(200, mockedRepositoriesChecksData);
                repositoriesChecksPromise = upgradeFactory.getRepositoriesChecks();
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

        describe('when getStatus method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectGET('/api/upgrade', COMMON_API_V2_HEADERS)
                    .respond(200, mockedStatusData);
                statusPromise = upgradeFactory.getStatus();
            });

            it('returns a promise', function () {
                expect(statusPromise).toEqual(jasmine.any(Object));
                expect(statusPromise['then']).toEqual(jasmine.any(Function));
                expect(statusPromise['catch']).toEqual(jasmine.any(Function));
                expect(statusPromise['finally']).toEqual(jasmine.any(Function));
                expect(statusPromise['error']).toEqual(jasmine.any(Function));
                expect(statusPromise['success']).toEqual(jasmine.any(Function));
            });

            // getStatus success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the upgrade status response', function () {
                statusPromise.then(function (response) {
                    expect(response.status).toEqual(200);
                    expect(response.data).toEqual(mockedStatusData);
                });
                $httpBackend.flush();
            });

        });

        describe('when createAdminBackup method is executed', function () {

            beforeEach(function () {
                $httpBackend.expect('POST', '/api/upgrade/adminbackup', undefined, function (headers) {
                    return headers.Accept === COMMON_API_V2_HEADERS.Accept })
                    .respond(200, mockedCreateAdminBackupResponse);
                backupPromise = upgradeFactory.createAdminBackup();
            });

            it('returns a promise', function () {
                expect(backupPromise).toEqual(jasmine.any(Object));
                expect(backupPromise['then']).toEqual(jasmine.any(Function));
                expect(backupPromise['catch']).toEqual(jasmine.any(Function));
                expect(backupPromise['finally']).toEqual(jasmine.any(Function));
                expect(backupPromise['error']).toEqual(jasmine.any(Function));
                expect(backupPromise['success']).toEqual(jasmine.any(Function));
            });

            // backup create success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the backup response', function () {
                backupPromise.then(function (backupResponse) {
                    expect(backupResponse.status).toEqual(200);
                    expect(backupResponse.data).toEqual(mockedCreateAdminBackupResponse);
                });
                $httpBackend.flush();
            });
        });

        describe('when cancelUpgrade method is executed', function () {

            beforeEach(function () {

                $httpBackend.expectPOST('/api/upgrade/cancel', null, COMMON_API_V2_HEADERS)
                    .respond(200);
                cancelUpgradePromise = upgradeFactory.cancelUpgrade();
            });

            it('returns a promise', function () {
                expect(prepareNodesPromise).toEqual(jasmine.any(Object));
                expect(prepareNodesPromise['then']).toEqual(jasmine.any(Function));
                expect(prepareNodesPromise['catch']).toEqual(jasmine.any(Function));
                expect(prepareNodesPromise['finally']).toEqual(jasmine.any(Function));
                expect(prepareNodesPromise['error']).toEqual(jasmine.any(Function));
                expect(prepareNodesPromise['success']).toEqual(jasmine.any(Function));
            });

            it('when resolved, it returns the cancelUpgrade response', function () {
                cancelUpgradePromise.then(function (response) {
                    expect(response.status).toEqual(200);
                });
            });
        });

        describe('when stopServices method is executed', function () {
            beforeEach(function () {
                $httpBackend.expectPOST('/api/upgrade/services', null, COMMON_API_V2_HEADERS)
                    .respond(200, mockedStopServicesPromise);
                stopServicesPromise = upgradeFactory.stopServices();
            });

            it('returns a promise', function () {
                expect(stopServicesPromise).toEqual(jasmine.any(Object));
                expect(stopServicesPromise['then']).toEqual(jasmine.any(Function));
                expect(stopServicesPromise['catch']).toEqual(jasmine.any(Function));
                expect(stopServicesPromise['finally']).toEqual(jasmine.any(Function));
                expect(stopServicesPromise['error']).toEqual(jasmine.any(Function));
                expect(stopServicesPromise['success']).toEqual(jasmine.any(Function));
            });

            // stopOpenStackServices success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the stopOpenStackServices response', function () {
                stopServicesPromise.then(function (stopServicesResponse) {
                    expect(stopServicesResponse.status).toEqual(200);
                    expect(stopServicesResponse.data).toEqual(mockedStopServicesPromise);
                });
                $httpBackend.flush();
            });
        });

        describe('when createNewDatabaseServer method is executed', function () {

            beforeEach(function () {
                $httpBackend.expect('POST', '/api/upgrade/new', undefined, function (headers) {
                    return headers.Accept === COMMON_API_V2_HEADERS.Accept })
                    .respond(200, mockedNewDatabaseServerResponse);
                createNewDatabaseServerPromise = upgradeFactory.createNewDatabaseServer();
            });

            it('returns a promise', function () {
                expect(createNewDatabaseServerPromise).toEqual(jasmine.any(Object));
                expect(createNewDatabaseServerPromise['then']).toEqual(jasmine.any(Function));
                expect(createNewDatabaseServerPromise['catch']).toEqual(jasmine.any(Function));
                expect(createNewDatabaseServerPromise['finally']).toEqual(jasmine.any(Function));
                expect(createNewDatabaseServerPromise['error']).toEqual(jasmine.any(Function));
                expect(createNewDatabaseServerPromise['success']).toEqual(jasmine.any(Function));
            });

            it('when resolved, it returns the backup response', function () {
                createNewDatabaseServerPromise.then(function (newDatabaseResponse) {
                    expect(newDatabaseResponse.status).toEqual(200);
                    expect(newDatabaseResponse.data).toEqual(mockedNewDatabaseServerResponse);
                });
                $httpBackend.flush();
            });
        });

        describe('when connectDatabaseServer method is executed', function () {

            beforeEach(function () {
                $httpBackend.expect('POST', '/api/upgrade/connect', undefined, function (headers) {
                    return headers.Accept === COMMON_API_V2_HEADERS.Accept })
                    .respond(200, mockedConnectDatabaseServerResponse);
                connectDatabaseServerPromise = upgradeFactory.connectDatabaseServer();
            });

            it('returns a promise', function () {
                expect(connectDatabaseServerPromise).toEqual(jasmine.any(Object));
                expect(connectDatabaseServerPromise['then']).toEqual(jasmine.any(Function));
                expect(connectDatabaseServerPromise['catch']).toEqual(jasmine.any(Function));
                expect(connectDatabaseServerPromise['finally']).toEqual(jasmine.any(Function));
                expect(connectDatabaseServerPromise['error']).toEqual(jasmine.any(Function));
                expect(connectDatabaseServerPromise['success']).toEqual(jasmine.any(Function));
            });

            it('when resolved, it returns the backup response', function () {
                connectDatabaseServerPromise.then(function (connectDatabaseResponse) {
                    expect(connectDatabaseResponse.status).toEqual(200);
                    expect(connectDatabaseResponse.data).toEqual(mockedConnectDatabaseServerResponse);
                });
                $httpBackend.flush();
            });
        });
    });

});
