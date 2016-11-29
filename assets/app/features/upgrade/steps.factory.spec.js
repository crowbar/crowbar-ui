/*global bard should assert expect upgradeStepsFactory module $state UPGRADE_LAST_STATE_KEY */
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
        ],
        initialStatusData = {
            current_step: 'upgrade_prechecks',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'pending',
                },
                upgrade_prepare: {
                    status: 'pending',
                },
                admin_backup: {
                    status: 'pending',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterPrechecks = {
            current_step: 'upgrade_prepare',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'pending',
                },
                admin_backup: {
                    status: 'pending',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataDuringPrepare = {
            current_step: 'upgrade_prepare',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'running',
                },
                admin_backup: {
                    status: 'pending',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterPrepare = {
            current_step: 'admin_backup',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'pending',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataDuringBackup = {
            current_step: 'admin_backup',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'running',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterBackup = {
            current_step: 'admin_repo_checks',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterAdminRepoChecks = {
            current_step: 'admin_upgrade',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'passed',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        };

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        module('crowbarApp.upgrade');
        bard.inject('upgradeStepsFactory', '$state', 'UPGRADE_LAST_STATE_KEY');

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

        it('returns an object with stepByState function defined', function () {
            expect(upgradeStepsFactory.stepByState).toEqual(jasmine.any(Function));
        });

        it('returns an object with stepByID function defined', function () {
            expect(upgradeStepsFactory.stepByID).toEqual(jasmine.any(Function));
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

        describe('stepByState function', function () {
            _.forEach(mockedInitialSteps, function (mockedStep) {
                it('should return step with state=' + mockedStep.state + ' when called', function () {
                    expect(upgradeStepsFactory.stepByState(mockedStep.state)).toEqual(mockedStep);
                });
            });

            it('should return undefined when called with nonexistent state', function () {
                expect(upgradeStepsFactory.stepByState('--dummy state--')).not.toBeDefined();
            });
        });

        describe('stepByID function', function () {
            _.forEach(mockedInitialSteps, function (mockedStep) {
                it('should return step with ID=' + mockedStep.id + ' when called', function () {
                    expect(upgradeStepsFactory.stepByID(mockedStep.id)).toEqual(mockedStep);
                });
            });

            it('should return undefined when called with nonexistent ID', function () {
                expect(upgradeStepsFactory.stepByID(-1)).not.toBeDefined();
                expect(upgradeStepsFactory.stepByID(9999)).not.toBeDefined();
            });
        });

        describe('lastStateForRestore function', function () {
            describe('when there is no stored last state', function () {
                beforeEach(function () {
                    localStorage.removeItem(UPGRADE_LAST_STATE_KEY);
                });
                it('should return "upgrade-landing" before any step', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(initialStatusData))
                        .toEqual('upgrade-landing');
                });
                it('should return "upgrade-landing" after prechecks', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterPrechecks))
                        .toEqual('upgrade-landing');
                });
                it('should return "upgrade-landing" during prepare', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataDuringPrepare))
                        .toEqual('upgrade-landing');
                });
                it('should return "upgrade.backup" after prepare', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterPrepare))
                        .toEqual('upgrade.backup');
                });
                it('should return "upgrade.backup" during backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataDuringBackup))
                        .toEqual('upgrade.backup');
                });
                it('should return "upgrade.backup" after backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterBackup))
                        .toEqual('upgrade.backup');
                });
                it('should return "upgrade.administration-repository-checks" after admin repo checks', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterAdminRepoChecks))
                        .toEqual('upgrade.administration-repository-checks');
                });
            });
            describe('when stored state is invalid in given case', function () {
                beforeEach(function () {
                    localStorage.setItem(UPGRADE_LAST_STATE_KEY, 'upgrade-landing');
                });
                it('should return "upgrade.backup" after backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterBackup))
                        .toEqual('upgrade.backup');
                });
            });
            describe('when stored state points to current, pending step', function () {
                beforeEach(function () {
                    localStorage.setItem(UPGRADE_LAST_STATE_KEY, 'upgrade.administration-repository-checks');
                });
                it('should return "upgrade.administration-repository-checks" after backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterBackup))
                        .toEqual('upgrade.administration-repository-checks');
                });
            });
        });

    });


});
