describe('Upgrade Flow - Upgrade Admin Server Controller', function () {

    it('should exist', function () {});

    describe('nextStep function', function () {
        it('should be defined', function () {});

        it('should redirect the user to "Create or Connect to Database" page when admin upgrade is successfull', function () {});

        it('should retain the user on the curent page until the admin upgrade is completed', function () {});
    });


    it('should have an adminUpgrade model defined', function () {});

    describe('checkAdminUpgrade function', function () {
        it('should be defined', function () {});

        describe('when successfull', function () {
            it('should enable "Next button"', function () {});

            it('should update valid attribute of adminUpgrade model to true', function () {});

        });

        describe('on failure', function () {
            it('should maintain valid attribute of adminUpgrade model to false', function () {});

            it('should maintain disabled "Next button"', function () {});
        });

    });

    describe('cancelUpgrade function', function () {
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

    });
});
