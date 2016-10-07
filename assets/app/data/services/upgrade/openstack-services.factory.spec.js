/*global bard $httpBackend should expect openStackFactory */
describe('OpenStack Services Factory', function () {
    var mockedStopOpenStackServicesPromise = {
            'services': true,
        },
        mockedCreateOpenstackBackupPromise = {
            'services': true,
        },
        stopOpenStackServicesPromise,
        createOpenstackBackupPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarData.upgrade');
        bard.inject('openStackFactory', '$q', '$httpBackend');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(openStackFactory);
        });

        it('returns an object with stopOpenstackServices function is defined', function () {
            expect(openStackFactory.stopOpenstackServices).toEqual(jasmine.any(Function));
        });

        it('returns an object with createOpenstackBackup function is defined', function () {
            expect(openStackFactory.createOpenstackBackup).toEqual(jasmine.any(Function));
        });

        describe('when stopOpenstackServices method is executed', function () {
            beforeEach(function () {
                $httpBackend.expect('GET', '/api/upgrade7/openstack-services/stop')
                    .respond(200, mockedStopOpenStackServicesPromise);
                stopOpenStackServicesPromise = openStackFactory.stopOpenstackServices();
            });

            it('returns a promise', function () {
                expect(stopOpenStackServicesPromise).toEqual(jasmine.any(Object));
                expect(stopOpenStackServicesPromise['then']).toEqual(jasmine.any(Function));
                expect(stopOpenStackServicesPromise['catch']).toEqual(jasmine.any(Function));
                expect(stopOpenStackServicesPromise['finally']).toEqual(jasmine.any(Function));
                expect(stopOpenStackServicesPromise['error']).toEqual(jasmine.any(Function));
                expect(stopOpenStackServicesPromise['success']).toEqual(jasmine.any(Function));
            });

            // stopOpenStackServices success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the stopOpenStackServices response', function () {
                stopOpenStackServicesPromise.then(function (stopOpenstackServicesResponse) {
                    expect(stopOpenstackServicesResponse.status).toEqual(200);
                    expect(stopOpenstackServicesResponse.data).toEqual(mockedStopOpenStackServicesPromise);
                });
                $httpBackend.flush();
            });
        });

        describe('when createOpenstackBackup method is executed', function () {
            beforeEach(function () {
                $httpBackend.expect('GET', '/api/upgrade7/openstack-services/backup')
                    .respond(200, mockedCreateOpenstackBackupPromise);
                createOpenstackBackupPromise = openStackFactory.createOpenstackBackup();
            });

            it('returns a promise', function () {
                expect(createOpenstackBackupPromise).toEqual(jasmine.any(Object));
                expect(createOpenstackBackupPromise['then']).toEqual(jasmine.any(Function));
                expect(createOpenstackBackupPromise['catch']).toEqual(jasmine.any(Function));
                expect(createOpenstackBackupPromise['finally']).toEqual(jasmine.any(Function));
                expect(createOpenstackBackupPromise['error']).toEqual(jasmine.any(Function));
                expect(createOpenstackBackupPromise['success']).toEqual(jasmine.any(Function));
            });

            it('when resolved, it returns the createOpenstackBackupServices response', function () {
                createOpenstackBackupPromise.then(function (createOpenstackBackupResponse) {
                    expect(createOpenstackBackupResponse.status).toEqual(200);
                    expect(createOpenstackBackupResponse.data).toEqual(mockedCreateOpenstackBackupPromise);
                });
                $httpBackend.flush();
            });
        });
    });
});
