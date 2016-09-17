/*global bard should expect upgradeUpgradeAdministrationServerFactory $httpBackend */
describe('Upgrade Upgrade Admin Factory', function () {
    var mockedStatusResponse = {
            'some_stuff': 'abc',
            'completed': false
        },
        testPromise;

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarData.upgrade');
        bard.inject('upgradeUpgradeAdministrationServerFactory', '$q', '$httpBackend');
    });

    describe('when executed', function () {

        it('returns an object', function () {
            should.exist(upgradeUpgradeAdministrationServerFactory);
        });

        it('returns an object with getAdminUpgrade function defined', function () {
            expect(upgradeUpgradeAdministrationServerFactory.getAdminUpgrade).toEqual(jasmine.any(Function));
        });

        describe('when getAdminUpgrade method is executed', function () {
            beforeEach(function () {
                $httpBackend.expect('POST', '/api/upgrade7/admin-upgrade')
                    .respond(200, mockedStatusResponse);
                testPromise = upgradeUpgradeAdministrationServerFactory.getAdminUpgrade();
            });

            it('returns a promise', function () {
                expect(testPromise).toEqual(jasmine.any(Object));
                expect(testPromise['then']).toEqual(jasmine.any(Function));
                expect(testPromise['catch']).toEqual(jasmine.any(Function));
                expect(testPromise['finally']).toEqual(jasmine.any(Function));
                expect(testPromise['error']).toEqual(jasmine.any(Function));
                expect(testPromise['success']).toEqual(jasmine.any(Function));
            });

            // admin upgrade starting status is handled in the controller.
            it('when resolved, it returns the test response', function () {
                testPromise.then(function (testResponse) {
                    expect(testResponse.status).toEqual(200);
                    expect(testResponse.data).toEqual(mockedStatusResponse);
                });
                $httpBackend.flush();
            });
        });


        it('returns an object with getAdminUpgradeStatus function defined', function () {
            expect(upgradeUpgradeAdministrationServerFactory.getAdminUpgradeStatus).toEqual(jasmine.any(Function));
        });

        describe('when getAdminUpgradeStatus method is executed', function () {
            beforeEach(function () {
                $httpBackend.expect('GET', '/api/upgrade7/admin-upgrade')
                    .respond(200, mockedStatusResponse);
                testPromise = upgradeUpgradeAdministrationServerFactory.getAdminUpgradeStatus();
            });

            it('returns a promise', function () {
                expect(testPromise).toEqual(jasmine.any(Object));
                expect(testPromise['then']).toEqual(jasmine.any(Function));
                expect(testPromise['catch']).toEqual(jasmine.any(Function));
                expect(testPromise['finally']).toEqual(jasmine.any(Function));
                expect(testPromise['error']).toEqual(jasmine.any(Function));
                expect(testPromise['success']).toEqual(jasmine.any(Function));
            });

            // admin upgrade status response is handled in the controller.
            it('when resolved, it returns the test response', function () {
                testPromise.then(function (testResponse) {
                    expect(testResponse.status).toEqual(200);
                    expect(testResponse.data).toEqual(mockedStatusResponse);
                });
                $httpBackend.flush();
            });
        });

    });

});
