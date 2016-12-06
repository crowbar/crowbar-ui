/*global bard $controller $httpBackend should assert upgradeStepsFactory
  upgradeFactory $rootScope $q $state UPGRADE_LAST_STATE_KEY */
describe('Upgrade Controller', function () {
    var controller,
        controllerScope;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', 'upgradeStepsFactory', '$httpBackend',
            '$rootScope', '$q', '$state', 'upgradeFactory', 'UPGRADE_LAST_STATE_KEY'
        );

        controllerScope = $rootScope.$new();

        bard.mockService(upgradeFactory, {
            cancelUpgrade: $q.when()
        });

        //Mock the $state service
        bard.mockService($state, {
            go : true
        });
        spyOn($state, 'go');

        //spy on the refeshStepsList function
        spyOn(upgradeStepsFactory, 'refeshStepsList');

        //Create the controller
        controller = $controller('UpgradeController', {'$scope': controllerScope});

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    it('should exist', function() {
        should.exist(controller);
    });

    it('should call refeshStepsList function', function () {
        expect(upgradeStepsFactory.refeshStepsList).toHaveBeenCalled();
        expect(upgradeStepsFactory.refeshStepsList.calls.count()).toEqual(1);
    });

    it('should call refeshStepsList function, every time the View content is loaded', function () {
        controllerScope.$emit('$viewContentLoaded');
        expect(upgradeStepsFactory.refeshStepsList.calls.count()).toEqual(2);
        expect(upgradeStepsFactory.refeshStepsList).toHaveBeenCalled();
    });

    describe('steps Model', function () {
        it('should be defined', function () {
            should.exist(controller.steps);
        });

        describe('contains an Array list that', function () {
            it('should be defined ', function() {
                assert.isArray(controller.steps.list);
            });

            it('should be equal to upgradeStepsFactory.steps', function() {
                expect(controller.steps.list).toEqual(upgradeStepsFactory.steps);
            });
        });
    });

    describe('cancelUpgrade callback', function () {
        it('should be defined', function () {
            should.exist(controller.cancelUpgrade);
            expect(controller.cancelUpgrade).toEqual(jasmine.any(Function));
        });

        describe('when called', function () {
            beforeEach(function () {
                localStorage.setItem(UPGRADE_LAST_STATE_KEY, '--dummy--');

                controller.cancelUpgrade();
                $rootScope.$digest();
            });

            it('should remove last seen state from localStorage', function() {
                expect(localStorage.getItem(UPGRADE_LAST_STATE_KEY)).toBe(null);
            });

            it('should redirect to landing page', function() {
                expect($state.go).toHaveBeenCalledWith('upgrade-landing');
            });
        });
    });
});
