describe('Upgrade 7 Controller', function () {

    it('should be defined', function () {});

    describe('Navigation bar', function () {
        it('should have a Next button defined', function () {});
        it('should have a Back button defined', function () {});
        it('should have a Cancel button defined', function () {});

        it('should calculate last Step', function () {});
        it('should allow to move to the next step', function () {});
    });
    describe('Steps sidebar', function () {
        it('should be defined', function () {});
    });

    //@TODO: Implement the following tests
    describe('cancelUpgrade function', function () {
        it('should be defined', function () {});

        it('should be enabled before step 4', function () {});

        it('should be disabled after step 4', function () {});

        describe('cancel modal', function () {
            it('should be displayed when cancel button is clicked', function () {});

            it('should trigger the cancellation routine upon user confirmation', function () {});

            it('should be closed and let the user continue with the upgrade flow when canceled', function () {});

        });

    });
});
