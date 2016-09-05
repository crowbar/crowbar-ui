/*global bard should expect upgradeUpgradeAdminFactory */
describe('Upgrade Upgrade Admin Factory', function () {

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarData.upgrade');
        bard.inject('upgradeUpgradeAdminFactory', '$q', '$httpBackend');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(upgradeUpgradeAdminFactory);
        });

        it('returns an object with getAdminUpgrade function defined', function () {
            expect(upgradeUpgradeAdminFactory.getAdminUpgrade).toEqual(jasmine.any(Function));
        });

/*        describe('when getAll method is executed', function () {

            beforeEach(function () {

                $httpBackend.expect('GET', '/api/upgrade7/prechecks')
                    .respond(200, mockedprechecksPromise);
                prechecksPromise = upgradePrechecksFactory.getAll();
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
                    expect(prechecksResponse.data).toEqual(mockedprechecksPromise);
                });
                $httpBackend.flush();
            });

        });*/

        it('returns an object with getAdminUpgradeStatus function defined', function () {
            expect(upgradeUpgradeAdminFactory.getAdminUpgradeStatus).toEqual(jasmine.any(Function));
        });
    });

});
