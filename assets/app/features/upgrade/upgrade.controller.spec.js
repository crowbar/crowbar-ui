/*global bard $controller should $httpBackend upgradeStepsFactory assert $rootScope $state */
describe('Upgrade Controller', function () {
    var controller,
        scope,
        stepsList = [
            {id: 0, title: 'first', active: false, enabled: false, state: 'state1' },
            {id: 1, title: 'second', active: false, enabled: false, state: 'state2' },
            {id: 2, title: 'third', active: false, enabled: false, state: 'state3' }
        ],
        lastStep = stepsList[stepsList.length - 1];

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp');
        bard.inject('$controller', '$rootScope', '$httpBackend', '$state', 'upgradeStepsFactory');

        // mock the factory
        bard.mockService(upgradeStepsFactory, {
            getAll: stepsList
        });

        // Mock the state
        bard.mockService($state, {
            go: true
        });

        // set current state
        $state.current  = {name: 'state1', id: 0, active: true};
        scope = $rootScope.$new();

        //Create the controller
        controller = $controller('UpgradeController', {$scope: scope});

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    describe('UpgradeController', function () {
        it('should exist', function () {
            should.exist(controller);
        });

        it('should have a step list', function() {
            should.exist(controller.steps.list);
        });

        it('should have the default activeStep', function () {
            should.exist(controller.steps.activeStep);
            expect(controller.steps.activeStep.enabled).toBe(true);
            expect(controller.steps.activeStep.id).toEqual(0);
        });

        describe('nextStep function', function () {
            it('should be defined', function () {
                should.exist(controller.steps.nextStep);
                expect(controller.steps.nextStep).toEqual(jasmine.any(Function));
            });

            it('should change step when called', function () {
                expect(controller.steps.activeStep.id).toEqual(0);
                controller.steps.nextStep();
                expect(controller.steps.activeStep.id).toEqual(1);

            });

            it('should not change step if we are on the last step', function () {
                expect(controller.steps.activeStep.id).toEqual(0);
                for (var i = 0; i < (stepsList.length - 1); i++) {
                    controller.steps.nextStep();
                }
                expect(controller.steps.activeStep.id).toEqual(lastStep.id);
                controller.steps.nextStep();
                expect(controller.steps.activeStep.id).toEqual(lastStep.id);
            })
        });

        describe('isLastStep function', function () {
            it('should be defined', function () {
                should.exist(controller.steps.isLastStep);
                expect(controller.steps.isLastStep).toEqual(jasmine.any(Function));
            });

            it('on first step should return false', function () {
                assert.isFalse(controller.steps.isLastStep());
            });

            it('after moving to last step should return true', function () {
                // set current and activeStep to the last one
                $state.current = lastStep;
                controller.steps.activeStep = lastStep;
                assert.isTrue(controller.steps.isLastStep());
            })
        });

    });

    //@TODO: Implement the following tests
    xdescribe('cancelUpgrade function', function () {
        it('should be defined', function () {});

        it('should be enabled', function () {});

        describe('cancel modal', function () {
            it('should be displayed when cancel button is clicked', function () {});

            it('should trigger the cancellation routine upon user confirmation', function () {});

            it('should be closed and let the user continue with the upgrade flow when canceled', function () {});

        });

    });
});
