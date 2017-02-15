/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert upgradeFactory $q upgradeStatusFactory
UPGRADE_STEPS NODES_UPGRADE_TIMEOUT_INTERVAL sinon $rootScope UNEXPECTED_ERROR_DATA */
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
            current_node: null,
            remaining_nodes: null,
            upgraded_nodes: null,
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
                current_node: {
                    alias: 'compute-1234',
                    name: 'compute.1234.suse.com',
                    ip: '123.2.3.4',
                    role: 'compute',
                    state: 'finished'
                },
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
                current_node: {
                    alias: 'compute-345',
                    name: 'compute.345.suse.com',
                    ip: '34.2.3.4',
                    role: 'compute',
                    state: 'migrating VMs'
                },
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
            'upgradeStatusFactory',
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
                    onSuccess(initialStatusResponse);
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

    describe('On syncStatusFlags success', function () {
        beforeEach(function () {
            spyOn(upgradeStatusFactory, 'syncStatusFlags').and.callFake(
                function(step, flagsObject, onRunning, onSuccess, onError, postSync) {
                    onRunning(runningUpgradeResponse);
                    postSync(runningUpgradeResponse);
                }
            );

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

                it('should update the current node\'s alias', function () {
                    expect(controller.nodesUpgrade.currentNode.alias)
                        .toEqual(runningUpgradeData.current_node.alias);
                });

                it('should update the current node\'s role', function () {
                    expect(controller.nodesUpgrade.currentNode.role)
                        .toEqual(runningUpgradeData.current_node.role);
                });

                it('should update the current node\'s state', function () {
                    expect(controller.nodesUpgrade.currentNode.state)
                        .toEqual(runningUpgradeData.current_node.state);
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

                it('should update the current node\'s alias', function () {
                    expect(controller.nodesUpgrade.currentNode.alias)
                        .toEqual(runningUpgradeData.current_node.alias);
                });

                it('should update the current node\'s role', function () {
                    expect(controller.nodesUpgrade.currentNode.role)
                        .toEqual(runningUpgradeData.current_node.role);
                });

                it('should update the current node\'s state', function () {
                    expect(controller.nodesUpgrade.currentNode.state)
                        .toEqual(runningUpgradeData.current_node.state);
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
                    onSuccess(initialStatusResponse);
                    postSync(initialStatusResponse);
                }
            );

            bard.mockService(upgradeFactory, {
                upgradeNodes: $q.when(),
                getNodesStatus: $q.when(initialNodesResponse),
            });

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();
        });

        describe('On Upgrade Nodes Success', function () {
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
                        upgradeStatusFactory.waitForStepToEnd.calls.argsFor(0)[2](completedUpgradeResponse);
                    });

                    it('should not be running', function () {
                        assert.isFalse(controller.nodesUpgrade.running);
                    });

                    it('should be completed', function () {
                        assert.isTrue(controller.nodesUpgrade.completed);
                    });

                    it('should update the current node\'s alias', function () {
                        expect(controller.nodesUpgrade.currentNode.alias)
                            .toEqual(completedUpgradeData.current_node.alias);
                    });

                    it('should update the current node\'s role', function () {
                        expect(controller.nodesUpgrade.currentNode.role)
                            .toEqual(completedUpgradeData.current_node.role);
                    });

                    it('should update the current node\'s state', function () {
                        expect(controller.nodesUpgrade.currentNode.state)
                            .toEqual(completedUpgradeData.current_node.state);
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

                    it('should update the current node\'s alias', function () {
                        expect(controller.nodesUpgrade.currentNode.alias)
                            .toEqual(runningUpgradeData.current_node.alias);
                    });

                    it('should update the current node\'s role', function () {
                        expect(controller.nodesUpgrade.currentNode.role)
                            .toEqual(runningUpgradeData.current_node.role);
                    });

                    it('should update the current node\'s state', function () {
                        expect(controller.nodesUpgrade.currentNode.state)
                            .toEqual(runningUpgradeData.current_node.state);
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

        describe('On Upgrade Nodes Error', function () {
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

    describe('On running upgrade nodes operation', function () {
        it('should disable the Upgrade Nodes button');
        it('should display the previous status');
        it('should poll the update status until the process is completed');
    });
});
