/*global bard $controller should $httpBackend */
describe('Upgrade Flow - Upgrade Admin Server Controller', function () {
    var controller;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$q', '$httpBackend', '$rootScope');

        //Create the controller
        controller = $controller('Upgrade7UpgradeAdminController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function () {
        should.exist(controller);
    });

    describe('nextStep function', function () {
        it('should be defined', function () {});

        it('should redirect the user to "Create or Connect to Database" page when admin upgrade is successfull',
        function () {
        });

        it('should retain the user on the curent page until the admin upgrade is completed', function () {});
    });


    it('should have an adminUpgrade model defined', function () {
        should.exist(controller.adminUpgrade);
    });

    describe('beginAdminUpgrade function', function () {
        it('should be defined', function () {
            should.exist(controller.adminUpgrade.beginAdminUpgrade);
        });
        it('should send a post request to the api to start upgrade process', function () {});
        it('should set running flag to true if api accepted the request', function () {});
    });

    describe('checkAdminUpgrade function', function () {
        it('should be defined', function () {
            should.exist(controller.adminUpgrade.checkAdminUpgrade);
        });

        describe('when api reports upgrade as not completed', function () {
            it('should schedule another check', function () {});
            it('should keep running flag set to true', function () {});
            it('should keep completed flag set to false', function () {});
        });

/*        describe('when successfull', function () {
            it('should enable "Next button"', function () {});

            it('should update valid attribute of adminUpgrade model to true', function () {});

        }); */

/*        describe('on failure', function () {
            it('should maintain valid attribute of adminUpgrade model to false', function () {});

            it('should maintain disabled "Next button"', function () {});
        }); */

    });

/*    describe('cancelUpgrade function', function () {
        it('should be defined', function () {});

        describe('before trigger Admin Node Upgrade', function () {
            it('should be enabled', function () {});

            describe('cancel modal', function () {
                it('should be displayed when cancel button is clicked', function () {});

                it('should trigger the cancellation routine upon user confirmation', function () {});

                it('should be closed and let the user continue with the upgrade flow when canceled', function () {});

            });

        });

        describe('after trigger Admin Node Upgrade', function () {
            it('should be disabled', function () {});

        });

    });*/
});
