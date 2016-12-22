/* jshint -W117, -W030 */
/*global bard $controller $httpBackend should assert upgradeFactory $q */
describe('Upgrade Nodes Controller', function() {
    var controller,
        stepStatus = {
            pending: 'pending',
            running: 'running',
            passed: 'passed',
        },
        totalNodes = 125,
        initialStatusResponseData = {
            current_step: 'nodes_upgrade',
            substep: null,
            current_node: {
                alias: 'controller-1',
                name: 'controller.1234.suse.com',
                ip: '1.2.3.4',
                role: 'controller',
                state: 'pre-upgrade'
            },
            remaining_nodes: totalNodes,
            upgraded_nodes: 0,
            steps: {
                upgrade_prechecks: {
                    status: stepStatus.passed,
                    errors: {}
                },
                upgrade_prepare: {
                    status: stepStatus.passed,
                    errors: {}
                },
                admin_backup: {
                    status: stepStatus.passed,
                    errors: {}
                },
                admin_repo_checks: {
                    status: stepStatus.passed,
                    errors: {}
                },
                admin_upgrade: {
                    status: stepStatus.passed,
                    errors: {}
                },
                database: {
                    status: stepStatus.passed,
                    errors: {}
                },
                nodes_repo_checks: {
                    status: stepStatus.passed,
                    errors: {}
                },
                nodes_services: {
                    status: stepStatus.passed,
                    errors: {}
                },
                nodes_db_dump: {
                    status: stepStatus.passed,
                    errors: {}
                },
                nodes_upgrade: {
                    status: stepStatus.pending,
                    errors: {}
                },
                finished: {
                    status: stepStatus.pending,
                    errors: {}
                }
            }
        },
        initialStatusResponse = {
            data: initialStatusResponseData
        },
        failingErrors = {
            error_message: 'Authentication failure'
        },
        errorStatusResponse = {
            data:  { errors: failingErrors }
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
            'upgradeStatusFactory'
        );

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
    });

    describe('On initial getStatus success', function () {
        beforeEach(function () {

            bard.mockService(upgradeFactory, {
                getStatus: $q.when(initialStatusResponse),
            });
            //spyOn(upgradeFactory, 'getStatus');

            controller = $controller('UpgradeNodesController');

            $httpBackend.flush();
        });

        // Verify no unexpected http call has been made
        bard.verifyNoOutstandingHttpRequests();

        it('should exist', function() {
            should.exist(controller);
        });

        describe('On activation', function () {
            it('should get the upgrade status', function () {
                assert(upgradeFactory.getStatus.calledOnce);
            });

            it('should update the current node\'s alias', function () {
                expect(controller.nodesUpgrade.currentNode.name)
                    .toEqual(initialStatusResponseData.current_node.alias);
            });

            it('should update the current node\'s role', function () {
                expect(controller.nodesUpgrade.currentNode.role)
                    .toEqual(initialStatusResponseData.current_node.role);
            });

            it('should update the current node\'s state', function () {
                expect(controller.nodesUpgrade.currentNode.state)
                    .toEqual(initialStatusResponseData.current_node.state);
            });

            it('should update upgraded nodes count', function () {
                expect(controller.nodesUpgrade.upgradedNodes)
                    .toEqual(initialStatusResponseData.upgraded_nodes);
            });

            it('should update total nodes', function () {
                expect(controller.nodesUpgrade.totalNodes)
                    .toEqual(initialStatusResponseData.upgraded_nodes +
                        initialStatusResponseData.remaining_nodes);
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

    describe('On initial getStatus error', function () {
        beforeEach(function () {

            bard.mockService(upgradeFactory, {
                getStatus: $q.reject(errorStatusResponse),
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
            it('should get the upgrade status', function () {
                assert(upgradeFactory.getStatus.calledOnce);
            });
            it('should stop running', function () {
                assert.isFalse(controller.nodesUpgrade.running);
            });
            it('should expose the errors to the view model', function () {
                expect(controller.nodesUpgrade.errors).toEqual(failingErrors);
            });
        });
    });

});
