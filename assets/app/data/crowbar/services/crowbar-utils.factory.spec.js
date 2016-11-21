/*global bard $httpBackend should expect crowbarUtilsFactory assert */
describe('Crowbar Utils Factory', function () {

    var mockedBackupFile = '--mockedBackupFile--',
        backupPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('suseData.crowbar');
        bard.inject('crowbarUtilsFactory', '$q', '$httpBackend');
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(crowbarUtilsFactory);
        });

        it('returns an object with getAdminBackup function defined', function () {
            expect(crowbarUtilsFactory.getAdminBackup).toEqual(jasmine.any(Function));
        });

        describe('when getAdminBackup method is executed', function () {

            beforeEach(function () {
                $httpBackend.expect('GET', '/utils/backups/42/download')
                    .respond(200, mockedBackupFile);
                backupPromise = crowbarUtilsFactory.getAdminBackup(42);
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
                expect(crowbarUtilsFactory.getAdminBackup).toThrow();
            });
        });
    });
});
