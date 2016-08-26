/*global bard $httpBackend should expect upgradeBackupFactory assert */
describe('Upgrade Backup Factory', function () {

    var mockedBackupFile = '--mockedBackupFile--',
        prechecksPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarData.upgrade');
        bard.inject('upgradeBackupFactory', '$q', '$httpBackend');
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(upgradeBackupFactory);
        });

        it('returns an object with create function is defined', function () {
            expect(upgradeBackupFactory.create).toEqual(jasmine.any(Function));
        });

        describe('when create method is executed', function () {

            beforeEach(function () {

                $httpBackend.expect('POST', '/api/upgrade7/backup')
                    .respond(200, mockedBackupFile);
                prechecksPromise = upgradeBackupFactory.create();
                $httpBackend.flush();
            });

            it('returns a promise', function () {
                expect(prechecksPromise).toEqual(jasmine.any(Object));
                expect(prechecksPromise['then']).toEqual(jasmine.any(Function));
                expect(prechecksPromise['catch']).toEqual(jasmine.any(Function));
                expect(prechecksPromise['finally']).toEqual(jasmine.any(Function));
                expect(prechecksPromise['error']).toEqual(jasmine.any(Function));
                expect(prechecksPromise['success']).toEqual(jasmine.any(Function));
            });

            // Prechecks success, partially passing and/or failing are handled in the controller.
            it('when resolved, it returns the prechecks response', function () {
                prechecksPromise.then(function (prechecksResponse) {
                    expect(prechecksResponse.status).toEqual(200);
                    assert.isFalse(prechecksResponse.config.cache);
                    expect(prechecksResponse.config.responseType).toEqual('arraybuffer');
                    expect(prechecksResponse.data).toEqual(mockedBackupFile);
                });
            });

        });
        
    });

});
