/*global bard $httpBackend should expect crowbarBackupFactory assert */
describe('Crowbar Backup Factory', function () {

    var mockedBackupFile = '--mockedBackupFile--',
        mockedCreateResponse = {
            id: 42
        },
        backupPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('suseData.crowbar');
        bard.inject('crowbarBackupFactory', '$q', '$httpBackend', 'COMMON_API_V2_HEADERS');
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(crowbarBackupFactory);
        });

        it('returns an object with create function defined', function () {
            expect(crowbarBackupFactory.create).toEqual(jasmine.any(Function));
        });

        it('returns an object with get function defined', function () {
            expect(crowbarBackupFactory.get).toEqual(jasmine.any(Function));
        });

        describe('when create method is executed', function () {

            beforeEach(function () {
                $httpBackend.expect('POST', '/api/crowbar/backups', undefined)
                    .respond(200, mockedCreateResponse);
                backupPromise = crowbarBackupFactory.create();
                $httpBackend.flush();
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
                    expect(backupResponse.data).toEqual(mockedCreateResponse);
                });
            });
        });

        describe('when download method is executed', function () {

            beforeEach(function () {
                $httpBackend.expect('GET', '/api/crowbar/backups/42/download')
                    .respond(200, mockedBackupFile);
                backupPromise = crowbarBackupFactory.get(42);
                $httpBackend.flush();
            });

            it('returns a promise', function () {
                expect(backupPromise).toEqual(jasmine.any(Object));
                expect(backupPromise['then']).toEqual(jasmine.any(Function));
                expect(backupPromise['catch']).toEqual(jasmine.any(Function));
                expect(backupPromise['finally']).toEqual(jasmine.any(Function));
                expect(backupPromise['error']).toEqual(jasmine.any(Function));
                expect(backupPromise['success']).toEqual(jasmine.any(Function));
            });

            // backup download success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the backup response', function () {
                backupPromise.then(function (backupResponse) {
                    expect(backupResponse.status).toEqual(200);
                    assert.isFalse(backupResponse.config.cache);
                    expect(backupResponse.config.responseType).toEqual('arraybuffer');
                    expect(backupResponse.data).toEqual(mockedBackupFile);
                });
            });
        });

        describe('when download method is executed without parameter', function () {

            it('throws an exception', function () {
                expect(crowbarBackupFactory.get).toThrow();
            });
        });
    });



});
