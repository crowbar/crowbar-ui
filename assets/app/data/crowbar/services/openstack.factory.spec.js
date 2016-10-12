/*global bard $httpBackend should expect openstackFactory COMMON_API_V2_HEADERS */
describe('OpenStack Factory', function () {
    var mockedStopServicesPromise = {
            'services': true,
        },
        mockedCreateBackupPromise = {
            'services': true,
        },
        stopServicesPromise,
        createBackupPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('suseData.crowbar');
        bard.inject('openstackFactory', '$q', '$httpBackend', 'COMMON_API_V2_HEADERS');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(openstackFactory);
        });

        it('returns an object with stopServices function is defined', function () {
            expect(openstackFactory.stopServices).toEqual(jasmine.any(Function));
        });

        it('returns an object with createBackup function is defined', function () {
            expect(openstackFactory.createBackup).toEqual(jasmine.any(Function));
        });

        describe('when stopServices method is executed', function () {
            beforeEach(function () {
                $httpBackend.expectPOST('/api/openstack/services', null, COMMON_API_V2_HEADERS)
                    .respond(200, mockedStopServicesPromise);
                stopServicesPromise = openstackFactory.stopServices();
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

        describe('when createBackup method is executed', function () {
            beforeEach(function () {
                $httpBackend.expectPOST('/api/openstack/backup', null, COMMON_API_V2_HEADERS)
                    .respond(200, mockedCreateBackupPromise);
                createBackupPromise = openstackFactory.createBackup();
            });

            it('returns a promise', function () {
                expect(createBackupPromise).toEqual(jasmine.any(Object));
                expect(createBackupPromise['then']).toEqual(jasmine.any(Function));
                expect(createBackupPromise['catch']).toEqual(jasmine.any(Function));
                expect(createBackupPromise['finally']).toEqual(jasmine.any(Function));
                expect(createBackupPromise['error']).toEqual(jasmine.any(Function));
                expect(createBackupPromise['success']).toEqual(jasmine.any(Function));
            });

            it('when resolved, it returns the createBackupServices response', function () {
                createBackupPromise.then(function (createBackupResponse) {
                    expect(createBackupResponse.status).toEqual(200);
                    expect(createBackupResponse.data).toEqual(mockedCreateBackupPromise);
                });
                $httpBackend.flush();
            });
        });
    });
});
