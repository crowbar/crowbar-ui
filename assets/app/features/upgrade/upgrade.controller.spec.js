/*global bard $controller $httpBackend should assert upgradeStepsFactory $rootScope $state*/
describe('Upgrade Controller', function () {
    var controller,
        controllerScope;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', 'upgradeStepsFactory', '$httpBackend',
            '$rootScope', '$state'
        );

        controllerScope = $rootScope.$new();

        //Mock the $state service
        bard.mockService($state, {
            go : true
        });

        //Spy on the go function
        spyOn($state, 'go');

        $state.current = {id: 0, name: 'upgrade.backup', state: 'upgrade.backup'};

        //spy on the refeshStepsList function
        spyOn(upgradeStepsFactory, 'refeshStepsList').and.callThrough();

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

        describe('nextStep function', function () {
            it('should exist', function () {
                should.exist(controller.steps.nextStep);
                expect(controller.steps.nextStep).toEqual(jasmine.any(Function));
            });

            it('when called it should move to the next step', function () {
                expect($state.current.id).toBe(0);
                // calculate the next step in the list
                var nextStep = (controller.steps.list[upgradeStepsFactory.activeStep.id + 1]).state;
                controller.steps.nextStep();
                expect($state.go).toHaveBeenCalledWith(nextStep);
            });

            it('when called in the last step it should not change steps', function () {
                // set the last step in the list as current
                $state.current = {id: 0, name: 'upgrade.upgrade-nodes', state: 'upgrade.upgrade-nodes'};
                // set last step as active
                upgradeStepsFactory.activeStep = upgradeStepsFactory.steps[upgradeStepsFactory.steps.length - 1];
                controller.steps.nextStep();
                // should have not called the state.go
                expect($state.go).not.toHaveBeenCalled();

            });
        });

        describe('isLastStep function', function () {
            it('should exist', function () {
                should.exist(controller.steps.isLastStep);
                expect(controller.steps.isLastStep).toEqual(jasmine.any(Function));
            });

            it('when called on the first step it should return false', function () {
                // set the first step in the list as current
                $state.current = {id: 0, name: 'upgrade.backup', state: 'upgrade.backup'};
                expect(controller.steps.isLastStep()).toBe(false);
            });

            it('when called on the last step it should return true', function () {
                // set the last step in the list as current
                $state.current = {id: 0, name: 'upgrade.upgrade-nodes', state: 'upgrade.upgrade-nodes'};
                // set last step as active
                upgradeStepsFactory.activeStep = upgradeStepsFactory.steps[upgradeStepsFactory.steps.length - 1];
                expect(controller.steps.isLastStep()).toBe(true);
            });
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
});
