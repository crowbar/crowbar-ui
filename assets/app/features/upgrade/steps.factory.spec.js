/*global bard should assert expect upgradeStepsFactory module $state*/
describe('Stepes Factory', function () {
    var mockedInitialSteps = [
        {
            id: 0,
            title: 'upgrade.steps-key.codes.backup',
            state: 'upgrade.backup',
            active: false,
            finished: false
        },
        {
            id: 1,
            title: 'upgrade.steps-key.codes.administration-repositories-checks',
            state: 'upgrade.administration-repository-checks',
            active: false,
            finished: false
        },
        {
            id: 2,
            title: 'upgrade.steps-key.codes.upgrade-administration-server',
            state: 'upgrade.upgrade-administration-server',
            active: false,
            finished: false
        },
        {
            id: 3,
            title: 'upgrade.steps-key.codes.database-configuration',
            state: 'upgrade.database-configuration',
            active: false,
            finished: false
        },
        {
            id: 4,
            title: 'upgrade.steps-key.codes.nodes-repositories-checks',
            state: 'upgrade.nodes-repositories-checks',
            active: false,
            finished: false
        },
        {
            id: 5,
            title: 'upgrade.steps-key.codes.openstack-services',
            state: 'upgrade.openstack-services',
            active: false,
            finished: false
        },
        {
            id: 6,
            title: 'upgrade.steps-key.codes.upgrade-nodes',
            state: 'upgrade.upgrade-nodes',
            active: false,
            finished: false
        }
    ];

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        module('crowbarApp.upgrade');
        bard.inject('upgradeStepsFactory', '$state');

    });

    describe('when executed', function () {
        it('returns an object', function () {
            should.exist(upgradeStepsFactory);
        });

        it('returns an object with steps array is defined', function () {
            assert.isArray(upgradeStepsFactory.steps);
        });

        it('returns an object with activeStep object is defined', function () {
            assert.isObject(upgradeStepsFactory.activeStep);
        });

        it('returns an object with refeshStepsList function is defined', function () {
            expect(upgradeStepsFactory.refeshStepsList).toEqual(jasmine.any(Function));
        });

        describe('steps array', function () {

            it('should contain the collection of Upgrade Steps', function () {
                expect(upgradeStepsFactory.steps).toEqual(mockedInitialSteps);
            });
        });

        describe('refeshStepsList function', function () {

            _.forEach(mockedInitialSteps, function (step, stepIndex) {
                it('should update the activeStep model with the current step: ' + step.state, function () {
                    // Given - Preconditions (set the current $state to "upgrade.backup".)
                    $state.current.name = step.state;

                    // When - Run the refeshStepsList() function
                    upgradeStepsFactory.refeshStepsList();

                    // Then - upgradeStepsFactory.activeStep is set to Backup
                    expect(upgradeStepsFactory.activeStep).toEqual(upgradeStepsFactory.steps[stepIndex]);
                });
            });

            _.forEach(mockedInitialSteps, function (mockedStep) {
                it('it should activate only the current step' + mockedStep.state + ' in the list', function () {
                    // Given - Preconditions
                    $state.current.name = mockedStep.state;

                    // When - Run the refeshStepsList() function
                    upgradeStepsFactory.refeshStepsList();

                    // Then - upgradeStepsFactory.steps is updated
                    _.forEach(upgradeStepsFactory.steps, function (step) {
                        if (step.state === mockedStep.state) {
                            assert.isTrue(step.active);
                        } else {
                            assert.isFalse(step.active);
                        }
                    });
                });
            });

        });
    });
});
