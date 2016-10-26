/*global bard $controller $httpBackend should assert upgradeStepsFactory $rootScope*/
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

        it('should contains a nextStep function ', function() {
            should.exist(controller.steps.nextStep);
            expect(controller.steps.nextStep).toEqual(jasmine.any(Function));
        });

        it('should contains an isLastStep function ', function() {
            should.exist(controller.steps.isLastStep);
            expect(controller.steps.isLastStep).toEqual(jasmine.any(Function));
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
