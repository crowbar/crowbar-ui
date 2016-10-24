/*global bard should assert expect upgradeStepsFactory */
fdescribe('Stepes Factory', function () {
    var mockedInitialSteps = [
        {
            id: 0,
            title: 'upgrade.steps-key.codes.backup',
            state: 'upgrade.backup',
            active: false
        },
        {
            id: 1,
            title: 'upgrade.steps-key.codes.administration-repositories-checks',
            state: 'upgrade.administration-repository-checks',
            active: false
        },
        {
            id: 2,
            title: 'upgrade.steps-key.codes.upgrade-administration-server',
            state: 'upgrade.upgrade-administration-server',
            active: false
        },
        {
            id: 3,
            title: 'upgrade.steps-key.codes.database-configuration',
            state: 'upgrade.database-configuration',
            active: false
        },
        {
            id: 4,
            title: 'upgrade.steps-key.codes.nodes-repositories-checks',
            state: 'upgrade.nodes-repositories-checks',
            active: false
        },
        {
            id: 5,
            title: 'upgrade.steps-key.codes.openstack-services',
            state: 'upgrade.openstack-services',
            active: false
        },
        {
            id: 6,
            title: 'upgrade.steps-key.codes.upgrade-nodes',
            state: 'upgrade.upgrade-nodes',
            active: false
        }
    ];

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        bard.appModule('suseData.crowbar');
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

            it('should update the activeStep model with the current step', function () {
                // Given - Preconditions (set the current $state to "upgrade.backup".)

                // When - Run the refreshStepsList() function

                // Then - upgradeStepsFactory.activeStep is set to Backup
            });

            it('it should highlight the current step in the list', function () {
            });

            it('it should leave all the other states as not active', function () {
            });

        });
    });
});
