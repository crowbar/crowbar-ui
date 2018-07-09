/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert upgradeFactory $q upgradeStatusFactory upgradeStepsFactory
UPGRADE_STEPS NODES_UPGRADE_TIMEOUT_INTERVAL sinon $rootScope UNEXPECTED_ERROR_DATA $timeout */
describe('Upgrade Nodes Controller', function() {
    var controller,
        stepStatus = {
            pending: 'pending',
            running: 'running',
            passed: 'passed',
            failed: 'failed',
        },
        totalNodes = 125,
        upgradedNodes = 50,
        initialStatusResponseData = {
            current_step: 'nodes',
            substep: null,
            current_nodes: null,
            current_node_action: null,
            remaining_nodes: null,
            upgraded_nodes: null,
            compute_nodes_postponed: false,
            steps: {
                prechecks: {
                    status: stepStatus.passed,
                    errors: {}
                },
                prepare: {
                    status: stepStatus.passed,
                    errors: {}
                },
                backup_crowbar: {
                    status: stepStatus.passed,
                    errors: {}
                },
                repocheck_crowbar: {
                    status: stepStatus.passed,
                    errors: {}
                },
                admin: {
                    status: stepStatus.passed,
                    errors: {}
                },
                database: {
                    status: stepStatus.passed,
                    errors: {}
                },
                repocheck_nodes: {
                    status: stepStatus.passed,
                    errors: {}
                },
                services: {
                    status: stepStatus.passed,
                    errors: {}
                },
                backup_openstack: {
                    status: stepStatus.passed,
                    errors: {}
                },
                nodes: {
                    status: stepStatus.pending,
                    errors: {}
                },
            }
        },
        initialStatusResponse = {
            data: initialStatusResponseData
        },
        initialNodesResponse = {
            data: {
                upgraded: Array(upgradedNodes),
                not_upgraded: Array(totalNodes - upgradedNodes),
            }
        },
        failingErrors = {
            error_code: { data: 'Authentication failure', help: 'login please' }
        },
        errorStatusResponse = {
            data: { errors: failingErrors },
        },
        completedUpgradeData = _.merge(
            {},
            initialStatusResponseData,
            {
                current_step: 'finished',
                current_substep: 'end_of_upgrade',
                current_substep_status: 'finished',
                current_nodes: [{
                    alias: 'compute-1234',
                    name: 'compute.1234.suse.com',
                    ip: '123.2.3.4',
                    role: 'compute',
                    state: 'finished'
                }],
                current_node_action: 'finished upgrading',
                remaining_nodes: 0,
                upgraded_nodes: totalNodes,
                steps: {
                    nodes: {
                        status: stepStatus.passed
                    },
                }

            }
        ),
        completedUpgradeResponse = {
            data: completedUpgradeData
        },
        runningUpgradeData = _.merge(
            {},
            initialStatusResponseData,
            {
                current_nodes: [{
                    alias: 'compute-345',
                    name: 'compute.345.suse.com',
                    ip: '34.2.3.4',
                    role: 'compute',
                    state: 'migrating VMs'
                }],
                current_node_action: 'doing something',
                remaining_nodes: totalNodes - upgradedNodes,
                upgraded_nodes:  upgradedNodes,
                steps: {
                    nodes: {
                        status: stepStatus.running
                    }
                }
            }
        ),
        runningUpgradeResponse = {
            data: runningUpgradeData
        },
        failedUpgradeData = _.merge(
            {},
            initialStatusResponseData,
            {
                steps: {
                    nodes: {
                        status: stepStatus.failed,
                        errors: failingErrors,
                    }
                }
            }
        ),
        failedUpgradeResponse = {
            data: failedUpgradeData
        },
        startUpgradeResponse = {
            data: {
                compute_nodes_postponed: false,
                current_step: 'nodes',
                current_substep: 'controller_nodes',
                current_substep_status: 'running',
                upgraded_nodes:  0,
                nodes_selected_for_upgrade: 'controllers',
                steps: {
                    nodes: {
                        status: stepStatus.running
                    }
                },
            }
        },
        partialUpgradeResponse = {
            data: {
                compute_nodes_postponed: false,
                current_step: 'nodes',
                current_substep: 'controller_nodes',
                current_substep_status: 'finished',
                upgraded_nodes:  upgradedNodes,
                remaining_nodes: totalNodes - upgradedNodes,
                nodes_selected_for_upgrade: 'controllers',
                steps: {
                    nodes: {
                        status: stepStatus.running
                    }
                },
            }
        },
        resumeUpgradeStartResponse = {
            data: {
                compute_nodes_postponed: true,
                current_step: 'nodes',
                current_substep: 'controller_nodes',
                current_substep_status: 'finished',
                upgraded_nodes:  upgradedNodes,
                nodes_selected_for_upgrade: 'controllers',
                steps: {
                    nodes: {
                        status: stepStatus.running
                    }
                },
            }
        },
        resumeUpgradeRunningResponse = {
            data: {
                compute_nodes_postponed: false,
                current_step: 'nodes',
                current_substep: 'compute_nodes',
                current_substep_status: 'running',
                upgraded_nodes: upgradedNodes,
                // nodes_selected_for_upgrade: 'all',
                steps: {
                    nodes: {
                        status: stepStatus.running
                    }
                },
            }
        },
        resumeUpgradeDoneResponse = {
            data: {
                compute_nodes_postponed: false,
                current_step: 'nodes',
                current_substep: 'end_of_upgrade',
                current_substep_status: 'finished',
                // nodes_selected_for_upgrade: 'all',
                steps: {
                    nodes: {
                        status: stepStatus.passed
                    }
                },
            }
        },
        emptyResponse = {
            data: {},
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject(
            '$controller',
            '$rootScope',
            'upgradeFactory',
            '$q',
            '$httpBackend',
            '$timeout',
            'upgradeStatusFactory',
            'upgradeStepsFactory',
            'UPGRADE_STEPS',
            'NODES_UPGRADE_TIMEOUT_INTERVAL',
            'UNEXPECTED_ERROR_DATA'
        );

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
    });

    describe('On initial syncStatusFlags success', function () {
        beforeEach(function () {
            spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
                function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                    postSync(initialStatusResponse);
                }
            );

            bard.mockService(upgradeFactory, {
                getNodesStatus: $q.when(initialNodesResponse),
            });

            spyOn(upgradeStatusFactory, 'waitForStepToEnd');

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();
        });

        // Verify no unexpected http call has been made
        bard.verifyNoOutstandingHttpRequests();

        it('should exist', function() {
            should.exist(controller);
        });

        describe('On activation', function () {
            it('should sync the status flags', function () {
                expect(upgradeStatusFactory.syncStatusFlags).toHaveBeenCalledTimes(1);
            });

            it('should not call WaitForStepToEnd', function () {
                expect(upgradeStatusFactory.waitForStepToEnd).not.toHaveBeenCalled();
            });

            it('should have no current node', function () {
                expect(controller.nodesUpgrade.currentNode).toBeUndefined();
            });

            it('should update upgraded nodes count', function () {
                expect(controller.nodesUpgrade.upgradedNodes).toEqual(upgradedNodes);
            });

            it('should update total nodes', function () {
                expect(controller.nodesUpgrade.totalNodes).toEqual(totalNodes);
            });

            it('should not be completed', function () {
                assert.isFalse(controller.nodesUpgrade.completed);
            });

            it('should not be running', function () {
                assert.isFalse(controller.nodesUpgrade.running);
            });

            it('should not have spinner visible', function () {
                assert.isFalse(controller.nodesUpgrade.spinnerVisible);
            });
        });
    });

    describe('On running syncStatusFlags success', function () {
        beforeEach(function () {
            spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
                function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                    onRunning(runningUpgradeResponse);
                    postSync(runningUpgradeResponse);
                }
            );

            spyOn(upgradeStatusFactory, 'waitForStepToEnd');

            bard.mockService(upgradeFactory, {
                getNodesStatus: $q.when(initialNodesResponse),
            });

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();
        });

        // Verify no unexpected http call has been made
        bard.verifyNoOutstandingHttpRequests();

        it('should exist', function() {
            should.exist(controller);
        });

        describe('On activation', function () {
            it('should sync the status flags', function () {
                expect(upgradeStatusFactory.syncStatusFlags).toHaveBeenCalledTimes(1);
            });

            it('should call WaitForStepToEnd', function () {
                expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledTimes(1);
                expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledWith(
                    UPGRADE_STEPS.nodes,
                    NODES_UPGRADE_TIMEOUT_INTERVAL,
                    jasmine.any(Function),
                    jasmine.any(Function),
                    jasmine.any(Function)
                );
            });

            // @TODO: Should not call onSucces with a given Running response
            describe('when onSuccess callback is executed', function () {
                beforeEach(function () {
                    upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[2](runningUpgradeResponse);
                });

                it('should update the current nodes list', function () {
                    expect(controller.nodesUpgrade.currentNodes)
                        .toEqual(runningUpgradeData.current_nodes);
                });

                it('should update current action', function () {
                    expect(controller.nodesUpgrade.currentAction)
                        .toEqual(runningUpgradeData.current_node_action);
                });

                it('should update upgraded nodes count', function () {
                    expect(controller.nodesUpgrade.upgradedNodes)
                        .toEqual(runningUpgradeData.upgraded_nodes);
                });

                it('should update total nodes', function () {
                    expect(controller.nodesUpgrade.totalNodes)
                        .toEqual(runningUpgradeData.upgraded_nodes +
                            runningUpgradeData.remaining_nodes);
                });
            });

            describe('when onError callback is executed', function () {
                beforeEach(function () {
                    upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[3](failedUpgradeResponse);
                });
                it('should not be running', function () {
                    assert.isFalse(controller.nodesUpgrade.running);
                });

                it('should expose the errors to the view model', function () {
                    expect(controller.nodesUpgrade.errors.errors)
                        .toEqual(failedUpgradeResponse.data.steps.nodes.errors);
                });
            });

            describe('when onError callback is executed without error info', function () {
                beforeEach(function () {
                    upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[3](emptyResponse);
                });
                it('should not be running', function () {
                    assert.isFalse(controller.nodesUpgrade.running);
                });

                it('should expose the errors to the view model', function () {
                    expect(controller.nodesUpgrade.errors).toEqual(UNEXPECTED_ERROR_DATA);
                });
            });

            describe('when onRunning callback is executed', function () {
                beforeEach(function () {
                    upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[4](runningUpgradeResponse);
                });

                it('should update the current nodes list', function () {
                    expect(controller.nodesUpgrade.currentNodes)
                        .toEqual(runningUpgradeData.current_nodes);
                });

                it('should update current action', function () {
                    expect(controller.nodesUpgrade.currentAction)
                        .toEqual(runningUpgradeData.current_node_action);
                });

                it('should update upgraded nodes count', function () {
                    expect(controller.nodesUpgrade.upgradedNodes)
                        .toEqual(runningUpgradeData.upgraded_nodes);
                });

                it('should update total nodes', function () {
                    expect(controller.nodesUpgrade.totalNodes)
                        .toEqual(runningUpgradeData.upgraded_nodes +
                            runningUpgradeData.remaining_nodes);
                });
            });
        });
    });

    describe('On syncStatusFlags error', function () {
        beforeEach(function () {

            spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
                function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                    onError(errorStatusResponse);
                    postSync(errorStatusResponse);
                }
            );

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();
        });

        // Verify no unexpected http call has been made
        bard.verifyNoOutstandingHttpRequests();

        it('should exist', function() {
            should.exist(controller);
        });

        describe('On activation', function () {
            it('should sync the status flags', function () {
                expect(upgradeStatusFactory.syncStatusFlags).toHaveBeenCalledTimes(1);
            });

            it('should stop running', function () {
                assert.isFalse(controller.nodesUpgrade.running);
            });

            it('should expose the errors to the view model', function () {
                expect(controller.nodesUpgrade.errors.errors).toEqual(failingErrors);
            });
        });
    });


    describe('When Begin Nodes Upgrade is triggered', function () {

        beforeEach(function () {

            spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
                function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                    postSync(initialStatusResponse);
                }
            );

            bard.mockService(upgradeFactory, {
                upgradeNodes: $q.when(),
                getNodesStatus: $q.when(initialNodesResponse),
                setResumeComputeNodes: $q.when(),
            });

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();
        });

        describe('On Upgrade All Nodes Success', function () {
            beforeEach(function () {
                spyOn(upgradeStatusFactory, 'waitForStepToEnd');
                // getStatus call needs to be overridden with a upgrade running response
                upgradeFactory.getStatus = sinon.stub().returns(runningUpgradeResponse);

                controller.nodesUpgrade.beginUpgradeNodes();
                $rootScope.$digest();
            });

            it('upgradeNodes should have been called once', function () {
                assert(upgradeFactory.upgradeNodes.calledOnce);
            });

            describe('when waitForStepToEnd is called', function () {

                it('should be running', function () {
                    assert.isTrue(controller.nodesUpgrade.running);
                });
                it('should not be completed', function () {
                    assert.isFalse(controller.nodesUpgrade.completed);
                });

                it('should wait for nodesUpgrade to end', function () {
                    expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledTimes(1);
                    expect(upgradeStatusFactory.waitForStepToEnd).toHaveBeenCalledWith(
                        UPGRADE_STEPS.nodes,
                        NODES_UPGRADE_TIMEOUT_INTERVAL,
                        jasmine.any(Function),
                        jasmine.any(Function),
                        jasmine.any(Function)
                    );
                });

                describe ('when onSuccess is executed', function () {
                    beforeEach(function () {
                        spyOn(upgradeStepsFactory, 'setCurrentStepCompleted');
                        upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[2](completedUpgradeResponse);
                    });

                    it('should not be running', function () {
                        assert.isFalse(controller.nodesUpgrade.running);
                    });

                    it('should be completed', function () {
                        assert.isTrue(controller.nodesUpgrade.completed);
                    });

                    it('should update the current nodes list', function () {
                        expect(controller.nodesUpgrade.currentNodes)
                            .toEqual(completedUpgradeData.current_nodes);
                    });

                    it('should update current action', function () {
                        expect(controller.nodesUpgrade.currentAction)
                            .toEqual(completedUpgradeData.current_node_action);
                    });

                    it('should update upgraded nodes count', function () {
                        expect(controller.nodesUpgrade.upgradedNodes)
                            .toEqual(completedUpgradeData.upgraded_nodes);
                    });

                    it('should update total nodes', function () {
                        expect(controller.nodesUpgrade.totalNodes)
                            .toEqual(completedUpgradeData.upgraded_nodes +
                                completedUpgradeData.remaining_nodes);
                    });

                    it('should set current step completed', function () {
                        expect(upgradeStepsFactory.setCurrentStepCompleted).toHaveBeenCalledTimes(1);
                    });
                });

                describe ('when onError is executed', function () {
                    beforeEach(function () {
                        upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[3](errorStatusResponse);
                    });

                    it('should not be running', function () {
                        assert.isFalse(controller.nodesUpgrade.running);
                    });

                    it('should not be completed', function () {
                        assert.isFalse(controller.nodesUpgrade.completed);
                    });

                    it('should expose the errors to the view model', function () {
                        expect(controller.nodesUpgrade.errors.errors).toEqual(errorStatusResponse.data.errors);
                    });

                });

                describe ('when onRunning is executed', function () {
                    beforeEach(function () {
                        // Run onRunning callback
                        upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[4](runningUpgradeResponse);
                    });

                    it('should be running', function () {
                        assert.isTrue(controller.nodesUpgrade.running);
                    });

                    it('should not be completed', function () {
                        assert.isFalse(controller.nodesUpgrade.completed);
                    });

                    it('should update the current nodes list', function () {
                        expect(controller.nodesUpgrade.currentNodes)
                            .toEqual(runningUpgradeData.current_nodes);
                    });

                    it('should update current action', function () {
                        expect(controller.nodesUpgrade.currentAction)
                            .toEqual(runningUpgradeData.current_node_action);
                    });

                    it('should update upgraded nodes count', function () {
                        expect(controller.nodesUpgrade.upgradedNodes)
                            .toEqual(runningUpgradeData.upgraded_nodes);
                    });

                    it('should update total nodes', function () {
                        expect(controller.nodesUpgrade.totalNodes)
                            .toEqual(runningUpgradeData.upgraded_nodes +
                                runningUpgradeData.remaining_nodes);
                    });

                });
            });
        });

        describe('On Upgrade All Nodes Error', function () {
            beforeEach(function () {
                // Override upgradeNodes behavior
                upgradeFactory.upgradeNodes = sinon.stub().returns($q.reject(errorStatusResponse));

                controller.nodesUpgrade.beginUpgradeNodes();
                $rootScope.$digest();
            });


            it('should not be running', function () {
                assert.isFalse(controller.nodesUpgrade.running);
            });

            it('should not be completed', function () {
                assert.isFalse(controller.nodesUpgrade.completed);
            });

            it('should expose the errors to the view model', function () {
                expect(controller.nodesUpgrade.errors.errors).toEqual(errorStatusResponse.data.errors);
            });
        });
    });

    describe('on performing node upgrade with postpone compute node upgrade option', function () {
        beforeEach(function () {
            spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
                function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                    postSync(startUpgradeResponse);
                }
            );

            bard.mockService(upgradeFactory, {
                upgradeNodes: $q.when(),
                getNodesStatus: $q.when(initialNodesResponse),
                setResumeComputeNodes: $q.when(),
            });

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();

            spyOn(upgradeStatusFactory, 'waitForStepToEnd');
            spyOn(upgradeStepsFactory, 'setCurrentStepCompleted');
            spyOn(upgradeFactory, 'setPostponeComputeNodes');

            controller.nodesUpgrade.upgradeComputeCheckboxSelected = false;
            controller.nodesUpgrade.beginUpgradeNodes();
            $rootScope.$digest();

            upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[2](partialUpgradeResponse);
        });

        it('should not set current step completed', function () {
            expect(upgradeStepsFactory.setCurrentStepCompleted).not.toHaveBeenCalled();
        });

        it('should set compute nodes postponed', function () {
            expect(upgradeFactory.setPostponeComputeNodes).toHaveBeenCalledTimes(1);
        });
    });

    describe('on resuming compute node upgrade', function () {
        beforeEach(function () {
            spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
                function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                    postSync(resumeUpgradeStartResponse);
                }
            );

            bard.mockService(upgradeFactory, {
                upgradeNodes: $q.when(),
                getNodesStatus: $q.when(initialNodesResponse),
            });

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();

            spyOn(upgradeStatusFactory, 'waitForStepToEnd');
            spyOn(upgradeFactory, 'setResumeComputeNodes').and.returnValue($q.when());
            spyOn(upgradeStepsFactory, 'setUpgradeAll');
            spyOn(upgradeStepsFactory, 'setUpgradeStep');
            spyOn(upgradeStepsFactory, 'setCurrentStepCompleted');

            controller.nodesUpgrade.upgradeComputeCheckboxSelected = true;
            controller.nodesUpgrade.beginUpgradeNodes();
            $rootScope.$digest();
            $timeout.flush();
        });

        describe('and compute_nodes_postponed is true', function () {
            beforeEach(function () {
                upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[2](resumeUpgradeRunningResponse);

            });

            it('should call setResumeComputeNodes', function () {
                expect(upgradeFactory.setResumeComputeNodes).toHaveBeenCalledTimes(1);
            });

            it('should call setUpgradeAll', function () {
                expect(upgradeStepsFactory.setUpgradeAll).toHaveBeenCalledTimes(1);
            });

            it('should call setUpgradeStep', function () {
                expect(upgradeStepsFactory.setUpgradeStep).toHaveBeenCalledWith(2);
            });
        });

        describe('when compute node upgrade finishes', function () {
            beforeEach(function () {
                upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[2](resumeUpgradeDoneResponse);
            });

            it('should set current step completed', function () {
                expect(upgradeStepsFactory.setCurrentStepCompleted).toHaveBeenCalledTimes(1);
            });
        });

    });

    describe('on resuming compute node upgrade after compute_nodes_postponed is false', function () {
        beforeEach(function () {
            spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
                function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                    postSync(partialUpgradeResponse);
                }
            );

            bard.mockService(upgradeFactory, {
                upgradeNodes: $q.when(),
                getNodesStatus: $q.when(initialNodesResponse),
            });

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();

            spyOn(upgradeStatusFactory, 'waitForStepToEnd');
            spyOn(upgradeFactory, 'setResumeComputeNodes');
            spyOn(upgradeStepsFactory, 'setUpgradeAll');
            spyOn(upgradeStepsFactory, 'setUpgradeStep');

            controller.nodesUpgrade.beginUpgradeNodes();
            $rootScope.$digest();

            upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[2](resumeUpgradeRunningResponse);
        });

        it('should not call setResumeComputeNodes', function () {
            expect(upgradeFactory.setResumeComputeNodes).not.toHaveBeenCalled();
        });

        it('should call setUpgradeAll', function () {
            expect(upgradeStepsFactory.setUpgradeAll).toHaveBeenCalledTimes(1);
        });

        it('should call setUpgradeStep', function () {
            expect(upgradeStepsFactory.setUpgradeStep).toHaveBeenCalledTimes(1);
        });
    });

    describe('On running upgrade nodes operation', function () {
        it('should disable the Upgrade Nodes button');
        it('should display the previous status');
        it('should poll the update status until the process is completed');
    });
});
