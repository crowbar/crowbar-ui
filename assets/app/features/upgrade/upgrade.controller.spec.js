/*global module bard $controller $httpBackend should assert upgradeStepsFactory
  upgradeFactory $rootScope $q $uibModal UPGRADE_LAST_STATE_KEY */
describe('Upgrade Controller', function () {
    var controller,
        controllerScope;

    beforeEach(function() {
        // no idea why this is needed but for some reason this module doesn't get loaded via appModule
        module('ui.bootstrap');
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', 'upgradeStepsFactory', '$httpBackend', '$uibModal',
            '$rootScope', '$q'
        );

        controllerScope = $rootScope.$new();

        spyOn($uibModal, 'open');
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

    describe('confirmCancel callback', function () {
        it('should be defined', function () {
            should.exist(controller.confirmCancel);
            expect(controller.confirmCancel).toEqual(jasmine.any(Function));
        });

        describe('when called', function () {
            beforeEach(function () {
                controller.confirmCancel();
                $rootScope.$digest();
            });

            it('should call modal service to open dialog', function() {
                expect($uibModal.open).toHaveBeenCalledTimes(1);
            });
        });
    });
});

describe('Cancel Controller', function () {
    var controller,
        controllerScope,
        mockedModalInstance,
        mockedWindow;

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller', 'upgradeStepsFactory', '$httpBackend',
            '$rootScope', '$q', 'upgradeFactory', 'UPGRADE_LAST_STATE_KEY'
        );

        controllerScope = $rootScope.$new();
        mockedModalInstance = { dismiss: jasmine.createSpy('modalInstance.dismiss') };
        mockedWindow = { location: { href: '--dummy--' } };

        bard.mockService(upgradeFactory, {
            cancelUpgrade: $q.when()
        });

        bard.mockService(upgradeStepsFactory, {
            reset: true
        });

        //Create the controller
        controller = $controller('CancelController', {
            '$scope': controllerScope,
            '$uibModalInstance': mockedModalInstance,
            '$window': mockedWindow
        });

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();
    });

    it('should exist', function() {
        should.exist(controller);
    });

    describe('cancelUpgrade callback', function () {
        it('should be defined', function () {
            should.exist(controller.cancelUpgrade);
            expect(controller.cancelUpgrade).toEqual(jasmine.any(Function));
        });

        describe('when completed', function () {
            beforeEach(function () {
                localStorage.setItem(UPGRADE_LAST_STATE_KEY, '--dummy--');

                controller.cancelUpgrade();
                $rootScope.$digest();
            });

            it('should set running to false', function() {
                assert.isFalse(controller.running);
            });

            it('should close the modal', function() {
                expect(mockedModalInstance.dismiss).toHaveBeenCalledTimes(1);
            });

            it('should remove last seen state from localStorage', function() {
                expect(localStorage.getItem(UPGRADE_LAST_STATE_KEY)).toBe(null);
            });

            it('should reset stored steps state', function() {
                assert.isTrue(upgradeStepsFactory.reset.calledOnce);
            });

            it('should redirect to dashboard', function() {
                expect(mockedWindow.location.href).toEqual('/');
            });
        });
    });
});
