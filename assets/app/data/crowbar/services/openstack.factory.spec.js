/*global bard $httpBackend should expect openstackFactory COMMON_API_V2_HEADERS */
describe('OpenStack Factory', function () {
    var mockedCreateBackupPromise = {
            'services': true,
        },
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

        it('returns an object with createBackup function is defined', function () {
            expect(openstackFactory.createBackup).toEqual(jasmine.any(Function));
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
